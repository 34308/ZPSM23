import {View} from 'react-native';
import {useState} from 'react';

export default function Dish() {
  const [dish, setDish] = useState('');

  const fetchData = async () => {
    const resp = await fetch(
      'http://10.0.2.2:8082/restaurants/Restauracja_u_Jana/dishes?p=1',
    );
    const data = await resp.json();
    console.log();
    setDish(data);
  };
  return <View />;
}
