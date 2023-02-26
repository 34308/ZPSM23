/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import React from 'react';

import Registration from './Components/Screens/Registration';
import Restaurants from './Components/Screens/Restaurants';
import Dishes from './Components/Screens/Dishes';
import Dish from './Components/Screens/Dish';
import Login from './Components/Screens/Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS} from './Components/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image} from 'react-native';

const MainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.mainOrange,
    background: COLORS.lightOrangeButton,
    card: COLORS.mainBrown,
    text: 'white',
    border: 'black',
    // notification: 'rgb(255, 69, 58)',
  },
};

function App() {
  SplashScreen.hide();
  const Drawer = createDrawerNavigator();
  const Stack = createNativeStackNavigator();
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
  function DrawerPart() {
    return (
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerPressColor: COLORS.lightOrangeButton,
          headerShadowVisible: true,
          headerTintColor: COLORS.mainBrown,
          drawerActiveBackgroundColor: COLORS.secondOrange,
          drawerActiveTintColor: COLORS.mainBrown,
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 15,
          },
          itemStyle: {flex: 1, marginVertical: 5},
        }}>
        {/*<Image source={require('./images/logo.jpg')} />*/}
        <Drawer.Screen
          options={{
            title: 'Restauracje',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="home"
                size={size}
                color={focused ? COLORS.mainBrown : '#ccc'}
              />
            ),
          }}
          name="Restaurants"
          component={Restaurants}
        />
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Zaloguj się',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="user-circle-o"
                size={size}
                color={focused ? COLORS.mainBrown : '#ccc'}
              />
            ),
          }}
        />
        <Drawer.Screen
          options={{
            title: 'Utwórz konto',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="user-plus"
                size={size - 2}
                color={focused ? COLORS.mainBrown : '#ccc'}
              />
            ),
          }}
          name="Registrations"
          component={Registration}
        />
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
