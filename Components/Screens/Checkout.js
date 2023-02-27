import {View} from 'react-native';
import {useState} from 'react';
import {getData, storeData} from '../StorageHelper';

export default function Checkout() {
  const [currentUser, setCurrentUser] = useState('');
  const [numberOfProduct, setNumberOfProduct] = useState('');
  const [dishes, setDishes] = useState('');
  const [productId, setProductId] = useState('');
  const [jwt, setJwt] = useState('');
  getData('JWT').then(r => {
    setJwt(r);
  });
  async function getCart() {
    const resp = await fetch('http://10.0.2.2:8082/broniq/usercart?p=0', {
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
  async function addItemToCart() {
    const resp = await fetch(
      'http://10.0.2.2:8082/' +
        currentUser +
        '/usercart/' +
        productId +
        '/save/' +
        numberOfProduct,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + jwt,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );
    const data = await resp.text();
    setJwt(data);
    console.log(data);
  }
  async function deleteItemToCart() {
    const resp = await fetch(
      'http://10.0.2.2:8082/' +
        currentUser +
        '/usercart/' +
        productId +
        '/delete/',
      {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + jwt,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );
    const data = await resp.text();
    setJwt(data);
    console.log(data);
  }
  return <View />;
}
