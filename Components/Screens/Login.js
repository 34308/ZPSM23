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
          login: 'broniq1',
          password: 'bulka123',
        }),
      }).then(async response => {
        const data = await response.text();
        setJwt(JSON.parse(data).value);
        CookieManager.set('http://10.0.2.2:8082', {
          name: 'JWT',
          value: JSON.parse(data).value,
          domain: JSON.parse(data).domain,
          path: JSON.parse(data).path,
          version: JSON.parse(data).version,
          expires: JSON.parse(data).expires,
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getUser() {
    CookieManager.get('http://10.0.2.2:8082').then(cookies => {
      console.log('CookieManager.get =>', cookies.JWT.value);
    });
    const resp = await fetch('http://10.0.2.2:8082/broniq1/user', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + store.getState().token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
    const data = await resp.text();
  }

  return (
    <View>
      <Button onPress={logIn} title={'login as broniq'} />
      <Button onPress={getUser} title={'get user'} />
      <Text>test</Text>
    </View>
  );
}
