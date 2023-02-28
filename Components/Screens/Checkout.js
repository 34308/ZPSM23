import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getData, storeData} from '../StorageHelper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../Colors';
import store from './store';
import {getUserName} from '../Utilities';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Checkout({navigation}) {
  const [currentUser, setCurrentUser] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [productId, setProductId] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const resp = await fetch(
      'http://10.0.2.2:8082/' +
        getUserName(store.getState().token) +
        '/usercart?p=0',
      {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + store.getState().token,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );
    const text = await resp.text();
    let data = JSON.parse(text);
    setCartItems(data.content);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCart();
    });
    async function getCart() {
      const resp = await fetch(
        'http://10.0.2.2:8082/' +
          getUserName(store.getState().token) +
          '/usercart?p=0',
        {
          method: 'GET',
          headers: new Headers({
            Authorization: 'Bearer ' + store.getState().token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      );
      const text = await resp.text();
      let data = JSON.parse(text);
      setCartItems(data.content);
    }
    getCart();
    return unsubscribe;
  }, [navigation]);
  async function addItem(id, numberOfProduct) {
    const resp = await fetch(
      'http://10.0.2.2:8082/' +
        getUserName(store.getState().token) +
        '/usercart/' +
        id +
        '/save/' +
        numberOfProduct,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + store.getState().token,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );
    const data = await resp.text();
    console.log(data);
    onRefresh();
  }
  async function deleteItem(id, numberOfProduct) {
    const resp = await fetch(
      'http://10.0.2.2:8082/' +
        getUserName(store.getState().token) +
        '/usercart/' +
        id +
        '/save/' +
        numberOfProduct,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + store.getState().token,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );
    const data = await resp.text();
    console.log(data);
    onRefresh();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/*1 Box*/}
        <View style={styles.box}>
          <View style={[styles.card, styles.elevation]}>
            {cartItems.map((item, i) => {
              return (
                <View key={i} style={styles.row}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{uri: item.dish.imageUrl}}
                    />
                  </View>
                  <View style={styles.columnWide}>
                    <Text style={styles.title}>{item.dish.name}</Text>
                    <View style={styles.row}>
                      <TouchableOpacity
                        onPress={() =>
                          deleteItem(
                            item.dish.dishId,
                            parseInt(item.countOfDish) - 1,
                          )
                        }>
                        <Icon name="minus-square" style={styles.icon} />
                      </TouchableOpacity>
                      <View style={styles.counter}>
                        <Text style={styles.counterText}>
                          {item.countOfDish}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          addItem(
                            item.dish.dishId,
                            parseInt(item.countOfDish) + 1,
                          )
                        }>
                        <Icon name="plus-square" style={styles.icon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.title}>{item.dish.price}zl</Text>
                    <Text style={styles.title}>
                      {parseInt(item.countOfDish) * parseInt(item.dish.price)}zl
                    </Text>
                  </View>
                </View>
              );
            })}
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
    width: imageWidth / 6,
    height: imageHeight / 5,
  },
  image: {
    width: imageWidth / 6,
    height: imageHeight / 5,
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
