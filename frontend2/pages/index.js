import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useAccount, useProvider, useSigner } from 'wagmi'
import {
  Text, Flex, Button, Card, Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider
} from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress, abi } from "../public/constants"



export default function Home() {

  const { address, isConnected } = useAccount()
  const [nftList, setNftList] = useState([]);
  const { data: signer } = useSigner();
  const [buy, setBuy] = useState([]);


  async function fetchNfts() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const nfts = await contract.getAllNFTs();

      setNftList(nfts);
    }
  }

  useEffect(() => {
    fetchNfts();
    tokenBuyEvent()
  }, [address, signer, nftList]);


  async function tokenBuyEvent() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)

      const tokenBuyFilter = contract.filters.TokenBuy();

      const buyEvents = await contract.queryFilter(tokenBuyFilter);

      const buyArray = buyEvents.map((event) => {
        const { seller, buyer, tokenId, price } = event.args;
        return [seller, buyer, tokenId, price];
      });

      setBuy(buyArray);
    }
  }

  async function buyZoneNFT(id, price) {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      await contract.buyZoneNFT(parseInt(id), { value: price });
    }
  }



  return (
    <>
      <Head>
        <title>Alyra DApp : Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isConnected ? (
          <div align="center">
            Welcome to Punk Hazard !
            < Image src="/PunkHazard.jpeg" alt="img" width={600} height={200} style={{ margin: 10 }} />
            <div>
              <hr></hr>
              <h1>Zone A</h1>
              < Image src={`https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/0.jpeg`} alt="img" width={400} height={400} style={{ margin: 10 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {nftList.slice(0, 4).map((nft) => (
                <Card style={{ margin: 20, padding: 10, border: `10px solid ${nft[1] ? "green" : "red"}` }} key={nft[4]}>
                  id#{nft[4]}
                  <p>Token location: {nft[0]}</p>
                  {nft[1] ? <p><Button onClick={() => buyZoneNFT(nft[4], nft[2])}>BUY</Button> Token Price: {ethers.utils.formatEther(nft[2].toString())} eth</p> : "not for sale"}

                  {address != nft[3] ?
                    <p> owner: 0x...{nft[3].slice(-4)}</p>
                    : <div className="text-emerald-700">You are the owner of this NFT</div>
                  }
                  <div>
                    <Menu placeholder="past sell">
                      <MenuButton as={Button} >
                        Past transfers
                      </MenuButton>
                      <MenuList>

                        {buy.filter(item => item[2].toString() === nft[4].toString()).map((item) => (
                          <MenuItem key={item[2]}>
                            <p>Seller:0x...{item[0].slice(-4)} / </p>
                            <p> Buyer:0x...{item[1].slice(-4)} / </p>
                            <p> Token ID: {item[2].toString()} / </p>
                            <p> Price: {ethers.utils.formatEther(item[3].toString())} eth</p>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </div>
                </Card>
              ))}
            </div>
            <div>
              <hr></hr>
              <h1>Zone B</h1>
              < Image src={`https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/1.jpeg`} alt="img" width={400} height={400} style={{ margin: 10 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {nftList.slice(4, 8).map((nft) => (
                <Card style={{ margin: 20, padding: 10, border: `10px solid ${nft[1] ? "green" : "red"}` }} key={nft[4]}>
                  id#{nft[4]}
                  <p>Token location: {nft[0]}</p>
                  {nft[1] ? <p><Button onClick={() => buyZoneNFT(nft[4], nft[2])}>BUY</Button> Token Price: {ethers.utils.formatEther(nft[2].toString())} eth</p> : "not for sale"}

                  {address != nft[3] ?
                    <p> owner: 0x...{nft[3].slice(-4)}</p>
                    : <div className="text-emerald-700">You are the owner of this NFT</div>
                  }
                  <div>
                    <Menu placeholder="past sell">
                      <MenuButton as={Button} >
                        Past transfers
                      </MenuButton>
                      <MenuList>

                        {buy.filter(item => item[2].toString() === nft[4].toString()).map((item) => (
                          <MenuItem key={item[2]}>
                            <p>Seller:0x...{item[0].slice(-4)} / </p>
                            <p> Buyer:0x...{item[1].slice(-4)} / </p>
                            <p> Token ID: {item[2].toString()} / </p>
                            <p> Price: {ethers.utils.formatEther(item[3].toString())} eth</p>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Alert status='warning' width="50%">
            <AlertIcon />
            Please, connect your Wallet!
          </Alert>
        )
        }
      </Layout >
    </>
  )
}
