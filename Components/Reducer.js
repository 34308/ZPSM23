import {getData, storeData} from './StorageHelper';
import {LOGIN, LOGOUT} from './actions';
import jwtDecode from 'jwt-decode';
import {useDispatch} from 'react-redux';
import {createStore} from 'redux';

const token = getData('JWT');

let initialState;

if (token) {
  jwtDecode(
    'eyJraWQiOiJiZDM4OTU4ZC01ZjU4LTRiNjMtYTQyNy0yMGM4N2FlZGZlOGMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiYnJvbmlxIiwiZXhwIjoxNjczNjE1NzQ3LCJpYXQiOjE2NzM2MTIxNDcsInNjb3BlIjoiIn0.bqGJK5moaGybJ3H3cCqMn7pH1SVZ14ANy_mcjRXVyQeIoqSJ_eJLeeeWzy7LGNNjNRAt6tXMSi8fwQKgtkeh8n2XmmvBpGBcPSMb1ZyfpVwSu92LI4rX4rill5082MlUjAxUvzj9loqXqaZ3dx-LbtZMl0Pf6Mzu_02rbD33mSxsiNQsuT6VvPu2K1pVk_-HKJH-kvY2LFQjALuUrvj4mcoUqDng6XWWlzwU80zzUmc0cbMF8ppRx_S7U58Ogj8qAeAONoBbYBWPtlthHxs9Y_KUov-z9f3b-i-ARzH0Q5ixJAFkL3B0JtfBwmqcyD2WMOVb_lSw1tNYHBj289CGhw',
  );
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
