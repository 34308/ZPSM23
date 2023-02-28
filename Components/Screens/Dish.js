import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from './store';
import {useRoute} from '@react-navigation/native';
import {COLORS} from '../Colors';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Dish() {
  const [dish, setDish] = useState([]);
  const [counter, setCounter] = useState(0);
  const route = useRoute();
  const url = route.params.dishUrl;

  function addItem() {
    setCounter(counter + 1);
  }
  function deleteItem() {
    if (counter !== 0) {
      setCounter(counter - 1);
    }
  }

  // {login}/usercart/{dishId}/save/{count}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        setDish(data);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.main}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.column}>
            <Text style={styles.textTitle}>{dish.name}</Text>
            <Text style={styles.textPrice}>{dish.price} zł</Text>
          </View>
          <View style={[styles.imageContainer, styles.elevation]}>
            <Image style={styles.image} source={{uri: dish.imageUrl}} />
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => deleteItem()}>
              <Icon name="minus-square" style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.counter}>
              <Text style={styles.counterText}>{counter}</Text>
            </View>
            <TouchableOpacity onPress={() => addItem()}>
              <Icon name="plus-square" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.descContainer}>
            <Text style={styles.textDescTitle}>Opis</Text>
            <Text style={styles.textDesc}>{dish.description}</Text>
          </View>
          <View style={styles.button}>
            <TouchableOpacity>
              <View style={styles.rowButton}>
                {/*<Icon name="cart-plus" style={styles.buttonIcon} />*/}
                <Text style={styles.buttonText}>Dodaj do koszyka</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.mainBrown,
  },
  container: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    marginTop: 10,
  },
  row: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 20,
    margin: 10,
  },
  counterText: {
    textAlign: 'center',
    fontSize: 22,
    color: COLORS.mainBrown,
    fontWeight: 800,
    marginLeft: 20,
    marginRight: 20,
  },
  icon: {
    margin: 0,
    fontSize: 30,
    color: COLORS.mainBrown,
  },
  dishContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    margin: 0,
  },
  textTitle: {
    fontSize: 24,
    color: COLORS.mainBrown,
    marginTop: 20,
  },
  textDesc: {
    fontSize: 16,
    color: 'black',
  },
  textDescTitle: {
    fontSize: 20,
    color: COLORS.mainBrown,
    marginBottom: 10,
  },
  descContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.mainBrown,
    borderRadius: 5,
    padding: 10,
    width: 350,
    marginTop: 10,
  },
  textPrice: {
    marginBottom: 20,
    fontWeight: 800,
    textAlign: 'center',
    fontSize: 26,
    color: COLORS.mainOrange2,
  },
  imageContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: imageHeight,
  },
  elevation: {
    shadowColor: '#ff0000',
    elevation: 20,
  },
  image: {
    width: '100%',
    height: imageHeight,
    borderRadius: 2,
    borderColor: COLORS.mainBrown,
    borderWidth: 1,
  },
  button: {
    justifyContent: 'center',
    marginTop: 40,
    width: 250,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.mainBrown,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginLeft: 20,
    fontWeight: 800,
  },
  buttonIcon: {
    color: COLORS.mainBrown,
    fontSize: 20,
  },
  rowButton: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
});
