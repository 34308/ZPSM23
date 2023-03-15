import SplashScreen from 'react-native-splash-screen';
import React, { useEffect } from "react";

import loginReducer from './Components/Reducer';
import {Provider as StoreProvider} from 'react-redux';
import store from './Components/store';
import Navigation from './Components/Navigation';
import FlashMessage from 'react-native-flash-message';
import { checkIfServerActive } from "./Components/Utilities";

function App() {
  SplashScreen.hide();
  let checkingInterval = 10000;
  const checkServerStatus = async () => {
    if (await checkIfServerActive()) console.log('serwer aktywny');
    else console.log('serwer nieaktywny');
  };
  useEffect(() => {
    const intervalId = setInterval(checkServerStatus, checkingInterval);
    return () => clearInterval(intervalId);
    },[])
  return (
    <StoreProvider store={store}>
      <Navigation />
        <FlashMessage position="top" />
    </StoreProvider>
  );
}

export default App;
