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
import AntDesignIcon from 'react-native-vector-icons/EvilIcons';
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

        {cartItems.map((item, i) => {
          return (
            <View style={styles.box}>
              <View style={[styles.card, styles.elevation]}>
                <View key={i} style={[styles.row, styles.border]}>
                  <View style={styles.column}>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={{uri: item.dish.imageUrl}}
                      />
                    </View>
                  </View>
                  <View style={styles.columnWide}>
                    <View style={styles.innerColumn}>
                      <Text style={styles.title}>{item.dish.name}</Text>
                      <Text style={styles.sumText}>
                        {parseInt(item.countOfDish) * parseInt(item.dish.price)}
                        zl
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.column, styles.counterContainer]}>
                    <View style={styles.column}>
                      <TouchableOpacity
                        onPress={() =>
                          deleteItem(
                            item.dish.dishId,
                            parseInt(item.countOfDish) - 1,
                          )
                        }>
                        <AntDesignIcon name="minus" style={styles.icon} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.counter}>
                      <Text style={styles.counterText}>{item.countOfDish}</Text>
                    </View>
                    <View style={styles.column}>
                      <TouchableOpacity
                        onPress={() =>
                          addItem(
                            item.dish.dishId,
                            parseInt(item.countOfDish) + 1,
                          )
                        }>
                        <AntDesignIcon name="plus" style={styles.icon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/*<View style={styles.column}>*/}
                  {/*  <Text style={styles.priceText}>{item.dish.price}zl</Text>*/}
                  {/*</View>*/}
                </View>
              </View>
            </View>
          );
        })}
        <View style={[styles.box, styles.marginBox]}>
          <View style={styles.row}>
            <View>
              <Text style={styles.priceText}>Razem: </Text>
              <Text style={styles.priceText}>Koszt dostawy: </Text>
              <Text style={styles.totalText}>Suma: </Text>
            </View>
            <View style={styles.rightBox}>
              <Text style={styles.priceText}>90zł</Text>
              <Text style={styles.priceText}>10zł</Text>
              <Text style={styles.totalText}>100zł</Text>
            </View>
          </View>
          <View style={styles.box}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Zamów</Text>
            </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.second,
    marginLeft: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  sumText: {
    color: COLORS.second,
    fontSize: 18,
    fontWeight: 800,
    marginLeft: 10,
  },
  totalText: {
    color: COLORS.second,
    fontSize: 26,
    fontWeight: 800,
  },
  priceText: {
    color: COLORS.second,
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 15,
  },
  rightBox: {
    alignItems: 'flex-end',
    marginLeft: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 0,
    // paddingVertical: 45,
    // paddingHorizontal: 25,
    width: 350,
    marginVertical: 20,
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
    marginBottom: 10,
    // marginTop: 20,
    // margin: 10,
  },
  border: {
    margin: 10,
  },
  column: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: 10,
    // maxHeight: 60,
  },
  innerColumn: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  columnWide: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    // borderWidth: 1,
    height: imageHeight / 2.5,
  },
  counter: {
    margin: 0,
  },
  counterText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 800,
    marginBottom: 10,
    marginTop: 5,
  },
  counterContainer: {
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.second,
    elevation: 10,
  },
  icon: {
    margin: 0,
    fontSize: 24,
    color: 'white',
  },
  imageContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: imageWidth / 4,
    height: imageHeight / 2.25,
    borderRadius: 50,
    elevation: 20,
  },
  image: {
    width: imageWidth / 4,
    height: imageHeight / 2.25,
    margin: 0,
    padding: 0,
    borderRadius: 50,
  },
  button: {
    justifyContent: 'center',
    marginTop: 20,
    width: 250,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.second,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 800,
  },
  marginBox: {
    marginTop: 20,
    marginBottom: 20,
  },
});
