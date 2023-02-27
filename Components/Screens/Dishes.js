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
import {COLORS} from '../Colors';
import {useRoute} from '@react-navigation/native';
import {SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from './store';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  // const [isPressed, setPressed] = useState('');
  const route = useRoute();

  useEffect(() => {
    const url =
      'http://10.0.2.2:8082/restaurants/' + route.params.restaurantName;
    const fetchData = async () => {
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        setDishes(data.content);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/*<Text>http://10.0.2.2:8082/restaurants/{route.params.restaurantName}</Text>*/}
      {/*<View style={styles.dishContainer}>*/}
      <ScrollView>
        <View style={styles.searchBar}>
          <Icon name="search" style={styles.icon} />
          <TextInput
            placeholder="Restauracja u Jana"
            style={styles.textSearchBar}
          />
        </View>
        {dishes.map((item, i) => {
          return (
            <View key={i + item.dishId}>
              <View style={styles.row}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{uri: item.imageUrl}} />
                </View>

                <View style={styles.column}>
                  <Text style={styles.textTitle}>{item.name}</Text>
                  <Text style={styles.textDesc}>{item.description}</Text>
                  <Text style={styles.line} />
                </View>

                <View style={styles.column}>
                  {store.getState() ? (
                    <View style={styles.plusContainer}>
                      <Icon name="plus-circle" style={styles.iconPlus} />
                    </View>
                  ) : null}
                  <Text style={styles.textPrice}>{item.price + ' zł'}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    marginTop: 10,
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
  textSearchBar: {
    color: COLORS.mainBrown,
    fontFamily: 'Ubuntu-Light',
    fontSize: 16,
    textAlign: 'left',
  },
  textTitle: {
    fontSize: 16,
    color: COLORS.mainBrown,
  },
  textDesc: {
    fontSize: 12,
    color: 'black',
  },
  textPrice: {
    fontSize: 16,
    color: 'black',
    marginTop: 50,
  },
  column: {
    width: 190,
    flexDirection: 'column',
    marginRight: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    padding: 5,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.mainBrown,
  },
  plusContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: 35,
    borderRadius: 5,
    backgroundColor: COLORS.lightOrangeButton,
  },
  searchBar: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    borderColor: COLORS.mainBrown,
    borderWidth: 1,
    borderRadius: 5,
    width: 380,
    height: 50,
    marginLeft: 15,
  },
  icon: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 5,
    color: COLORS.mainBrown,
  },
  iconPlus: {
    fontSize: 26,
    padding: 5,
    color: 'white',
  },
  imageContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    width: imageWidth / 3.5,
    height: imageHeight / 2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.mainOrange,
    backgroundColor: COLORS.secondOrange,
    marginRight: 15,
    marginLeft: 15,
  },
  image: {
    // flex: 1,
    // resizeMode: 'contain',
    // flex: 1,
    width: imageWidth / 3.5,
    height: imageHeight / 2,
    resizeMode: 'cover',
    borderRadius: 5,
    borderColor: COLORS.mainBrown,
    borderWidth: 1,
    margin: 20,
  },
});
