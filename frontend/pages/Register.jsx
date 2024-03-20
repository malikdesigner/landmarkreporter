import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import apiUrl from './apiUrl';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';

let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}

const Register = ({ route: routeProp }) => {

    const Stack = createStackNavigator();
    const navigation = useNavigation();
    console.log(routeProp.params.user)
    const [step, setStep] = useState(1);

    const { date_added, dob, email, full_name, id, password, phone_code, phone_number } = routeProp.params.user || {};

    const [fullName, setFullName] = useState(full_name || '');
    const [emails, setEmail] = useState(email || '');
    const [phoneNumber, setPhoneNumber] = useState(phone_number || '');
    const [phoneCode, setPhoneCode] = useState(phone_code || '')
    const [passwords, setPassword] = useState(password || '');
    const [dofb, setDOB] = useState(dob || '');
    const [isChecked, setIsChecked] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    //let userLocation = '';
    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            ToastAndroid.CENTER,
            ToastAndroid.WHITE
        );
    };
    const getReverseGeocoding = async (latitude, longitude) => {
        let urlLInk = "https://geocode.maps.co/join/"; //get a new api key from here

        try {
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65f1799bd9e19304693331bxo16e469`);

            const data = await response.json();

            // Log the response to understand its structure
            console.log(data);

            if (data && data.display_name) {
                // Extract the formatted address from the response
                const address = data.address.residential + ',' + data.address.city + ', ' + data.address.country;
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

    useEffect(() => {
        getLocationAsync();
    }, []); // Run once on component mount

    const handleSubmit = async () => {
        console.log(isChecked);
        if (!isChecked) {
            if (ToastAndroid) {
                return showToast('Please accept terms & policy');
            } else {
                alert("Please Accept Terms and Policy");
            }
        } else {
            const formData = {
                id,
                fullName,
                dofb,
                emails,
                phoneCode,
                phoneNumber,
                passwords,
                location: userLocation

            };
            console.log(formData);
            if (id !== undefined && id !== '') {
                try {
                    // Make a POST request to your backend API using Axios
                    const response = await axios.post(`${apiUrl}/updateUser`, formData, {
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
                            ToastAndroid.show('Record Updated successfully', ToastAndroid.SHORT);
                        } else {
                            alert('Record Updated successfully');
                        }
                        navigation.navigate('FormData', { user: routeProp.params.user });
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
            else {

                try {
                    // Make a POST request to your backend API using Axios
                    const response = await axios.post(`${apiUrl}/addUser`, formData, {
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
                        navigation.navigate('Login');
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
        }
    };
    const handleBack = () => {
        setStep(step - 1);
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

        } else if (step === 3 && (!phoneCode || !phoneNumber)) {
            if (ToastAndroid) {

                showToast('Please enter both phone code and number');
            }
            else {
                alert('Please enter both phone code and number');
            }

        } else if (step === 4 && !emails) {


            if (ToastAndroid) {
                showToast('Please add your email address');
            }
            else {
                alert('Please add your email address')
            }
        }
        else if (step === 4 && !emails.includes('@')) {
            if (ToastAndroid) {
                showToast('Please add correct email');
            }
            else {
                alert('Please add correct email')
            }

        } else if (step === 5 && !passwords) {
            if (ToastAndroid) {
                showToast('Please enter your password');
            }
            else {
                alert('Please enter your password');

            }
        }
        else if (step === 6 && !dofb) {

            if (ToastAndroid) {
                showToast('Please select your date of birth');
            }
            else {
                alert('Please select your date of birth')
            }
        }
        else if (step === 6 && dofb < 16) {
            if (ToastAndroid) {
                showToast('You should be 16 years older or above');
            }
            else {
                alert('You should be 16 years older or above')
            }

        }
        // else if (step === 7 && !selectedAreas) {
        //     if (ToastAndroid) {
        //         showToast('Please select your area of interest');
        //     }
        //     else {
        //         alert('Please select your  area of interest')
        //     }
        // }

        else {
            // Proceed to the next step if validation passes
            setStep(step + 1);
        }
    };
    const handleSignout = () => {
        navigation.navigate('Login');
    };
    return (
        <View style={styles.container}>
            {step === 1 && (
                <View style={styles.container}>
                    <View style={styles.startingScreen}>
                    <Image source={require('../assets/download.jpeg')} style={styles.logo} />
                        <Text style={styles.appName}>Join Us</Text>
                        <Text style={styles.tagline}>Add Your  Landmark</Text>

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

                        placeholder="Full Name"
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
                <View style={styles.form} >
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your mobile number</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{
                                flex: 2,
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                marginBottom: 10,
                                padding: 10,
                                color: 'gray',
                            }}
                            placeholder="Code"
                            value={phoneCode}
                            onChangeText={(text) => setPhoneCode(text)}
                        />

                        {/* Phone Number Input */}
                        <TextInput
                            style={{
                                flex: 8,
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                marginBottom: 10,
                                padding: 10,
                                color: 'gray',
                            }}
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)}
                        />
                    </View>
                    {/* Next Button */}
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
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={emails}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                        Enter Your Email to Get Started.</Text>

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
            {step === 5 && (
                <View style={styles.form}>
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={passwords}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                    />
                    {/* Add more fields for Step 2 */}

                    <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                        Secure your gateway with a strong key</Text>
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
            {step === 6 && (
                <View style={styles.form}>
                    <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your DOB</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DOB"
                        value={dofb}
                        onChangeText={(text) => setDOB(text)}
                    />
                    {/* Add more fields for Step 2 */}

                    <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                        Enter the date of birth for approval</Text>
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
            

            {step === 7 && (
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
});

export default Register;
