import {
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
        const data = await resp.content;
        console.log(JSON.parse('{'+data+'}'));
        setDishes(data);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" style={styles.icon} />
        <TextInput
          placeholder="Restauracja u Jana"
          style={styles.textSearchBar}
        />
      </View>
      {/*<Text>http://10.0.2.2:8082/restaurants/{route.params.restaurantName}</Text>*/}
      <View style={styles.dishContainer}>
        {/*<ScrollView>*/}
        {/*  {dishes.content.map((item, i) => {*/}
        {/*    return (*/}
        {/*      <View*/}
        {/*        key={i + item.dishId}*/}
        {/*        style={styles.imageContainer}>*/}
        {/*          <Image style={styles.image} source={{uri: item.imageUrl}} />*/}
        {/*      </View>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</ScrollView>*/}
      </View>
    </View>
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
    margin: 20,
  },
  dishContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    margin: 20,
  },
  textSearchBar: {
    color: COLORS.mainBrown,
    fontFamily: 'Ubuntu-Light',
    fontSize: 16,
    textAlign: 'left',
  },
  searchBar: {
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.secondOrange,
    borderColor: COLORS.mainBrown,
    borderWidth: 1,
    borderRadius: 5,
    width: 380,
    height: 50,
  },
  icon: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 5,
  },
});
