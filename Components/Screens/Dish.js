import {
  Button,
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
import store from '../store';
import {useRoute} from '@react-navigation/native';
import {COLORS} from '../Colors';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import {getUserName, LogOut} from '../Utilities';
import {showMessage} from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
import { API_URL, NOINTERNET, SERVER_ERROR } from "../actions";

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Dish({navigation}) {
  const [dish, setDish] = useState([]);
  const [counter, setCounter] = useState(0);
  const route = useRoute();
  const url = route.params.dishUrl;
  const [cartItems, setCartItems] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  function addItem() {
    setCounter(counter + 1);
  }
  function deleteItem() {
    if (counter !== 0) {
      setCounter(counter - 1);
    }
  }
  function addItem() {
    setCounter(counter + 1);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(url).catch(error => {
          NetInfo.fetch().then(state => {
            state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
          });
        });
        const data = await resp.json();
        setDish(data);
      } catch (error) {
        console.log('error', error);
      }
    };

    async function getCart() {
      const resp2 = await fetch(
        API_URL + '/' +
          getUserName(store.getState().token) +
          '/usercart?p=0',
        {
          method: 'GET',
          headers: new Headers({
            Authorization: 'Bearer ' + store.getState().token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      ).catch(error => {
        NetInfo.fetch().then(state => {
          state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
        });
      });
      console.log(resp2.text());

      const text = await resp2.text();
      let data2 = JSON.parse(text);

      setCartItems(data2.content);
      if (
        data2.content !== undefined &&
        data2.content.some(item => {
          return item.dish.name === dish.name;
        })
      ) {
        setCounter(
          data2.content.find(item => {
            return item.dish.name === dish.name;
          }).countOfDish,
        );
      }
    }
    fetchData();
    store.getState().isLoggedIn ? getCart() : null;
  }, [dish.name, url]);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  async function addItemToCasket(dishID, numberOfProduct) {
    if (numberOfProduct !== 0) {
      const resp = await fetch(
        API_URL + '/' +
          getUserName(store.getState().token) +
          '/usercart/' +
          dishID +
          '/save/' +
          numberOfProduct,
        {
          method: 'POST',
          headers: new Headers({
            Authorization: 'Bearer ' + store.getState().token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      )
        .then(resp => {
          if (!resp.ok) {
            LogOut(navigation, store.dispatch);
            showMessage({
              message: 'Twoja sesja wygasla, zaloguj sie ponownie.',
              type: 'info',
              backgroundColor: COLORS.second,
              color: COLORS.main,
            });
          }
        })
        .catch(error => {
          NetInfo.fetch().then(state => {
            state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
          });
        });
      const data = await resp.text();
      onRefresh();
      showMessage({
        message: 'Dodano do koszyka.',
        type: 'info',
        backgroundColor: COLORS.second,
        color: COLORS.main,
      });
    }
  }

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
          {store.getState().isLoggedIn ? (
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
          ) : null}
          <View style={styles.descContainer}>
            <Text style={styles.textDescTitle}>Opis</Text>
            <Text style={styles.textDesc}>{dish.description}</Text>
          </View>

          {store.getState().isLoggedIn ? (
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => addItemToCasket(dish.dishId, counter)}>
                <View style={styles.rowButton}>
                  {/*<Icon name="cart-plus" style={styles.buttonIcon} />*/}
                  <Text style={styles.buttonText}>Dodaj do koszyka</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.second,
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
  column: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
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
    color: COLORS.second,
    fontWeight: 800,
    marginLeft: 20,
    marginRight: 20,
  },
  icon: {
    margin: 0,
    fontSize: 30,
    color: COLORS.second,
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
    color: COLORS.second,
    marginTop: 20,
  },
  textDesc: {
    fontSize: 16,
    color: 'black',
  },
  textDescTitle: {
    fontSize: 20,
    color: COLORS.second,
    marginBottom: 10,
  },
  descContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.second,
    borderRadius: 5,
    padding: 10,
    width: 350,
    marginTop: 10,
  },
  textPrice: {
    marginBottom: 20,
    fontWeight: 800,
    textAlign: 'center',
    fontSize: 22,
    color: COLORS.second,
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
    borderRadius: 5,
    borderColor: COLORS.main,
    borderWidth: 1,
  },
  button: {
    justifyContent: 'center',
    marginTop: 40,
    width: 250,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.second,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginLeft: 20,
    fontWeight: 800,
  },
  buttonIcon: {
    color: COLORS.second,
    fontSize: 20,
  },
  rowButton: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
});
