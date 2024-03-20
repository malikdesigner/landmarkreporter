import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import Ionicons from Expo for the 3-dot icon
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import apiUrl from './apiUrl';
import axios from 'axios';
import ListLandmark from './ListLandmark';

let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}
let api_key = "65f1799bd9e19304693331bxo16e469";
const LandmarkData = ({ navigation, route: routeProp }) => {
    // const [userLocation, setUserLocation] = useState([]);
    const userName = useState(routeProp.params.user.full_name);
    const [menuVisible, setMenuVisible] = useState(false);
    const usersData = routeProp.params.user;

    const openMenu = () => {
        if (menuVisible == false) {
            setMenuVisible(true);
        }
        else {
            setMenuVisible(false);

        }
    }
    const addNewLandmark = () => {
        // if(Platform.OS=='android' || Platform.OS=='ios'){

        //     navigation.navigate('AddLandmark', { user: routeProp.params.user });
        // }
        // else {
        //     alert("Need to Use Mobile Application for this Feature")
        // }
        navigation.navigate('AddLandmark', { user: routeProp.params.user });
    }
    const editProfile=()=>{
        navigation.navigate('Register', { user: routeProp.params.user });

    }
    console.log(userName)
    const handleSignOut = () => {
        navigation.navigate('Login');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.containerTop, { backgroundColor: 'blue' }]}>
                {/* Custom top menu */}
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={openMenu}>
                    <FontAwesome5 name="bars" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuButton, { backgroundColor: 'blue' }]} onPress={openMenu}>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </TouchableOpacity>

                {/* Conditional rendering of the menu */}
                {menuVisible && (
                    <View style={styles.menu}>
                        <Text style={styles.menuItem}><FontAwesome5 name="user" size={24} color="white" />   {userName}</Text>
                        {/* <Text style={styles.menuItem}><FontAwesome5 name="user-cog" size={24} color="white" />  </Text> */}
                        {Platform.OS == 'android' && (
                            <TouchableOpacity onPress={addNewLandmark}>
                                <Text style={styles.menuItem}> <FontAwesome5 name="plus" size={24} color="white" /> Add Landmark </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={editProfile}>
                                <Text style={styles.menuItem}><FontAwesome5 name="edit" size={24} color="white" /> Edit Profile </Text>
                            </TouchableOpacity>
                        <TouchableOpacity onPress={handleSignOut}>
                            <Text style={styles.menuItem}><FontAwesome5 name="sign-out-alt" size={24} color="white" />   Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <ListLandmark usersData={usersData} />
            <View style={styles.containerMain}>
                {Platform.OS == 'android' && (
                    <TouchableOpacity style={[styles.addButton, styles.androidButton]} onPress={addNewLandmark}>
                        <FontAwesome5 name="plus" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        backgroundColor: '#fcfafa',
        overflowY: 'auto',
    },
    containerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1,
        height: 40,
    },
    containerMain: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end', // Align to the right
    },
    menuButton: {
        marginRight: 10,
        zIndex: 100,
        marginLeft: 70,
    },
    menu: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'grey',
        paddingHorizontal: 40,
        borderRadius: 5,
        zIndex: 999,
    },
    menuItem: {
        color: 'white',
        fontSize: 20,
        marginRight: 15,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#006e96',
        width: 50,
        height: 50,
        borderRadius: 25, // Make it circular
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Adjust as needed
        marginRight: 20, // Adjust as needed
        bottom: 40, // Adjust as needed
        // right: 10, // Adjust as needed
        // left:60,
        right: 1,
        zIndex: 9999, // Ensure it's displayed on top
    },
    androidButton: {
        right: 1, // Adjust as needed
    },
});
export default LandmarkData;
