# Alyra Final Project

This repository contains a NFT Dapp, initialized with [Hardhat] and running with a `ZoneNFT.sol` Solidity smart contract.

Visit online Dapp : https://alyra-final-project.vercel.app/

See video demo of the Voting Dapp : https://www.loom.com/share/aa8b847fd81e4cdb98eb3c8e17e5d587

## Table of Contents

- [Prerequis](#prerequis)
- [Installation](#installation)
- [Launch front-end Dapp](#launch-front-end-dapp)
- [Launch back-end app](#launch-back-end-app)
- [Running the tests](#running-the-tests)
- [License](#license)
- [Authors](#authors)

## Prerequis

Before using ZoneNFT contract, you need to install the following dependencies:

- Node.js
- Hardhat

## Installation

Instructions on how to install the project and its dependencies.

1. Clone the repository to your local machine.

```sh
git clone https://github.com/rembeuch/alyraFinalProject.git
```

2. Navigate to hardhat directory & install the required dependencies.

```sh
cd alyraFinalProject/backend && npm i
```

3. Navigate to Frontend2 directory & install the required dependencies.

```sh
cd alyraFinalProject/Frontend2 && npm i
```

## Launch front-end Dapp

Instructions on how to launch your local front-end.

1. Start your local Dapp.

```sh
cd alyraFinalProject/Frontend2 && yarn dev
```

2. Go to your local host : http://localhost:3000/

## Launch back-end app

Instructions on how to launch your local back-end.

1. Launch your local Ethereum blockchain

```sh
cd alyraFinalProject/Backend && yarn hardhat node
```

2. Open another terminal window & deploy your smart contract.

```sh
cd alyraFinalProject/Backend &&  yarn hardhat run scripts/deploy.js --network localhost
```

## Running the tests

Tests are written using the Chai framework and the OpenZeppelin Test Helpers tool.

Follow the steps below:

1. Launch local Ethereum client

```sh
yarn hardhat node
```

2. Run the tests

```sh
yarn hardhat test
```

3. Run test coverage

```sh
yarn hardhat coverage
```

## License

This project is MIT licensed 

## Authors

- [Beucherie Rémi](https://github.com/rembeuch) - Solidity Developer