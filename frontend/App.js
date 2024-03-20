import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddLandmark from './pages/AddLandmark';
import Login from './pages/Login';
import Register from './pages/Register';
import LandmarkData from './pages/LandmarkData';
import ListLandmark from './pages/ListLandmark';
export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen options={{
          headerShown: false,
        }} name="Login" component={Login} />
        <Stack.Screen options={{
          headerShown: false,
        }} name="Register" component={Register} />
    <Stack.Screen options={{
          headerShown: false,
        }} name="AddLandmark" component={AddLandmark} />
        <Stack.Screen options={{
          headerShown: false,
        }} name="LandmarkData" component={LandmarkData} />
         <Stack.Screen options={{
          headerShown: false,
        }} name="ListLandmark" component={ListLandmark} />
      </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
