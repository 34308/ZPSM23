import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {useEffect, useState} from 'react';
import {COLORS} from '../Colors';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Restaurants({navigation}) {
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

  function goToRestaurant(restaurantName) {
    navigation.navigate('Dishes', {
      restaurantUrl: restaurantName + '/dishes?p=0',
      restaurantName: restaurantName,
    });
  }

  useEffect(() => {
    const url = 'http://10.0.2.2:8082/restaurants';
    const fetchData = async () => {
      try {
        const resp = await fetch(url);
        const data = await resp.json();
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
              style={styles.imageContainer}>
              <TouchableOpacity onPress={() => goToRestaurant(item.name)}>
                <Image style={styles.image} source={{uri: item.imageUrl}} />
                <View style={styles.line} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
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
  text: {
    color: COLORS.second,
    fontFamily: 'Ubuntu-Light',
    fontSize: 26,
    textAlign: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: imageWidth / 1.5,
    height: imageHeight / 1.5,
    // borderWidth: 1,
    borderRadius: 5,
    // borderColor: COLORS.mainOrange,
    backgroundColor: COLORS.third,
    margin: 30,
  },
  image: {
    width: imageWidth / 1.5,
    height: imageHeight / 1.5,
    resizeMode: 'contain',
    borderRadius: 5,
    borderColor: COLORS.second,
    borderWidth: 1,
    margin: 20,
  },
  line: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.second,
  },
});
