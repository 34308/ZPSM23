import {View} from 'react-native';
import {useState} from 'react';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState('');
  const fetchData = async () => {
    const resp = await fetch('http://10.0.2.2:8082/restaurants');
    const data = await resp.json();
    console.log();
    setRestaurants(data);
  };
  return <View />;
}
