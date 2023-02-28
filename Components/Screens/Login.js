import {Button, Text, View} from 'react-native';
import {LOGIN} from '../actions';
import {useDispatch} from 'react-redux';
import store from './store';
export default function Login() {
  const dispatch = useDispatch();

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
        console.log(data);
        dispatch({
          type: LOGIN,
          payload: '' + data,
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function getUser() {
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
