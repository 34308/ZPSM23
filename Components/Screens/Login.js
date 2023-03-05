import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {useState} from 'react';
import {COLORS} from '../Colors';
import {useDispatch} from 'react-redux';
import {LOGIN, LOGOUT, NOINTERNET, SERVER_ERROR} from '../actions';
import store from '../store';
import NetInfo from '@react-native-community/netinfo';
import jwtDecode from 'jwt-decode';
import {showMessage} from 'react-native-flash-message';


export default function Login({navigation}) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const goToRegister = () => {
    navigation.navigate('Registration');
    setLogin('');
    setPassword('');
  };

  const ValidateFields = async () => {
    if (login === '' || password === '' || login == null || password == null) {
      alert('Uzupełnij wszystkie pola.');
    } else {
      try {
        logIn();
      } catch (error) {
        console.error(error);
      }
    }
  };

  function goToRestaurants() {
    navigation.navigate('Restaurants');
    setLogin('');
    setPassword('');
  }

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
      })
        .then(async response => {
          if (response.ok) {
            const data = await response.text();
            const token = JSON.parse(data).value;
            const interval = setTimeout(() => {
              console.error('logout');
              showMessage({
                message: 'Token Wygasł.',
                type: 'info',
                backgroundColor: COLORS.second,
                color: COLORS.main,
              });
              dispatch({type: LOGOUT, payload: '' + token});
            }, (jwtDecode(token).exp - jwtDecode(token).iat) * 1000);
            dispatch({type: LOGIN, payload: '' + token});
            goToRestaurants();
          } else {
            alert('Login Not Succesfull, wrong login or password');
          }
        })
        .catch(error => {
          NetInfo.fetch().then(state => {
            state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
          });
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          {/*<Image style={styles.logo} source={require('../Screens/logo.png')} />*/}
          <View style={styles.column}>
            <Text style={styles.textWelcome}>Witaj w Szama(nie)!</Text>
            <Image
              style={styles.logo}
              source={require('../Screens/logo.png')}
            />
            <Text style={styles.textWelcome2}>
              Zaloguj się, aby kontynuować.
            </Text>
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
    backgroundColor: COLORS.second,
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
    backgroundColor: COLORS.second,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
  textWelcome: {
    textAlign: 'center',
    color: COLORS.main,
    fontSize: 24,
    fontWeight: 800,
  },
  textWelcome2: {
    textAlign: 'center',
    color: COLORS.main,
    fontSize: 12,
    fontWeight: 800,
  },
  textInput: {
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.second,
    marginTop: 20,
  },
  input: {
    padding: 5,
    paddingLeft: 15,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: COLORS.second,
    textAlign: 'left',
    color: COLORS.second,
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
