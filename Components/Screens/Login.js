import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground, ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import {storeData} from '../StorageHelper';
import {COLORS} from '../Colors';
import {useDispatch} from 'react-redux';
import {LOGIN} from '../actions';

export default function Login({navigation}) {
  const [jwt, setJwt] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const goToRegister = () => {
    navigation.navigate('Registrations');
    setLogin('');
    setPassword('');
  };

  const ValidateFields = async () => {
    if (login == '' || password == '' || login == null || password == null) {
      alert('Uzupełnij wszystkie pola.');
    } else {
      try {
        logIn();
        alert('User added.');
        //GoToUserInterface()
      } catch (error) {
        console.error(error);
      }
    }
  };

  async function logIn() {
    try {
      fetch('http://10.0.2.2:8082/user/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: '' + login,
          password: '' + password,
        }),
      }).then(async response => {
        const data = await response.text();
        setJwt(data);
        dispatch({type: LOGIN, payload: true});
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          {/*<Image style={styles.logo} source={require('../Screens/logo.png')} />*/}
          <View style={styles.column}>
            <Text style={styles.textWelcome}>Witaj w Szama(nie)!</Text>
            <Image style={styles.logo} source={require('../Screens/logo.png')} />
            <Text style={styles.textWelcome2}>Zaloguj się, aby kontynuować.</Text>
          </View>
        </View>
        <View style={styles.box}>
          <View>
            <Text style={styles.textInput}>Login</Text>
            <TextInput
              style={styles.input}
              onChangeText={setLogin}
              value={login}
              // placeholder="Login"
              keyboardType="default"
            />
            <Text style={styles.textInput}>Hasło</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              // placeholder="Hasło"
              keyboardType="default"
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={ValidateFields}>
              <Text style={styles.text}>Zaloguj się</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.register} onPress={goToRegister}>
                Nie masz konta? Zarejestruj się.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  section: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.fourthOrange,
  },
  box: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
  },
  button: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    padding: 10,
    margin: 20,
    width: 250,
    borderRadius: 5,
    borderColor: COLORS.thirdOrange,
    backgroundColor: COLORS.mainBrown,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
  textWelcome: {
    textAlign: 'center',
    color: COLORS.mainBrown,
    fontSize: 24,
    fontWeight: 800,
  },
  textWelcome2: {
    textAlign: 'center',
    color: COLORS.mainBrown,
    fontSize: 12,
    fontWeight: 800,
  },
  textInput: {
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.mainBrown,
    marginTop: 20,
  },
  input: {
    padding: 5,
    paddingLeft: 15,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: COLORS.mainBrown,
    textAlign: 'left',
    color: COLORS.mainBrown,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },
  logoContainer: {
    margin: 10,
    padding: 10,
  },
  register: {
    textAlign: 'center',
    color: 'grey',
  },
});
