import React from 'react';
import {NativeBaseProvider} from 'native-base';
import './shim';
import HomeScreen from './src/screens/HomeScreen';
import {Web3Provider} from './src/context/Web3Context';
import {SafeAreaView} from 'react-native';

export default function App() {
  return (
    <Web3Provider>
      <NativeBaseProvider>
        <HomeScreen />
      </NativeBaseProvider>
    </Web3Provider>
  );
}
