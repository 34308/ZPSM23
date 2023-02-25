import {View} from 'react-native';
import {useState} from 'react';

export default function Dishes() {
  const [dishes, setDishes] = useState('');
  const [isPressed, setPressed] = useState('');
  const fetchData = async () => {
    const resp = await fetch(
      'http://10.0.2.2:8082/restaurants/Restauracja_u_Jana/dishes?p=1',
    );
    const data = await resp.json();
    setDishes(data);
  };
  function R1() {}
  function R2() {}
  return isPressed ? <R1 /> : <R2 />;
}
