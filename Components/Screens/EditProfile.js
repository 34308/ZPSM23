import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../Colors';
import NetInfo from '@react-native-community/netinfo';
import {NOINTERNET, SERVER_ERROR} from '../actions';
import store from '../store';
import {checkIfLoggedAndLogout, getUserName} from '../Utilities';
import {showMessage} from 'react-native-flash-message';

export default function EditProfile({navigation}) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAdress] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [exDate, setexDate] = useState('');
  const [pageChanged, changePage] = useState(false);
  //Przechodzi do login i czyści fieldy, ewentualnie do zmiany
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUser();
    });
    async function getUser() {
      const resp = await fetch(
        'http://10.0.2.2:8082/' + getUserName(store.getState().token) + '/user',
        {
          method: 'GET',
          headers: new Headers({
            Authorization: 'Bearer ' + store.getState().token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      ).catch(error => {
        NetInfo.fetch().then(state => {
          state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
        });
      });
      const data = await resp.json();
      setAdress(data.address);
      setEmail(data.email);
      setLogin(data.login);
      setexDate(data.expireDate);
      setName(data.name);
      setCardNumber(data.debitCardNumber);
      setSurname(data.surname);
      setCvv(data.cvv);
    }
    return unsubscribe;
  });
  function GoToSetings() {
    navigation.goBack();
  }

  //Waliduje poprawność wprowadzanych danych oraz sprawdza czy wymagane dane zostały wprowadzone
  const ValidateFields = async () => {
    if (
      login == '' ||
      password == '' ||
      passwordRepeat == '' ||
      email == '' ||
      name == '' ||
      surname == '' ||
      address == '' ||
      email == '' ||
      cardNumber == '' ||
      cvv == '' ||
      exDate == '' ||
      login == null ||
      password == null ||
      passwordRepeat == null ||
      email == null ||
      name == null ||
      surname == null ||
      address == null ||
      email == null ||
      cardNumber == null ||
      cvv == null ||
      exDate == null
    ) {
      alert('Uzupełnij wszystkie pola.');
    } else if (password.length < 8 || password.length > 20) {
      alert('Hasło musi zawierać min. 8 znaków i max. 20');
    } else if (passwordRepeat != password) {
      alert('Hasła się nie zgadzają.');
    } else {
      try {
        changeData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  async function changeData() {
    try {
      fetch(
        'http://10.0.2.2:8082/' +
          getUserName(store.getState().token) +
          '/user/update',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + store.getState().token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: login.toString(),
            password: password.toString(),
            name: '' + name,
            surname: surname.toString(),
            address: address.toString(),
            debitCardNumber: cardNumber.toString(),
            expireDate: exDate.toString(),
            cvv: cvv.toString(),
            email: email.toString(),
          }),
        },
      )
        .then(r => {
          if (!r.ok) {
            alert('niepoprawna Update informacji, blad serwera');
          } else {
            showMessage({
              message: 'poprawnie zmieniono.',
              type: 'info',
              backgroundColor: COLORS.second,
              color: COLORS.main,
            });
            GoToSetings();
          }
          console.log(r.status);
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
    <ScrollView>
      <View>
        <View style={styles.container}>
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              {/*<Image style={styles.logo} source={require('../Screens/logo.png')} />*/}
              <View style={styles.column}>
                <Text style={styles.textWelcome}>Zmien Swoje Dane</Text>
                {/*<Image*/}
                {/*  style={styles.logo}*/}
                {/*  source={require('../Screens/food.png')}*/}
                {/*/>*/}
              </View>
            </View>
            <View style={styles.box}>
              <View>
                <Text style={styles.textInput}>Login</Text>
                <TextInput
                  style={styles.input}
                  value={login}
                  onChangeText={setLogin}
                  // placeholder="Login"
                  keyboardType="default"
                />
                <Text style={styles.textInput}>Hasło</Text>
                <TextInput
                  value={password}
                  // placeholder="Password"
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <Text style={styles.textInput}>Powtórz Hasło</Text>
                <TextInput
                  value={passwordRepeat}
                  // placeholder="Password"
                  onChangeText={setPasswordRepeat}
                  style={styles.input}
                />
                <Text style={styles.textInput}>Email</Text>
                <TextInput
                  value={email}
                  // placeholder="Email"
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.textInput}>Imię</Text>
                <TextInput
                  value={name}
                  // placeholder="Name"
                  onChangeText={setName}
                  style={styles.input}
                  keyboardType="default"
                />
                <Text style={styles.textInput}>Nazwisko</Text>
                <TextInput
                  value={surname}
                  // placeholder="Surname"
                  onChangeText={setSurname}
                  style={styles.input}
                />
                <Text style={styles.textInput}>Adres</Text>
                <TextInput
                  value={address}
                  // placeholder="Address"
                  onChangeText={setAdress}
                  style={styles.input}
                />
                <Text style={styles.textInput}>Numer karty</Text>
                <TextInput
                  value={cardNumber}
                  // placeholder="Card Number"
                  onChangeText={setCardNumber}
                  style={styles.input}
                />
                <Text style={styles.textInput}>Data wygaśnięcia</Text>
                <TextInput
                  defaultValue={exDate}
                  // placeholder="Expire Date"
                  onChangeText={setexDate}
                  style={styles.input}
                />
                <Text style={styles.textInput}>Kod cvv</Text>
                <TextInput
                  value={cvv}
                  // placeholder="Cvv"
                  onChangeText={setCvv}
                  style={styles.input}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={ValidateFields}>
                <Text style={styles.text}>Zmien Dane</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity>
            <Text style={styles.register} onPress={GoToSetings}>
              Zminiłeś zdanie? Wróc do ustawien.
            </Text>
          </TouchableOpacity>
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
    marginTop: 20,
    width: 250,
    borderRadius: 5,
    borderColor: COLORS.thirdOrange,
    backgroundColor: COLORS.second,
  },
  buttonBack: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    padding: 10,
    width: 250,
    borderRadius: 5,
    borderColor: COLORS.thirdOrange,
    backgroundColor: COLORS.main,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
  textBack: {
    textAlign: 'center',
    color: COLORS.second,
  },
  textWelcome: {
    textAlign: 'center',
    color: COLORS.main,
    fontSize: 24,
    fontWeight: 800,
    margin: 20,
  },
  textWelcome2: {
    textAlign: 'center',
    color: COLORS.second,
    fontSize: 12,
    fontWeight: 800,
  },
  textInput: {
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.second,
    marginTop: 20,
    width: 250,
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
    marginTop: -10,
    marginBottom: 20,
  },
});