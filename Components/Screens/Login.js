import {Button, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {storeData} from '../StorageHelper';

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
        setJwt(data);
        await storeData('JWT', data);
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function getUser() {
    const resp = await fetch('http://10.0.2.2:8082/broniq1/user', {
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
