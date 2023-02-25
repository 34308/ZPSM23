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
  const [exDate, setexDate] = useState('');
  const [pageChanged, changePage] = useState(false);
  //Przechodzi do login i czyści fieldy, ewentualnie do zmiany
  const goToLogin = () => {
    navigation.navigate('Login');
    setLogin('');
    setPassword('');
    setName('');
    setSurname('');
    setAdress('');
    setEmail('');
    setCardNumber('');
    setCvv('');
    setexDate('');
  };

  async function Register() {
    try {
      fetch('http://10.0.2.2:8082/user/registration', {
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
          expireDate: exDate.toString(),
          cvv: cvv.toString(),
          email: email.toString(),
        }),
      }).then(r => {
        console.log(r.status);
      });
    } catch (error) {
      console.error(error);
    }
  }
  function PageOne() {
    return (
      <View>
        <Text style={styles.textInput}>Login</Text>
        <TextInput
          value={login}
          // placeholder="Login"
          onChange={setLogin}
          style={styles.input}
        />
        <Text style={styles.textInput}>Hasło</Text>
        <TextInput
          value={password}
          // placeholder="Password"
          onChange={setPassword}
          style={styles.input}
        />
        <Text style={styles.textInput}>Powtórz Hasło</Text>
        <TextInput
          value={password}
          // placeholder="Password"
          onChange={setPassword}
          style={styles.input}
        />
        <Text style={styles.textInput}>Email</Text>
        <TextInput
          value={email}
          // placeholder="Email"
          onChange={setEmail}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => changePage(true)}
          style={styles.button}>
          <Text style={styles.text}>Dalej</Text>
        </TouchableOpacity>
      </View>
    );
  }
  function PageSecond() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => changePage(false)}
          style={styles.button}>
          <Text style={styles.text}>wstecz</Text>
        </TouchableOpacity>
        <Text style={styles.textInput}>Imię</Text>
        <TextInput
          value={name}
          // placeholder="Name"
          onChange={setName}
          style={styles.input}
        />
        <Text style={styles.textInput}>Nazwisko</Text>
        <TextInput
          value={surname}
          // placeholder="Surname"
          onChange={setSurname}
          style={styles.input}
        />
        <Text style={styles.textInput}>Adres</Text>
        <TextInput
          value={address}
          // placeholder="Address"
          onChange={setAdress}
          style={styles.input}
        />
        <Text style={styles.textInput}>Numer karty</Text>
        <TextInput
          value={cardNumber}
          // placeholder="Card Number"
          onChange={setCardNumber}
          style={styles.input}
        />
        <Text style={styles.textInput}>Data wygaśnięcia</Text>
        <TextInput
          value={exDate}
          // placeholder="Expire Date"
          onChange={setexDate}
          style={styles.input}
        />
        <Text style={styles.textInput}>Kod cvv</Text>
        <TextInput
          value={cvv}
          // placeholder="Cvv"
          onChange={setCvv}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Zarejestruj się</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../Screens/logo.jpg')} />
        {pageChanged ? <PageSecond /> : <PageOne />}

        <TouchableOpacity style={styles.login}>
          <Text style={styles.register} onPress={goToLogin}>
            Masz już konto? Zaloguj się.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    justifyContent: 'center',
    // borderWidth: 2,
    padding: 10,
    margin: 20,
    borderRadius: 5,
    backgroundColor: COLORS.mainOrange,
    width: 250,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
  textInput: {
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.mainOrange,
    marginTop: 20,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 250,
    height: 150,
    marginBottom: 0,
    marginTop: 20,
  },
  input: {
    padding: 5,
    paddingLeft: 15,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: COLORS.lightOrangeButton,
    textAlign: 'left',
    color: COLORS.mainBrown,
    width: 320,
  },
  login: {
    textAlign: 'center',
    color: 'grey',
    marginBottom: 20,
  },
});
