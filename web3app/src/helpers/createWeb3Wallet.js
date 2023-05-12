import MetaMaskSDK from '@metamask/sdk';
import {Linking} from 'react-native';
import {ethers} from 'ethers';
import BackgroundTimer from 'react-native-background-timer';

const MMSDK = new MetaMaskSDK({
  openDeeplink: link => {
    Linking.openURL(link); // Use React Native Linking method or your favourite way of opening deeplinks
  },
  timer: BackgroundTimer, // To keep the app alive once it goes to background
  dappMetadata: {
    name: 'My App', // The name of your application
    url: 'https://myapp.com', // The url of your website
  },
});

const ethereum = MMSDK.getProvider();

export {ethereum};
