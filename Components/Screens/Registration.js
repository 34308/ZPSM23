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
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../Colors';
import NetInfo from '@react-native-community/netinfo';
import {API_URL, NOINTERNET, SERVER_ERROR} from '../actions';

export default function Registration({navigation}) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAdress] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [pageChanged, changePage] = useState(false);
  const [emailCorrect, setEmailCorrect] = useState(true);
  const [expireMonth, setExpireMonth] = useState('');
  const [expireYear, setExpireYear] = useState('');
  //Przechodzi do login i czyści fieldy, ewentualnie do zmiany
  const GoToLogin = () => {
    navigation.navigate('Login');
    setLogin('');
    setPassword('');
    setPasswordRepeat('');
    setName('');
    setSurname('');
    setAdress('');
    setEmail('');
    setCardNumber('');
    setCvv('');
    setExpireMonth('');
    setExpireYear('');
  };

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
      expireMonth == null ||
      expireYear == null
    ) {
      alert('Uzupełnij wszystkie pola.');
    } else if (password.length < 8 || password.length > 20) {
      alert('Hasło musi zawierać min. 8 znaków i max. 20');
    } else if (passwordRepeat != password) {
      alert('Hasła się nie zgadzają.');
    } else {
      try {
        Register();
        alert('User added.');
        GoToLogin();
      } catch (error) {
        console.error(error);
      }
    }
  };

  async function Register() {
    try {
      let expireDate = `${expireMonth}/${expireYear}`;
      fetch(API_URL+'/user/registration', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login.toString(),
          password: password.toString(),
          name: '' + name,
          surname: surname.toString(),
          address: address.toString(),
          debitCardNumber: cardNumber.toString(),
          expireDate: expireDate,
          cvv: cvv.toString(),
          email: email.toString(),
        }),
      })
        .then(r => {
          if (!r.ok) {
            alert('niepoprawna Rejestaracja blad serwera');
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

  function ValidateEmail(text) {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setEmail(text);
    setEmailCorrect(reg.test(text));
  }

  function formatExpireDate(cardExpiry = "") {
    console.log(`w funckji do formatowania ${cardExpiry}` )
    if((cardExpiry.length < 2 || cardExpiry.length > 2) && cardExpiry.length < 6){
      return cardExpiry;
    }
    else if(cardExpiry.length == 2){
      return cardExpiry.substring(0, 2) + "/" + (cardExpiry.substring(2) || "")
    } else {
      return cardExpiry.substring(0, cardExpiry.length - 1);
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
                <Text style={styles.textWelcome}>Zarejestruj się!</Text>
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
                  onChangeText={ValidateEmail}
                  style={styles.input}
                />
                {emailCorrect === false &&
                  <Text style={styles.wrongMail}>Nieprawidłowy Email</Text>
                }
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
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    maxLength={2}
                    style={styles.smallInput}
                    onChangeText={(month) => {
                      setExpireMonth(month);
                      if (month.length == 2) this.secondTextInput.focus()
                    }}
                    blurOnSubmit={false}
                    keyboardType={'numeric'}
                  />
                  <Text style={{marginTop: 10, fontSize: 15, color: COLORS.second}}>/</Text>
                  <TextInput
                    ref={(input) => { this.secondTextInput = input; }}
                    maxLength={2}
                    style={styles.smallInput}
                    onChangeText={setExpireYear}
                    keyboardType={'numeric'}
                  />
                </View>
                <Text style={styles.textInput}>Kod cvv</Text>
                <TextInput
                  value={cvv}
                  // placeholder="Cvv"
                  onChangeText={setCvv}
                  style={styles.input}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={ValidateFields}>
                <Text style={styles.text}>Zarejestruj się</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity>
            <Text style={styles.register} onPress={GoToLogin}>
              Masz już konto? Zaloguj się.
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
  smallInput: {
    padding: 5,
    paddingLeft: 15,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: COLORS.second,
    textAlign: 'left',
    color: COLORS.second,
    width: 50,
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
  wrongMail: {
    color: 'red'
  }
});
