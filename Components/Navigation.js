import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';

import Registration from './Screens/Registration';
import Restaurants from './Screens/Restaurants';
import Dishes from './Screens/Dishes';
import Dish from './Screens/Dish';
import Login from './Screens/Login';
import Settings from './Screens/Settings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Checkout from './Screens/Checkout';
import {Image, View} from 'react-native';
import {loginReducer} from './Reducer';
import {JWT, LOGIN, LOGOUT} from './actions';
import {useDispatch} from 'react-redux';
import store from './store';
import {getData} from './StorageHelper';
import {isTokenExp, LogOut} from './Utilities';
import {COLORS} from './Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import EditProfile from './Screens/EditProfile';

function Navigation() {
  const Drawer = createDrawerNavigator();
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  const [checkOldToken, checked] = useState(false);

  useEffect(() => {
    if (!checkOldToken) {
      getData(JWT).then(token => {
        if (token !== null) {
          if (!isTokenExp(token)) {
            dispatch({type: LOGIN, payload: token});
          }
        }
      });
      checked(true);
    }
  }, [checkOldToken, dispatch]);
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
          headerTintColor: COLORS.second,
        }}>
        <Stack.Screen name="EditScreen" component={EditProfile} />
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
            borderColor: COLORS.second,
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
        {store.getState().isLoggedIn ? (
          <View>
            <DrawerItem
              onPress={() => LogOut(props.navigation, dispatch)}
              label="Wyloguj się"
              labelStyle={{fontSize: 15, color: 'black', fontWeight: 'normal'}}
              icon={() => <Ionicons name="exit" size={22} color="#ccc" />}
            />
          </View>
        ) : null}
      </DrawerContentScrollView>
    );
  }
  function DrawerPart() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerPressColor: COLORS.lightOrangeButton,
          headerShadowVisible: true,
          headerTintColor: COLORS.second,
          drawerActiveBackgroundColor: COLORS.second,
          drawerActiveTintColor: COLORS.main,
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 15,
          },
          itemStyle: {flex: 1, marginVertical: 5},
        }}
        initialRouteName="Restaurants"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          options={{
            title: 'Restauracje',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="home"
                size={size - 2}
                color={focused ? COLORS.main : '#ccc'}
              />
            ),
          }}
          name="Restaurants"
          component={Restaurants}
        />

        {store.getState().isLoggedIn ? (
          <Drawer.Screen
            options={{
              title: 'Ustawienia',
              drawerIcon: ({focused, size}) => (
                <Icon
                  name="user-circle-o"
                  size={size - 3}
                  color={focused ? COLORS.main : '#ccc'}
                />
              ),
            }}
            name="Settings"
            component={Settings}
          />
        ) : (
          <Drawer.Screen
            options={{
              title: 'Zaloguj się',
              drawerIcon: ({focused, size}) => (
                <Icon
                  name="user-circle-o"
                  size={size - 3}
                  color={focused ? COLORS.main : '#ccc'}
                />
              ),
            }}
            name="Login"
            component={Login}
          />
        )}

        {store.getState().isLoggedIn ? (
          <Drawer.Screen
            options={{
              title: 'Koszyk',
              drawerIcon: ({focused, size}) => (
                <Icon
                  name="shopping-cart"
                  size={size - 2}
                  color={focused ? COLORS.main : '#ccc'}
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
                  color={focused ? COLORS.main : '#ccc'}
                />
              ),
            }}
            name="Registration"
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
