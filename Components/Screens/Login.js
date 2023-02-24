import {Button, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {storeData} from '../StorageHelper';
import CookieManager from '@react-native-cookies/cookies';

export default function Login() {
  const [jwt, setJwt] = useState('');

  async function logIn() {
    try {
      fetch('http://10.0.2.2:8082/user/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: 'broniq',
          password: 'bulka123',
        }),
      }).then(async response => {
        const data = await response.text();
        setJwt(data);
        await storeData('JWT', data);
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function getUser() {
    try {
      CookieManager.get('http://10.0.2.2:8082').then(cookies => {
        console.log('CookieManager.get =>', cookies);
      });
    } catch (error) {
      console.error(error);
    }
    const resp = await fetch('http://10.0.2.2:8082/broniq/user', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + jwt,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
    const data = await resp.text();
    setJwt(data);
    console.log(data);
  }

  return (
    <View>
      <Button onPress={logIn} title={'login as broniq'} />
      <Button onPress={getUser} title={'get user'} />
      <Text>{jwt}</Text>
    </View>
  );
}
