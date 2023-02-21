/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import React from 'react';

import Registration from './Components/Screens/Registration';
import Restaurants from './Components/Screens/Restaurants';
import Dishes from './Components/Screens/Dishes';
import Dish from './Components/Screens/Dish';
import Login from './Components/Screens/Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function App() {
  SplashScreen.hide();
  const Drawer = createDrawerNavigator();
  const Stack = createNativeStackNavigator();
  function StackPart() {
    return (
      <Stack.Navigator
        initialRouteName={'Drawer'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Drawer" component={DrawerPart} />
        <Stack.Screen name="Dish" component={Dish} />
        <Stack.Screen name="Dishes" component={Dishes} />
      </Stack.Navigator>
    );
  }
  function DrawerPart() {
    return (
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Registrations" component={Registration} />
        <Drawer.Screen name="Restaurants" component={Restaurants} />
      </Drawer.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <StackPart />
    </NavigationContainer>
  );
}

export default App;
