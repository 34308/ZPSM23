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
import {Image, View} from 'react-native';
import {loginReducer} from './Reducer';
import {LOGIN, LOGOUT} from './actions';
import {Provider as StoreProvider, useDispatch} from 'react-redux';
import store from './Screens/store';
import {COLORS} from './Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

function Navigation() {
  const Drawer = createDrawerNavigator();
  let interval;
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  useEffect(() => {}, []);
  function StackPart() {
    return (
      <Stack.Navigator
        initialRouteName={'Drawer'}
        screenOptions={{
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Ubuntu-Medium',
            color: COLORS.lightOrangeButton,
          },
          tabBarIconStyle: {display: 'none'},
          tabBarStyle: {
            backgroundColor: COLORS.mainOrange,
          },
          contentStyle: {backgroundColor: 'white'},
          headerShown: false,
          backgroundColor: 'white',
          headerTintColor: COLORS.mainBrown,
        }}>
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
        {/*Tymczasowe style*/}
        <View
          style={{
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'center',
            alignContent: 'center',
            margin: 10,
            borderBottomWidth: 1,
            borderColor: COLORS.mainBrown,
          }}>
          <Image
            style={{
              height: 100,
              width: 100,
              marginBottom: 10,
            }}
            source={require('./Screens/logo.png')}
          />
        </View>
        <DrawerItemList {...props} />
        {/*//po liscie z Drawer Part*/}
        {store.getState() ? (
          <DrawerItem onPress={LogOut} label="Logout" />
        ) : null}
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
        screenOptions={{
          headerPressColor: COLORS.lightOrangeButton,
          headerShadowVisible: true,
          headerTintColor: COLORS.mainBrown,
          drawerActiveBackgroundColor: COLORS.mainBrown,
          drawerActiveTintColor: COLORS.mainOrange2,
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 15,
          },
          itemStyle: {flex: 1, marginVertical: 5},
        }}
        initialRouteName="Login"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          options={{
            title: 'Zaloguj się',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="user-circle-o"
                size={size - 3}
                color={focused ? COLORS.mainOrange2 : '#ccc'}
              />
            ),
          }}
          name="Login"
          component={Login}
        />
        <Drawer.Screen
          options={{
            title: 'Restauracje',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="home"
                size={size - 2}
                color={focused ? COLORS.mainOrange2 : '#ccc'}
              />
            ),
          }}
          name="Restaurants"
          component={Restaurants}
        />
        {store.getState() ? (
          <Drawer.Screen
            options={{
              title: 'Koszyk',
              drawerIcon: ({focused, size}) => (
                <Icon
                  name="shopping-cart"
                  size={size - 2}
                  color={focused ? COLORS.mainOrange2 : '#ccc'}
                />
              ),
            }}
            name="Checkout"
            component={Checkout}
          />
        ) : (
          <Drawer.Screen
            options={{
              title: 'Utwórz konto',
              drawerIcon: ({focused, size}) => (
                <Icon
                  name="user-plus"
                  size={size - 4}
                  color={focused ? COLORS.mainOrange2 : '#ccc'}
                />
              ),
            }}
            name="Registrations"
            component={Registration}
          />
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
