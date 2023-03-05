import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUserName, LogOut} from '../Utilities';
import store from '../store';
import NetInfo from '@react-native-community/netinfo';
import {NOINTERNET, SERVER_ERROR} from '../actions';

export default function Settings({navigation}) {
  function deleteAccount() {
    // Alert.alert('Usuń konto', 'Czy na pewno chcesz usunąć konto', [
    //   {text: 'OK', onPress: () => navigation.navigate('Home Page')},
    // ]);
    Alert.alert('Usuń konto', 'Czy na pewno chcesz usunąć konto?', [
      {text: 'Usuń', onPress: () => deletePost()},
      {
        text: 'Wróć',
        onPress: () => console.log('Cancel Pressed'),
      },
    ]);
  }

  function getUser() {
    let user = getUserName(store.getState().token);
    alert(user);
  }
  async function getUser() {
    const resp = await fetch('http://10.0.2.2:8082/broniq1/user', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + store.getState().token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    }).catch(error => {
      NetInfo.fetch().then(state => {
        state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
      });
    });
    const data = await resp.text();
    console.log(data);
  }
  async function deletePost() {
    let user = getUserName(store.getState().token);
    let url = 'http://10.0.2.2:8082/' + user + '/user/delete';
    try {
      await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + store.getState().token,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      }).catch(error => {
        NetInfo.fetch().then(state => {
          state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
        });
      });
      LogOut(navigation, store.dispatch);
      console.log('Delete successful.');
    } catch (error) {
      console.log('Error while deleting account.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TouchableOpacity style={styles.borderBox}>
          <View style={styles.row}>
            <Icon name="user" style={styles.iconLeft} />
            <Text style={styles.text}>Edytuj profil</Text>
            {/*<Icon name="angle-right" style={styles.iconRight} />*/}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.borderBox}
          onPress={() => deleteAccount()}>
          <View style={styles.row}>
            <Icon name="remove" style={styles.iconLeft} />
            <Text style={styles.text}>Usuń konto</Text>
            {/*<Icon name="angle-right" style={styles.iconRight} />*/}
          </View>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => getUser()}>*/}
        {/*  <Text>Show</Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    // margin: 20,
    marginTop: 20,
    width: 350,
  },
  text: {
    marginBottom: 30,
    fontSize: 20,
    color: COLORS.second,
  },
  borderBox: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.second,
  },
  row: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
  },
  iconLeft: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 24,
    color: COLORS.second,
  },
  iconRight: {
    marginLeft: 180,
    marginRight: 10,
    fontSize: 24,
    color: COLORS.second,
  },
});
