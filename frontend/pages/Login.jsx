import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import apiUrl from './apiUrl';
let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const Stack = createStackNavigator();
    const handleLogin = async () => {
        console.log(email,
            password)
        try {
            const response = await axios.post(`${apiUrl}/login`, {
                email,
                password
            });

            const result = response.data;

            if (response.status === 200) {
                console.log(result.user);
                if (result.user.role == 1) {
                    navigation.navigate('LandmarkData');
                }
                else {
                    navigation.navigate('LandmarkData', { user: result.user });
                }
            } else {
                if (ToastAndroid) {
                    ToastAndroid.show(result.message, ToastAndroid.SHORT);
                } else {
                    alert(result.message);
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            if (ToastAndroid) {
                ToastAndroid.show('Error during login', ToastAndroid.SHORT);
            } else {
                alert('Error during login');
            }
        }
    };
    const handleRegisterNow = () => {
        navigation.navigate('Register', { user: {} });
    };

    const openLink = (url) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            {/* Image */}
            <Image source={require('../assets/download.png')} style={styles.logo} />

            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Register Now Text */}
            <TouchableOpacity onPress={handleRegisterNow}>
                <Text style={styles.registerText}>Don't have an account? Register now</Text>
            </TouchableOpacity>

            {/* Social Icons */}
            <View style={styles.iconContainer}>
                <FontAwesome name="facebook" size={20} color="#fff" onPress={() => openLink('https://www.facebook.com')} />
                <FontAwesome5 name="twitter" style={{ marginRight: 50, marginLeft: 50 }} size={20} color="#fff" onPress={() => openLink('https://twitter.com')} />
                <AntDesign name="google" size={20} color="#fff" onPress={() => openLink('https://www.google.com')} />
            </View>
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
    logo: {
        width: 150,
        height: 150,
        marginBottom: 100,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#be0f34',
        color: 'white'
    },
    buttonText: {
        color: 'white',
    },
    registerText: {
        color: '#fff',
        marginTop: 10,
    },

    iconContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',

    },
});

export default Login;
