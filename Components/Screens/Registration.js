import {Button, TextInput, View} from 'react-native';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Registration() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAdress] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [exDate, setexDate] = useState('');
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
  return (
    <SafeAreaView>
      <TextInput value={login} placeholder="login" onChange={setLogin} />
      <TextInput
        value={password}
        placeholder="password"
        onChange={setPassword}
      />
      <TextInput value={name} placeholder="name" onChange={setName} />
      <TextInput value={surname} placeholder="surname" onChange={setSurname} />
      <TextInput value={address} placeholder="address" onChange={setAdress} />
      <TextInput
        value={cardNumber}
        placeholder="card Number"
        onChange={setCardNumber}
      />
      <TextInput value={exDate} placeholder="ex date" onChange={setexDate} />
      <TextInput value={cvv} placeholder="cvv" onChange={setCvv} />
      <TextInput value={email} placeholder="email" onChange={setEmail} />
      <Button title="Register" onPress={Register} />
    </SafeAreaView>
  );
}
