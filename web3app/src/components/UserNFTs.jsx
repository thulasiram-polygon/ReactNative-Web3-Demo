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
  Image,
} from 'native-base';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethereum} from '../helpers/createWeb3Wallet';
import {ethers} from 'ethers';
import NFTABI from '../abi/abi.json';

const UserNFTs = ({account}) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNFTs();
  }, [account]);

  const getNFTs = async () => {
    console.log('GET NFTS');
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(
        NFTABI.address,
        NFTABI.abi,
        provider,
      );

      const balance = await contract.balanceOf(account);
      if (!balance || balance == 0) {
        setNFTs([]);
        setLoading(false);
        return;
      }
      if (balance > 0) {
        let userNFTS = [];
        for (let i = 0; i < balance; i++) {
          const id = await contract.tokenOfOwnerByIndex(account, i);
          console.log(`User NFT ID: ${id}`);
          const image = await contract.tokenURI(id);
          console.log(`User NFT Image: ${image}`);
          userNFTS.push({id, image});
        }
        setNFTs([...userNFTS]);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" />;
  }

  if (nfts.length === 0) {
    return (
      <Box w="100%" h="100%">
        <Center h="100%">
          .<Text color="gray.400">No NFTs</Text>
        </Center>
      </Box>
    );
  }

  return (
    <VStack
      w="100%"
      h="100%"
      space={2}
      justifyContent="center"
      alignItems="center">
      {nfts.map((nft, index) => {
        return (
          <VStack key={index} justifyContent="center" alignItems="center">
            <Image
              source={{uri: `https://ipfs.io/ipfs/${nft.image}`}}
              size="2xl"
              alt="NFT Image"
            />
            <Text fontSize="lg">{`NFT ID: #${nft.id}`}</Text>
          </VStack>
        );
      })}
    </VStack>
  );
};

export default UserNFTs;
