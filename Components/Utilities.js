import jwtDecode from 'jwt-decode';
import {LOGOUT} from './actions';
import store from './store';
import {showMessage} from 'react-native-flash-message';
import {COLORS} from './Colors';

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
export function checkIfLoggedAndLogout(navigation, store) {
  fetch('http://10.0.2.2:8082/islogged', {
    method: 'get',
    headers: {Authorization: 'Bearer ' + store.getState().token},
  }).then(response => {
    if (!response.ok) {
      showMessage({
        message: 'Twoja sesja wygasła zaloguj się ponownie.',
        type: 'info',
        backgroundColor: COLORS.second,
        color: COLORS.main,
      });
      LogOut(navigation, store.dispatch);
      navigation.navigate('Restaurants');
      return true;
    }
  });
}
export async function checkIfLogged() {
  const response = await fetch('http://10.0.2.2:8082/islogged', {
    method: 'get',
    headers: {Authorization: 'Bearer ' + store.getState().token},
  });
  if (!response.ok) {
    showMessage({
      message: 'Twoja sesja wygasła zaloguj się ponownie.',
      type: 'info',
      backgroundColor: COLORS.second,
      color: COLORS.main,
    });
    return false;
  }else{
    return true;
  }
}
