import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import React, {useEffect, useState} from 'react';

import Registration from './Screens/Registration';
import Restaurants from './Screens/Restaurants';
import Dishes from './Screens/Dishes';
import Dish from './Screens/Dish';
import Login from './Screens/Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Checkout from './Screens/Checkout';
import {Image} from 'react-native';
import {loginReducer} from './Reducer';
import {LOGIN, LOGOUT} from './actions';
import {Provider as StoreProvider, useDispatch} from 'react-redux';
import store from './Screens/store';

function Navigation() {
  const Drawer = createDrawerNavigator();
  let interval;
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    interval = setInterval(() => {
      console.log('check if logged', store.getState());
    }, 1000);
  }, []);
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
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        {/*//przed lista z Drawer Part*/}
        <Image
          style={{height: 30, width: 30}}
          source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
        />
        <DrawerItemList {...props} />
        {/*//po liscie z Drawer Part*/}
        {store.getState() ? <DrawerItem onPress={LogOut} label="Logout" /> : null}
      </DrawerContentScrollView>
    );
  }
  function LogOut() {
    dispatch({
      type: LOGOUT,
      payload: false,
    });
  }
  function DrawerPart() {
    return (
      <Drawer.Navigator
        initialRouteName="Login"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Restaurants" component={Restaurants} />
        {store.getState() ? (
          <Drawer.Screen name="Checkout" component={Checkout} />
        ) : (
          <Drawer.Screen name="Registrations" component={Registration} />
        )}
      </Drawer.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <StackPart />
    </NavigationContainer>
  );
}

export default Navigation;
