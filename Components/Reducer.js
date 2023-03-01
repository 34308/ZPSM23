import {getData, storeData} from './StorageHelper';
import {LOGIN, LOGOUT} from './actions';

const token = getData('JWT');

let initialState;

if (token) {
  initialState = {isLoggedIn: false, token};
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
        isLoggedIn: true,
      };
    case LOGOUT:
      storeData('JWT', '');
      return {
        ...state,
        user: '',
        isLoggedIn: false,
      };
    default:
      return state;
  }
}
