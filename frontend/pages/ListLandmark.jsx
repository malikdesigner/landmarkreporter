import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Button, StyleSheet, Modal, TextInput, FlatList, ScrollView, Platform, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import Ionicons from Expo for the 3-dot icon
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import apiUrl from './apiUrl';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}
let api_key = "65f1799bd9e19304693331bxo16e469";
const ListLandmark = ({ usersData }) => {
    const [landmarkData, setLandmarkData] = useState([]);

    const [popupVisible, setPopupVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedlandmarkId, setSelectedLandmarkId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [filtererdLandmark, setFilteredLandmark] = useState('');
    const [landmarkName, setLandmarkName] = useState([]);
    const [selectedLandmark, setSelectedLandmark] = useState('');


    useEffect(() => {
        // fetchLandmarkData();
        fetchLandmarkName();
        fetchLandMarkFilterData(selectedLandmark); // Fetch filtered landmark data based on selected landmark
        
    }, [selectedLandmark]);
    const user = usersData.id;

    const fetchLandmarkData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/getLandmarkData`);

            if (response.data.ok) {
                console.log(response.data.landmarkData)
                setLandmarkData(response.data.landmarkData);
            } else {
                console.error('Error fetching landmark data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching landmark data:', error);
        }
    };
    const fetchLandmarkName = async () => {
        try {
            const response = await axios.get(`${apiUrl}/getLandMarkNames`);
            console.log(response)
            if (response.data.ok) {
                console.log(response.data.landmarkNames)
                setLandmarkName(response.data.landmarkNames);
            } else {
                console.error('Error fetching landmark data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching landmark data:', error);
        }
    };
    const deleteComment = async (commentID) => {
        const formData = {
            commentID
        };
        console.log(formData);
        try {
            // Make a POST request to your backend API using Axios
            const response = await axios.post(`${apiUrl}/deleteComment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            console.log(result);

            // Handle success
            if (result) {
                if (ToastAndroid) {
                    ToastAndroid.show('Comment deleted successfully', ToastAndroid.SHORT);
                } else {
                    alert('Comment deleted successfully');
                }
                fetchLandmarkData();
            } else {
                // Show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                } else {
                    alert('Error saving record');
                }
            }
        } catch (error) {
            console.error('Error during comment deletion:', error);
            // Handle error toast
            if (ToastAndroid) {
                ToastAndroid.show('Error during comment deletion', ToastAndroid.SHORT);
            } else {
                alert('Error during comment deletion');
            }
        }
    };
    const addComment = async (itemId, newComment) => {

        const formData = {
            itemId,
            newComment,
            user,
        };
        console.log(formData);
        try {
            // Make a POST request to your backend API using Axios
            const response = await axios.post(`${apiUrl}/addComment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            console.log(result);

            // Handle success
            if (result.ok) {
                if (ToastAndroid) {
                    ToastAndroid.show('Comment added successfully', ToastAndroid.SHORT);
                } else {
                    alert('Comment added successfully');
                }
                setNewComment('');
            } else {
                // Show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                } else {
                    alert('Error saving record');
                }
            }
        } catch (error) {
            console.error('Error during comment addition:', error);
            // Handle error toast
            if (ToastAndroid) {
                ToastAndroid.show('Error during comment addition', ToastAndroid.SHORT);
            } else {
                alert('Error during comment addition');
            }
        }

        fetchLandmarkData();

        setModalVisible(false); // Close the modal after adding comment
    };
    const fetchLandMarkFilterData=async(landmarkID)=>{
        let response;
        try {
            
            if(landmarkID){
                
                 response = await axios.get(`${apiUrl}/getLandmarkFilterData?landmarkID=${landmarkID}`);
            }
            else {
                
                 response = await axios.get(`${apiUrl}/getLandmarkFilterData`);
            }

            if (response.data.ok) {
                console.log(response.data.landmarkData)
                setFilteredLandmark(response.data.landmarkData);
            } else {
                console.error('Error fetching landmark data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching landmark data:', error);
        }
    }
    const renderItem = ({ item }) => (
        <>
    
        {Platform.OS !== 'android' || Platform.OS !== 'ios' ? (
        <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 10 }}>
        {/* Landmark Gallery */}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {/* Parse the JSON string to an array */}
                {item.images && JSON.parse(item.images).map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: `../assets/images/${image}` }}
                        style={{ width: 200, height: 200, marginRight: 10 }}
                    />
                ))}
            </ScrollView>
            {/* Landmark Name */}
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>{item.landmarkName}</Text>
            {/* Added From */}
            <Text>Added From: {item.addedFrom}</Text>
            {/* Comments */}
            {item.comments && item.comments.map((comment, index) => (
                <View key={index} style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{comment.commenter}</Text>
                        <Text style={{ flex: 1 }}>{comment.comment}</Text>
                        <Text style={{ flex: 1 }}>{comment.commentId}</Text>
                            <Ionicons.Button  onPress={() => deleteComment(comment.commentId)} name="trash" size={16} />
                    </View>
                </View>
            ))}
            {/* Add Comment Button */}
            <Button color='blue' style={{marginBottom:5}} title="Add Comment" onPress={() => { setSelectedLandmarkId(item.landmarkId); setModalVisible(true); }} />
        </View>
           ) : (
            <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 10 }}>
            {/* Landmark Gallery */}
            <FlatList
                horizontal
                data={JSON.parse(item.images)}
                keyExtractor={(image, index) => index.toString()}
                renderItem={({ item: image }) => (
                    <Image
                        source={{ uri: `../assets/images/${image}` }} // Check this URI
                        style={{ width: 200, height: 200, marginRight: 10 }}
                    />
                )}
                showsHorizontalScrollIndicator={false}
            />
            {/* Landmark Name */}
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>{item.landmarkName}</Text>
            {/* Added From */}
            <Text>Added From: {item.addedFrom}</Text>
            {/* Comments */}
            {item.comments && item.comments.map((comment, index) => (
                <View key={index} style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{comment.commenter}</Text>
                        <Text style={{ flex: 1 }}>{comment.comment}</Text>
                        <Text style={{ flex: 1 }}>{comment.commentId}</Text>
                        <Ionicons.Button onPress={() => deleteComment(comment.commentId)} name="trash" size={16} />
                    </View>
                </View>
            ))}
            {/* Add Comment Button */}
            <Button color='blue' style={{ marginBottom: 5 }} title="Add Comment" onPress={() => { setSelectedLandmarkId(item.landmarkId); setModalVisible(true); }} />
        </View>
        )}
    </>
);

    



    return (
        <View style={styles.mainContainer}>
            <View style={{flex:1,flexDirection:'row',marginBottom:30,marginTop:10,padding:5}}>


            <Text style={{fontWeight: 'bold',fontSize:14,padding:10}}>LANDMARKS </Text>
            <Picker
                        selectedValue={setFilteredLandmark}
                        style={styles.dropdown}
                        // onValueChange={(itemValue, itemIndex) => fetchLandMarkFilterData(itemValue)}
                        onValueChange={(itemValue, itemIndex) => setSelectedLandmark(itemValue)}
                    >
                        <Picker.Item label="Select landmark you want to see" value="" />
                        {landmarkName.map(landmark => (
                            <Picker.Item key={landmark.name} label={landmark.name} value={landmark.name} />
                        ))}
                    </Picker>
            </View>
        <FlatList
                data={filtererdLandmark}
                renderItem={renderItem}
                keyExtractor={(item) => item.landmarkId.toString()}
                style={{ padding: 10 }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.heading}>Add a Comment</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Type your comment here..."
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline={true}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />

                            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() => addComment(selectedlandmarkId, newComment)}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    roundButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black', // You can change the color
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row'
    },
    mainContainer :{

        ...Platform.select({
            ios: {
                flex: 1,
                paddingTop: 6,
                // minHeight:'100vh',
                // maxHeight: 'calc(100vh - 250px)', // Adjust as needed
                marginBottom: 10
            },
            android:{
                flex: 1,
                paddingTop: 6,
                // minHeight:'100vh',
                // maxHeight: 'calc(100vh - 250px)', // Adjust as needed
                marginBottom: 10
            },
            web:{
                paddingHorizontal: 16,
                paddingTop: 6,
                minHeight: '100vh',
                maxHeight: 'calc(100vh - 250px)', // Adjust as needed
                marginBottom: 10,
                overflowY: 'auto'
            }
        }),
    },
    container: {
        flex: 1,
        backgroundColor: '#222222',
        paddingHorizontal: 16,
        paddingTop: 6,
        // minHeight:'100vh',
        // maxHeight: 'calc(100vh - 250px)', // Adjust as needed
        marginBottom: 10
    },
    webContainer: {
        paddingHorizontal: 16,
        paddingTop: 6,
        minHeight: '100vh',
        maxHeight: 'calc(100vh - 250px)', // Adjust as needed
        marginBottom: 10,
        overflowY: 'auto'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 50,
        borderRadius: 10,
        elevation: 5,
    },
    dropdown: {
        minWidth: 300, // Adjust the minimum width as needed
        marginBottom: 10,
        padding: 10,
        marginLeft:'auto'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    star: {
        marginRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    submitButton: {
        backgroundColor: '#006e96',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentInput: {
        padding: 10,
        marginBottom: 20
    }
})
export default ListLandmark;
