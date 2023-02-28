import SplashScreen from 'react-native-splash-screen';
import React, {useEffect, useState} from 'react';

import {loginReducer} from './Components/Reducer';
import {Provider as StoreProvider, useDispatch} from 'react-redux';
import store from './Components/Screens/store';
import Navigation from './Components/Navigation';

function App() {
  SplashScreen.hide();
  return (
    <StoreProvider store={store}>
      <Navigation />
    </StoreProvider>
  );
}

export default App;
