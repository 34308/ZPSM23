import SplashScreen from 'react-native-splash-screen';
import React from 'react';

import loginReducer from './Components/Reducer';
import {Provider as StoreProvider} from 'react-redux';
import store from './Components/Screens/store';
import Navigation from './Components/Navigation';
import FlashMessage from 'react-native-flash-message';

function App() {
  SplashScreen.hide();
  return (
    <StoreProvider store={store}>
      <Navigation />
        <FlashMessage position="top" />
    </StoreProvider>
  );
}

export default App;
