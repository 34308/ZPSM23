import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView, Image,
} from 'react-native';
import {useEffect, useState} from 'react';
import {COLORS} from '../Colors';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const resp = await fetch('http://10.0.2.2:8082/restaurants');
  //     const data = await resp.json();
  //     console.log(data);
  //     setRestaurants(data);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  useEffect(() => {
    const url = 'http://10.0.2.2:8082/restaurants';
    const fetchData = async () => {
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        console.log(data);
        setRestaurants(data);
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {restaurants.map((item, i) => {
          return (
            <View
              key={i + item.name + item.restaurantsId}
              style={{
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                alignItems: 'center',
                alignContent: 'center',
                height: 125,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: COLORS.mainOrange,
                backgroundColor: COLORS.secondOrange,
                padding: 30,
                margin: 20,
              }}>
              <Text style={styles.text} key={item.name + i}>
                {item.name}
              </Text>
              {/*<Image*/}
              {/*  style={{width: '100%', height: '50%'}}*/}
              {/*  source={{uri: restaurants.imageUrl}}*/}
              {/*/>*/}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: COLORS.mainBrown,
    fontFamily: 'Ubuntu-Light',
    fontSize: 26,
    textAlign: 'center',
  },
});
