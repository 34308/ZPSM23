import {getData} from './StorageHelper';
import {LOGIN, LOGOUT} from './actions';

const user = getData(LOGIN);
const initialState = user
  ? {
      isLoggedIn: true,
    }
  : {
      isLoggedIn: false,
    };
export default function loginReducer(state = false, action) {
  const {type, payload} = action;
  switch (type) {
    case LOGIN:
      return true;
    case LOGOUT:
      return false;
    default:
      return state;
  }
}
