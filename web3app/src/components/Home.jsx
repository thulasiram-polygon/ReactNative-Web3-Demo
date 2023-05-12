import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  Center,
  Text,
  VStack,
  Fab,
  AddIcon,
  Spinner,
  useToast,
} from 'native-base';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethereum} from '../helpers/createWeb3Wallet';
import {ethers} from 'ethers';
import {useWeb3} from '../context/Web3Context';
import {ScrollView} from 'react-native';
import {shortenAddress} from '../helpers/shortenAddress';
import NFTABI from '../abi/abi.json';
import UserNFTs from './UserNFTs';

const Home = () => {
  const {IPFS_IMAGE_HASH} = useWeb3();
  const toast = useToast();
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [account]);

  useEffect(() => {
    async function initProvider() {
      if (ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            NFTABI.address,
            NFTABI.abi,
            signer,
          );
          setProvider(provider);
          setContract(contract);
          setSigner(signer);
        } catch (error) {
          console.log(error);
        }
      }
    }
    initProvider();
  }, [ethereum, account]);

  const getBalance = async () => {
    console.log('GET BALANCE');
    if (!ethereum) {
      return console.log('Please install MetaMask!');
    }

    if (!account) {
      return console.log('Please connect wallet!');
    }

    try {
      const bal = await provider.getBalance(account);
      console.log('BALANCE', ethers.utils.formatEther(bal));
      // setProvider(provider);
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      console.log(error);
    }
  };

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

  const mintNFT = async () => {
    console.log('MINT NFT');
    if (!ethereum) {
      //console.log('Please install MetaMask!');
      return 'Please install MetaMask!';
    }
    try {
      //const provider = new ethers.providers.Web3Provider(ethereum);

      if (!provider) {
        console.log('Provider not found');
        return 'Provider not found';
      }

      //console.log('PROVIDER', provider);

      //const signer = await provider.getSigner();

      if (!signer) {
        console.log('Signer not found');
        return 'Signer not found';
      }

      //console.log('SIGNER', signer);
      const contract = new ethers.Contract(NFTABI.address, NFTABI.abi, signer);
      //console.log('CONTRACT', contract);
      const transaction = await contract.mintAward(account, IPFS_IMAGE_HASH);
      console.log('TX', transaction);
      const tx = await transaction.wait();
      console.log('TX', tx);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const mintUserNFT = async () => {
    setLoading(true);
    try {
      const error = await mintNFT();
      setLoading(false);
      if (error) {
        console.log(error);
        toast.show({
          title: 'Error',
          status: 'error',
          description: error,
        });
      } else {
        toast.show({
          title: 'NFT Minted',
          status: 'success',
          description: 'Your NFT has been minted!',
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.show({
        title: 'Error',
        status: 'error',
        description: error,
      });
    }
  };

  const returnUserAccountDetails = () => {
    return (
      <VStack
        w="100%"
        bg="primary.600"
        h="200"
        justify="center"
        align="center"
        p="20">
        <Center>
          <Text fontSize="lg">Account</Text>
          <Text bold fontSize="xl">
            {account ? shortenAddress(account) : 'Not Connected'}
          </Text>

          <Text fontSize="lg">Balance</Text>
          <Text bold fontSize="lg">
            {Number(balance).toFixed(4)} MATIC
          </Text>
        </Center>
      </VStack>
    );
  };

  return (
    <ScrollView>
      {returnUserAccountDetails()}
      {!account && (
        <Button
          variant="link"
          colorScheme="secondary"
          onPress={connectWallet}
          p="30">
          Connect to Metamask
        </Button>
      )}
      {account && <UserNFTs account={account} />}
      <Fab
        shadow={2}
        size="sm"
        icon={
          loading ? (
            <Spinner />
          ) : (
            <AddIcon color="white" name="plus" size="sm" />
          )
        }
        label={loading ? 'Loading' : 'Create NFT'}
        bg="primary.600"
        bottom={50}
        disabled={loading}
        onPress={mintUserNFT}
      />
    </ScrollView>
  );
};

export default Home;
