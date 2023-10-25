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

```

```
