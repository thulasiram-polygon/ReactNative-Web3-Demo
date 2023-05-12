import React, {useState, useEffect, useContext} from 'react';
import {ethereum} from '../helpers/createWeb3Wallet';
import {ethers} from 'ethers';
import NFTABI from '../abi/abi.json';
const IPFS_IMAGE_HASH = 'QmQMCDLBqGqCyyQjgiSNxV6r5sBtbthSAy7y7ncwy97nQh';

const Web3Context = React.createContext(null);

export const Web3Provider = ({children}) => {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (ethereum) {
      setProvider(new ethers.providers.Web3Provider(ethereum));
    }
  }, [ethereum]);

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
    <Web3Context.Provider value={{account, provider, IPFS_IMAGE_HASH}}>
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
