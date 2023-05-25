import React, {useState, useEffect, useContext, createContext} from 'react';
import MetaMaskSDK from '@metamask/sdk';
import {ethers} from 'ethers';
import {ethereum} from '../helpers/createWeb3Wallet';

import NFTABI from '../abi/abi.json';
const IPFS_IMAGE_HASH = 'QmQMCDLBqGqCyyQjgiSNxV6r5sBtbthSAy7y7ncwy97nQh';

const Web3Context = createContext(null);

export const Web3Provider = ({children}) => {
  const [account, setAccount] = useState(null);

  // useEffect(() => {
  //   if (ethereum) {
  //     setProvider(new ethers.providers.Web3Provider(ethereum));
  //   }
  // }, [ethereum]);

  const connectWallet = async () => {
    if (!ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const result = await ethereum.request({method: 'eth_requestAccounts'});
      console.log('RESULT', result?.[0]);
      setAccount(result?.[0]);
      //getBalance();
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  return (
    <Web3Context.Provider value={{account, connectWallet, IPFS_IMAGE_HASH}}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
