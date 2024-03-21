import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Button, StyleSheet, Modal, TextInput, FlatList, ScrollView, Platform, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import Ionicons from Expo for the 3-dot icon

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
    const imageTest = '../assets/images/1710954785707.jpg';
    const [popupVisible, setPopupVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedlandmarkId, setSelectedLandmarkId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [filtererdLandmark, setFilteredLandmark] = useState('');
    const [landmarkName, setLandmarkName] = useState([]);
    const [selectedLandmark, setSelectedLandmark] = useState('');

    const { width } = useWindowDimensions();
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
                fetchLandMarkFilterData(filtererdLandmark)
                fetchLandmarkName()
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
                fetchLandMarkFilterData(filtererdLandmark)
                fetchLandmarkName()
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
    function requireAll(context) {
        return context.keys().map(context);
    }
    const handleRefresh = () => {
        // Trigger refresh by updating selectedLandmark state
        setSelectedLandmark('');
        fetchLandMarkFilterData(selectedLandmark);
    };
    const fetchLandMarkFilterData = async (landmarkID) => {
        let response;
        try {

            if (landmarkID) {

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
    const renderItem = ({ item }) => {
        if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
            return (
                <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 10 }}>
                    <View  style={{alignItems:'center'}}>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {item.images && JSON.parse(item.images).map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: `../assets/images/${image}` }}
                                style={{ width: 200, height: 200, marginRight: 10 }}
                            />
                        ))}
                    </ScrollView>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>{item.landmarkName}</Text>
                    <Text>Added By: {item.addedBy}</Text>

                    <Text>Added From: {item.addedFrom}</Text>
                    </View>
                    {item.comments && item.comments.map((comment, index) => (
                        <View key={index} style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{comment.commenter}</Text>
                                <Text style={{ flex: 1 }}>{comment.comment}</Text>
                                <Ionicons.Button onPress={() => deleteComment(comment.commentId)} name="trash" size={16} />
                            </View>
                        </View>
                    ))}
                    <Button color='blue' style={{ marginBottom: 5 }} title="Add Comment" onPress={() => { setSelectedLandmarkId(item.landmarkId); setModalVisible(true); }} />
                </View>
            );
        } else {
            const imageFiles = JSON.parse(item.images);
            const imageImports = requireAll(
                require.context('../assets/images', true, /\.(png|jpg|jpeg)$/)
            ).filter((_, i) => i < imageFiles.length);
            return (
                <View>
                    <View style={[styles.itemContainer, { width }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10 }}>{item.landmarkName}</Text>
                        {item.images &&
                            JSON.parse(item.images).map((image, index) => (
                                <Image
                                    key={index}
                                    source={imageImports[index]}
                                    style={[styles.image, { width, resizeMode: 'contain' }]}
                                />
                            ))}
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Added By: {item.addedBy}</Text>
                            <Text style={{ fontWeight: 'bold' }}>Added From: {item.addedFrom}</Text>
                        </View>
                    </View>
                    {item.comments && item.comments.map((comment, index) => (
                        <View key={index} style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{comment.commenter}</Text>
                                <Text style={{ flex: 1 }}>{comment.comment}</Text>
                                <Ionicons.Button onPress={() => deleteComment(comment.commentId)} name="trash" size={16} />
                            </View>
                        </View>
                    ))}
                    <View style={{ marginBottom: 5, width: '100%' }}>
                        <Button color='blue' title="Add Comment" onPress={() => { setSelectedLandmarkId(item.landmarkId); setModalVisible(true); }} />
                    </View>
                </View>
            );

        }
    };





    return (
        <View style={styles.mainContainer}>


            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginBottom: 30, marginTop: 10, padding: 5 }}>
                {Platform.OS !== 'android' && Platform.OS !== 'ios' ? (
                    <>
                        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>LANDMARKS </Text>
                        <View style={{flexDirection:'row'}}>
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
                        <Button color='blue' title="Refresh" onPress={() => { handleRefresh() }} />
                        </View>

                    </>
                ) : (
                    <>
                        <Text style={{ fontWeight: 'bold', fontSize: 30, padding: 5 }}>LANDMARKS </Text>
                        <View>
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
                        <Button color='blue' title="Refresh" onPress={() => { handleRefresh() }} />
                        </View>
                    </>
                )}
            </View>
            {Platform.OS !== 'android' && Platform.OS !== 'ios' ? (
                <FlatList
                data={filtererdLandmark}
                renderItem={renderItem}
                keyExtractor={(item) => item.landmarkId.toString()}
                style={{ padding: 10,marginTop:40 }}
/>
                ):(
                <FlatList
                    data={filtererdLandmark}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.landmarkId.toString()}
                    style={{ padding: 10,paddingBottom:100 }}
                    horizontal
                    showsHorizontalScrollIndicator
                    pagingEnabled
                    bounces={false}
                
            />
            )}
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
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
        height: 200,
        marginBottom: 5
    },
    mainContainer: {

        ...Platform.select({
            ios: {
                flex: 1,
                paddingTop: 6,
                // minHeight:'100vh',
                // maxHeight: 'calc(100vh - 250px)', // Adjust as needed
                marginBottom: 10
            },
            android: {
                flex: 1,
                paddingTop: 6,
                // minHeight:'100vh',
                // maxHeight: 'calc(100vh - 250px)', // Adjust as needed
                marginBottom: 10
            },
            web: {
                paddingHorizontal: 16,
                paddingTop: 6,
                paddingBottom:10,
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
        marginBottom: 5,
        padding: 5,
        //marginLeft: 'auto'
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
