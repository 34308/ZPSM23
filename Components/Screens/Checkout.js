import {
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesignIcon from 'react-native-vector-icons/EvilIcons';
import {COLORS} from '../Colors';
import store from '../store';
import {
  checkIfLogged,
  checkIfLoggedAndLogout,
  getUserName,
  LogOut,
} from '../Utilities';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from '@react-native-community/netinfo';
import {NOINTERNET, SERVER_ERROR} from '../actions';
import {showMessage} from 'react-native-flash-message';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Checkout({navigation}) {
  const [currentUser, setCurrentUser] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [productPrice, setProductPrice] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const moneyForDelivery = 15;
  const [note, setNote] = React.useState('brak');
  const [isEmpty, empty] = React.useState(false);

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
    ).catch(error => {
      NetInfo.fetch().then(state => {
        state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
      });
    });
    if (resp.ok) {
      empty(false);
      const text = await resp.text();
      let data = JSON.parse(text);

      setCartItems(data.content);
      setProductPrice(
        data.content.reduce((a, c) => {
          return a + parseInt(c.dish.price) * parseInt(c.countOfDish);
        }, 0),
      );
    } else {
      empty(true);
      setCartItems([]);
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkIfLoggedAndLogout(navigation, store);
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
      ).catch(error => {
        NetInfo.fetch().then(state => {
          state.isConnected ? alert(SERVER_ERROR + error) : alert(NOINTERNET);
        });
      });
      if (resp.ok) {
        empty(false);
        const text = await resp.text();
        let data = JSON.parse(text);
        setCartItems(data.content);
        setProductPrice(
          data.content.reduce((a, c) => {
            return a + parseInt(c.dish.price) * parseInt(c.countOfDish);
          }, 0),
        );
      } else {
        empty(true);
        setCartItems([]);
      }
    }
    getCart();
    return unsubscribe;
  }, [navigation]);

  async function checkOut() {
    if (note === '') {
      setNote('brak');
    }
    if (await checkIfLogged()) {
      setRefreshing(true);
      const date = new Date();
      let dirs = RNFetchBlob.fs.dirs;
      const url =
        'http://10.0.2.2:8082/' +
        getUserName(store.getState().token) +
        '/usercart/checkout/' +
        note.replaceAll(' ', '_').replaceAll('\n', '_') +
        '/true';
      console.log(url);
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Receipt needs to be saved on your device',
          message:
            'Receipt needs to be saved on your device if you dont want to save it on your device it will also be send on your email',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted) {
        if (Platform.OS === 'android') {
          RNFetchBlob.config({
            fileCache: false,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              mime: 'application/pdf',
              title:
                'Receipt from ' +
                date.getDate() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getFullYear(),
              description: 'Receipt for order in Szama(n)',
              path: dirs.DownloadDir + 'Receipt.pdf',
            },
          })
            .fetch('get', url, {
              Authorization: 'Bearer ' + store.getState().token,
              'Cache-Control': 'no-store',
            })
            .then(res => {
              setRefreshing(false);
              onRefresh();
              setProductPrice(0);
              empty(true);
            })
            .catch((errorMessage, statusCode) => {
              console.error(errorMessage, statusCode);
            });
        }
      } else {
        showMessage({
          message: 'Twoja Recepta została wysłana na email.',
          type: 'info',
          backgroundColor: COLORS.second,
          color: COLORS.main,
        });
      }
    } else {
      LogOut(navigation, store.dispatch);
      showMessage({
        message: 'Twoja sesja wygasla, zaloguj sie ponownie.',
        type: 'info',
        backgroundColor: COLORS.second,
        color: COLORS.main,
      });
    }
  }
  async function updateItem(id, numberOfProduct) {
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
    )
      .then(response => {
        if (!response.ok) {
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
    console.log(data);
    onRefresh();
  }
  async function deleteItemFromCart(dishId) {
    const resp = await fetch(
      'http://10.0.2.2:8082/' +
        getUserName(store.getState().token) +
        '/usercart/' +
        dishId +
        '/remove',
      {
        method: 'POST',
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
    const data = await resp.text();
    console.log(data);
    onRefresh();
  }
  //Zabezpieczenie przed ujemną liczbą dań
  function decreaseNumberOfItems(dishId, countOfDish) {
    countOfDish = countOfDish - 1;
    if (countOfDish > 0) {
      updateItem(dishId, parseInt(countOfDish));
    } else if (countOfDish === 0) {
      deleteItemFromCart(dishId);
    }
  }

  return isEmpty ? (
    <View style={styles.container}>
      <Text style={styles.emptyText}>Brak dań.</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/*1 Box*/}

        {cartItems.map((item, i) => {
          return (
            <View key={i} style={styles.box}>
              <View style={[styles.card, styles.elevation]}>
                <View style={[styles.row, styles.border]}>
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
                          decreaseNumberOfItems(
                            item.dish.dishId,
                            item.countOfDish,
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
                          updateItem(
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
          <Text style={styles.infoText}>Dodatkowe informacje</Text>
          <View style={styles.inputMargin}>
            <View style={[styles.card, styles.elevation]}>
              <TextInput
                style={styles.input}
                value={note}
                multiline={true}
                onChangeText={setNote}
                placeholder="Informacje do zamówienia."
                keyboardType="default"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.priceText}>Razem: </Text>
              <Text style={styles.priceText}>Koszt dostawy: </Text>
              <Text style={styles.totalText}>Suma: </Text>
            </View>
            <View style={styles.rightBox}>
              <Text style={styles.priceText}>{productPrice}zl</Text>
              <Text style={styles.priceText}>{moneyForDelivery}zl</Text>
              <Text style={styles.totalText}>
                {productPrice + moneyForDelivery}zl
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <TouchableOpacity
              disabled={isEmpty}
              onPress={() => checkOut()}
              style={styles.button}>
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
  input: {
    marginLeft: 10,
  },
  inputMargin: {
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    color: COLORS.second,
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.second,
  },
});
