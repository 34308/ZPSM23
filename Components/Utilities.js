import jwtDecode from 'jwt-decode';
import {LOGOUT} from './actions';

export function isTokenExp(token) {
  return jwtDecode(token).exp < Date.now() / 1000;
}
export function getUserName(token) {
  return jwtDecode(token).sub;
}
export function LogOut(navigation, dispatch) {
  dispatch({
    type: LOGOUT,
  });
  navigation.navigate('Restaurants');
}
