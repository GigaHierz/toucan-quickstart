# Toucan Quickstart Repo

This repository serves as a quickstart to interact with Toucan's contracts.

If you want to implement paying for the retirement with tokens like cUSD, you can add the [SimpleSwapper](https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps) from [Uniswap](https://uniswap.org/developers). For testing the swap, we recommend to fork the mainnet, as there are no pools with Toucan tokens deployed. You can do that by running `yarn run fork-mainnet`.
Check the OffsetHelper for examples. It uses Uniswap Router V2.

This repository has been build with the [Celo-Composer](https://github.com/celo-org/celo-composer) and it comes with

- Interfaces of the most important contracts to redeem, retire and create certificates.
- Carbon Project Types
- a FE example implementation

Find a full tutorial to the example contract `RetirementHelper.sol` below.

## Setup & Installation

### Smart Contracts

Navigate to the Smart Contracts

```bash
cd packages/hardhat
```

create the `.env` file by

```bash
cp .env.example .env
```

add your private key to the `.env`file

and deploy the Smart Contract on the chain of your liking. Toucan is currently deployed on Celo, Alfajores, Polygon and Mumbai.

```bash
yarn hardhat run scripts/deploy.js --network <network>
```

### Frontend

Navigate to the frontend

```bash
cd packages/react-app
```

Run `yarn` or `npm install` to install all the required dependencies to run the dApp.

```bash
yarn
```

> React + Tailwind CSS Template does not have any dependency on hardhat and truffle.

- To start the dApp, run the following command.

Before you can start the app, you need to add a Wallet Connect project ID into the
`.env` file `NEXT_PUBLIC_WC_PROJECT_ID`. If you don't have one yet, you can get one form [Wallet Connect](https://cloud.walletconnect.com/app).

Now you can run the app.

```bash
yarn react-dev
```

## Addresses

| Chain     | Pool Tokens                                                                                          | Swap Tokens                                                                                                                                                                                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Celo      | BCT: "0x0CcB0071e8B8B716A2a5998aB4d97b83790873Fe", NCT: "0x02De4766C272abc10Bc88c220D214A26960a7e92" | mcUSD: "0xE273Ad7ee11dCfAA87383aD5977EE1504aC07568", cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a", CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438", WETH: "0x122013fd7dF1C6F636a5bb8f03108E876548b455", USDC: "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a" |
| Alfajores | BCT: "0x4c5f90C50Ca9F849bb75D93a393A4e1B6E68Accb", NCT: "0xfb60a08855389F3c0A66b29aB9eFa911ed5cbCB5" | cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",CELO: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"                                                                                                                                                               |
| Polygon   | BCT: "0x2F800Db0fdb5223b3C3f354886d907A671414A7F", NCT: "0xD838290e877E0188a4A44700463419ED96c16107" | USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"                                                                                                        |
| Mumbai    | BCT: "0xf2438A14f668b1bbA53408346288f3d7C71c10a1", NCT: "0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E" | USDC: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747", WETH: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa", WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"                                                                                                        |
