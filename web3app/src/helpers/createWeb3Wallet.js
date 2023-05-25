import MetaMaskSDK from '@metamask/sdk';
import {Linking, Alert} from 'react-native';
import {ethers} from 'ethers';
import BackgroundTimer from 'react-native-background-timer';

const MMSDK = new MetaMaskSDK({
  openDeeplink: link => {
    handleLinking(link);
    //Linking.openURL(link); // Use React Native Linking method or your favourite way of opening deeplinks
  },
  // openDeeplink: link => {
  //   Linking.openURL(link); // Use React Native Linking method or your favourite way of opening deeplinks
  // },
  timer: BackgroundTimer, // To keep the app alive once it goes to background
  dappMetadata: {
    name: 'React Native Test Dapp',
    url: 'example.com',
  },
});

const handleLinking = async url => {
  // console.log(link);
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    console.log(`<== opening LINK: ==> ${url}`);
    setTimeout(async () => {
      await Linking.openURL(url);
    }, 1000);
    //
  } else {
    Alert.alert('Alert', 'MetaMask is not installed');
  }
};

const ethereum = MMSDK.getProvider();

export {ethereum};
