import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Platform, FlatList, TouchableOpacity, ScrollView } from 'react-native';
 import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { CheckBox } from 'react-native-elements';
import * as Location from 'expo-location';

import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import Ionicons from '@expo/vector-icons/Ionicons'
import apiUrl from './apiUrl';
const imgDir = FileSystem.documentDirectory + 'images/';
console.log(imgDir)
const ensureDirExist = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });

    }
}
let ToastAndroid;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
    ToastAndroid = require('react-native').ToastAndroid;
}
const AddLandmark = ({ navigation, route: routeProp }) => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [landmark, setLandmark] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const usersData = routeProp.params.user;
    console.log(usersData.id)
    //const navigation = useNavigation();



    const [userLocation, setUserLocation] = useState(null);
    // const deleteDirectory = async () => {
    //     const imgDir = FileSystem.documentDirectory + 'images/';
    //     try {
    //         await FileSystem.deleteAsync(imgDir, { idempotent: true });
    //         console.log('Directory deleted successfully');
    //     } catch (error) {
    //         console.error('Error deleting directory:', error);
    //     }
    // };

    const saveImage = async (uri) => {
        await ensureDirExist();
        const fileName = new Date().getTime() + '.jpg';
        const dest = imgDir + fileName;
        await FileSystem.copyAsync({ from: uri, to: dest });
        setImages([...images, dest]);

    }
    useEffect(() => {
        loadImages()
        getLocationAsync()
    }, []);
    const getReverseGeocoding = async (latitude, longitude) => {
        //let urlLInk="https://geocode.maps.co/join/"; //get a new api key from here

        try {
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65f19c0f3d28a781617842xtsaa8667`);
          
            const data = await response.json();

            // Log the response to understand its structure
            console.log(data);

            if (data && data.display_name) {
                // Extract the formatted address from the response
                const address =  data.address.city+', '+ data.address.country;
                return address;
            } else {
                console.error('Geocoding request failed:', data);
                return null;
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
            return null;
        }
    };
    const getLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Location permission not granted');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
       
        const address = await getReverseGeocoding(location.coords.latitude, location.coords.longitude);
        setUserLocation(address)
        console.log('Current location:', address);
    };
    const loadImages = async () => {
        await ensureDirExist();
        const files = await FileSystem.readDirectoryAsync(imgDir);
        if (files.length > 0) {
            setImages(files.map(f => imgDir + f));
        }
    }
    const deleteImage = async (uri) => {
        await FileSystem.deleteAsync(uri);
        setImages(images.filter((i) => i !== uri));

    }
    const uploadImage = async (uri) => {
        console.log(uri);
        const res = await FileSystem.uploadAsync('http://192.168.100.127:80/landmarkreporter/upload.php', uri, {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'file'
        });
        console.log(res);
        if (res && res.body) {
            const data = JSON.parse(res.body);
            if (data.success) {
                const imagePath = data.image;
                console.log('Image uploaded successfully. Path:', imagePath);
                // Only add the URL to the state

                setLandmark(prevUrls => {
                    const updatedUrls = [...prevUrls, imagePath];
                    console.log(updatedUrls);
                    return updatedUrls;
                });
                deleteImage(uri);

                console.log(landmark);
            } else {
                console.error('Upload failed. Message:', data.message);
            }
        } else {
            console.error('Unexpected response:', res);
        }
    };

    const renderItem = ({ item }) => {
        const fileName = item.split('/').pop();
        return (
            <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
                <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
                <Text style={{ flex: 1 }}>{fileName}

                </Text>
                <Ionicons.Button name="cloud-upload" onPress={() => uploadImage(item)} />
                <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />
            </View>
        )
    }

    const selectImage = async (useLibrary) => {
        let result;
        // const options:ImagePicker.ImagePickerOptions ={
        // mediaTypes:ImagePicker.MediaTypeOptions.Images,
        // allowsEditing:true,
        // aspect:[4,3],
        // quality:0.75
        // }
        const options = {
            mediaType: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        };
        if (useLibrary) {
            result = await ImagePicker.launchImageLibraryAsync(options)
        }
        else {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync(options)
        }
        if (!result.canceled) {
            const source = result.assets[0].uri;
            // setSelectedImage(source);
            // setLandmark(source);
            saveImage(source)
        }
    }

    const handleBack = () => {
        setStep(step - 1);
    };
    const handleSignout = () => {
        navigation.navigate('Login');
    };
    const handleNext = () => {
        // Perform validation
        if (step === 2 && (!fullName)) {
            if (ToastAndroid) {

                showToast('Please enter your name');
            }
            else {
                alert('Please enter your name');
            }

        }
        if (step === 3 && landmark.length == 0) {
            if (ToastAndroid) {

                showToast('Please Upload at least one Image');
            }
            else {
                alert('Please Upload at least one Image');
            }
        }
        // else if (step === 3 && landmark.length > 0) {
        //     deleteImage(uri);

        // }

        else {
            // Proceed to the next step if validation passes
            setStep(step + 1);
        }
    };
    const handleSubmit = async () => {
        console.log(isChecked);
        console.log(userLocation)
        if (!isChecked) {
            if (ToastAndroid) {
                return showToast('Please accept terms & policy');
            } else {
                alert("Please Accept Terms and Policy");
            }
        } else {
           await getLocationAsync()
            const formData = {
                fullName,
                landmark,
                addedBy:usersData.id,
                location: userLocation

            };
            console.log(formData);
            try {
                // Make a POST request to your backend API using Axios
                const response = await axios.post(`${apiUrl}/addLandmark`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = response.data;
                console.log(result);

                // Handle success
                if (result.ok) {
                    // Show a success toast
                    if (ToastAndroid) {
                        ToastAndroid.show('Record saved successfully', ToastAndroid.SHORT);
                    } else {
                        alert('Record saved successfully');
                    }
                    navigation.navigate('LandmarkData', { user: routeProp.params.user });
                } else {
                    // Show an error toast
                    if (ToastAndroid) {
                        ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                    } else {
                        alert('Error saving record');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle network error and show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show('Network error', ToastAndroid.SHORT);
                } else {
                    alert('Network error');
                }
            }

        }
    };
    return (
        <View style={styles.container}>
            {step === 1 && (
                <View style={styles.container}>
                    <View style={styles.startingScreen}>
                        <Image source={require('../assets/download.png')} style={styles.logo} />
                        <Text style={styles.appName}>Add Your  Landmark</Text>

                        <Text style={styles.tagline}>To Our  App!</Text>

                        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                            <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>
                                <Text style={styles.buttonTextLarge}>Get Started</Text>
                                <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.getStartedButton} onPress={handleSignout}>
                                <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                                <Text style={styles.buttonTextLarge}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            )}
            {step === 2 && (
                <View style={styles.form} >
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter your Name</Text>
                    <TextInput
                        style={styles.input}

                        placeholder="Name of landmark"
                        value={fullName}
                        onChangeText={(text) => setFullName(text)}
                    />


                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
                        <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            {step === 3 && (
                <View style={styles.form}>
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Upload the image</Text>

                    <TouchableOpacity style={[styles.uploadButton, { marginTop: 20, marginBottom: 20 }]} onPress={() => selectImage(true)}>
                        <Text style={styles.buttonText}>Open Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.uploadButton, { marginTop: 20, marginBottom: 20 }]} onPress={() => selectImage(false)}>
                        <Text style={styles.buttonText}>Open Camera</Text>
                    </TouchableOpacity>
                    <FlatList data={images} renderItem={renderItem} />

                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
                        <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            {step === 4 && (
                <View style={styles.form}>
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Terms & Privacy Notice</Text>
                    {/* Add more fields for Step 2 */}
                    <CheckBox
                        title={
                            <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                                By submitting, I confirm that I have read and understood the  terms of use and privacy policy.
                            </Text>
                        }
                        checked={isChecked} // Replace isChecked with your state variable for the checkbox
                        onPress={() => setIsChecked(!isChecked)} // Replace setChecked with your state update function
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, marginTop: 20 }}
                    />

                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Add more steps as needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#222222'

    },
    form: {
        paddingTop: 40,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        height: '90%',
        width: '90%',
        marginTop: 20,
        marginBottom: 10,

        marginBottom: '5%',
        color: 'gray',

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        color: 'gray'
    },
    roundButton: {
        width: 100,
        height: 50,
        backgroundColor: '#be0f34',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row'
    },
    backButton: {
        width: 100,
        height: 50,
        backgroundColor: '#be0f34',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row'
    },
    uploadButton: {
        height: 50,
        backgroundColor: '#be0f34',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',

        flexDirection: 'row'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    datetimePickerButton: {
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: 'blue', // You can change the color
        padding: 2,
        borderRadius: 5,
        marginTop: 2,
        marginBottom: 2,
        alignItems: 'center',
    },
    selectedDateText: {
        marginVertical: 10,
    },


    startingScreen: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
        marginTop: 70
    },
    appName: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
        padding: 20
    },
    logo: {
        width: 200,
        height: 200,
        padding: 30,

    },
    tagline: {
        fontSize: 40,
        padding: 10,
        color: '#e3eafa',


    },
    getStartedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#be0f34',
        padding: 15,
        paddingRight: 100,
        paddingLeft: 100,

        borderRadius: 10,
        marginBottom: 10
    },
    buttonTextLarge: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        color: 'white',
    },
    stepsHeading: {
        fontSize: 30,
        color: 'brown',
        fontWeight: 'bold'
    },
    dropdown: {
        minWidth: 100, // Adjust the minimum width as needed
        marginBottom: 10,
        padding: 5
    },
    countryLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedImage: {
        alignItems: 'center',
        marginTop: 20
    }
});
export default AddLandmark;