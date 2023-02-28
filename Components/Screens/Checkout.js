import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {getData, storeData} from '../StorageHelper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../Colors';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Checkout() {
  const [currentUser, setCurrentUser] = useState('');
  const [numberOfProduct, setNumberOfProduct] = useState('');
  const [dishes, setDishes] = useState('');
  const [productId, setProductId] = useState('');
  const [jwt, setJwt] = useState('');
  const [counter, setCounter] = useState(0);
  getData('JWT').then(r => {
    setJwt(r);
  });

  function addItem() {
    setCounter(counter + 1);
  }
  function deleteItem() {
    if (counter !== 0) {
      setCounter(counter - 1);
    }
  }
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
  return (
    <View style={styles.container}>
      <ScrollView>
        {/*1 Box*/}
        <View style={styles.box}>
          <View style={[styles.card, styles.elevation]}>
            <View style={styles.row}>
              {/*<Image style={styles.image} source={{uri: dish.imageUrl}} />*/}
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('./food.png')} />
              </View>
              <View style={styles.columnWide}>
                <Text style={styles.title}>KREWETKI KRÓLEWSKIE</Text>
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
              </View>
              <View style={styles.column}>
                <Text style={styles.title}>20 zł</Text>
                <Text style={styles.title}>20 zł</Text>
              </View>
            </View>
          </View>
        </View>
        {/*2 Box*/}
        <View style={styles.box}>
          <View style={[styles.card, styles.elevation]}>
            <View style={styles.row}>
              {/*<Image style={styles.image} source={{uri: dish.imageUrl}} />*/}
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('./food.png')} />
              </View>
              <View style={styles.columnWide}>
                <Text style={styles.title}>CHEESE BURGER</Text>
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
              </View>
              <View style={styles.column}>
                <Text style={styles.title}>20 zł</Text>
                <Text style={styles.title}>20 zł</Text>
              </View>
            </View>
          </View>
        </View>
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
    // flexWrap: 'wrap',
    // alignItems: 'center',
    // alignContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 16,
    color: COLORS.mainBrown,
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 0,
    // paddingVertical: 45,
    // paddingHorizontal: 25,
    width: 350,
    marginVertical: 10,
  },
  elevation: {
    elevation: 5,
    shadowColor: '#52006A',
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
  column: {
    marginLeft: 10,
  },
  columnWide: {
    marginLeft: 10,
    width: 200,
  },
  counterText: {
    textAlign: 'center',
    fontSize: 22,
    color: COLORS.mainBrown,
    fontWeight: 800,
    marginLeft: 15,
    marginRight: 15,
  },
  icon: {
    margin: 0,
    fontSize: 24,
    color: COLORS.mainBrown,
  },
  imageContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: imageWidth/6,
    height: imageHeight/5,
  },
  image: {
    width: imageWidth/6,
    height: imageHeight/5,
    margin: 0,
    padding: 0,
  },
  // button: {
  //   justifyContent: 'center',
  //   marginTop: 40,
  //   width: 250,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: COLORS.mainBrown,
  // },
  // buttonText: {
  //   textAlign: 'center',
  //   color: 'white',
  //   fontSize: 18,
  //   marginLeft: 20,
  //   fontWeight: 800,
  // },
  // buttonIcon: {
  //   color: COLORS.mainBrown,
  //   fontSize: 20,
  // },
  // rowButton: {
  //   justifyContent: 'center',
  //   display: 'flex',
  //   flexDirection: 'row',
  // },
});
