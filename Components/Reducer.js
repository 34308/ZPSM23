import {getData, storeData} from './StorageHelper';
import {LOGIN, LOGOUT} from './actions';

const token = getData('JWT');

let initialState;

if (token) {
  initialState = {isLoggedIn: true, token};
} else {
  initialState = {isLoggedIn: false};
}

export default function loginReducer(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case LOGIN:
      storeData('JWT', payload);
      return {
        ...state,
        token: payload,
        loggedIn: true,
      };
    case LOGOUT:
      storeData('JWT', '');
      return {
        user: '',
        loggedIn: false,
      };
    default:
      return state;
  }
}
