import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ethers } from 'ethers'
import { contractAddress, abi } from "../../public/constants"
import { useAccount, useSigner, useProvider } from 'wagmi'
import { useState, useEffect } from 'react';
import useOwnerAddress from "../../hooks/useOwnerAddress";




const Header = () => {
    const { data: signer } = useSigner()
    const provider = useProvider()
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const { address, isConnected } = useAccount()



    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            <Text fontWeight="bold">Logo</Text>
            <Flex width="30%" justifyContent="space-between" alignItems="center">
                <Text><Link href="/">Home</Link></Text>
                <Text><Link href="/collection">My Collection</Link></Text>
            </Flex>
            <ConnectButton />
        </Flex>
    )
}

export default Header;