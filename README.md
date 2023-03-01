# Upgradable Smart Contract Task

## The following are the details of the task for creating upgradable smart contracts-

1. Use Transparent Proxy Pattern and Gnosis Multisignature wallet for the implementation.
2. You can refer the document under the resource section of 8th February live class to perform this task
3. The pattern for this upgradable contracts is divided into three phases of upgradable smart contract- Phase 1- contract version 1, Phase 2- contract version 2 and Phase 3 - contract version 3.
4. _Phase 1_- Create a simple ERC20 contract with a pre-minting of 1 million tokens
5. _Phase 2_- Add the functionality to mint and burn tokens, add allowance mechanism functions. All payable and transaction functions should be implemented using the call method.
6. _Phase 3_- Add Reentrancy Guard for vulnerable functions(use a custom modifier to implement reentrancy guard), add onlyOwner modifier wherever necessary(use custom modifier for this implementation).
7. Perform testing for all the phases.

> Note- All features from Phases 1,2 and 3 should be able to be executed directly using the Proxy Address from goerli etherscan.

## Step 1

---

- Creating a simple directory

```
mkdir UpgradableSmartContract
cd UpgradableSmartContract
```

- Initializing **Node** and Installing **Hardhat**

```
npm init
npm install hardhat
```

- Creating **Hardhat project** and installing **Hardhat toolbox**

```
npx hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

OR

```
npx hardhat
npm install --save-dev "hardhat@^2.12.7" "@nomicfoundation/hardhat-toolbox@^2.0.0"
```

- Install **Hardhat Upgrades** from Openszppelin and **Hardhat Etherscan**.

```
npm install @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-etherscan
```

- Editing **hardhat.config.js** file: Specifying Solidity version (The same for Smart Contract): Forr that, supplementary infos should be required:
  - [Infura API key]("https://www.infura.io/").
  - [Etherscan API key]("https://etherscan.io/apis").
  - Wallet private key (From MetaMask Goerli account).
    Thess three parameters will be specified inside the `secrets.json` file like that:

```
{
    "alchemyAPIKeyGoerli":"achemyKey",
    "deployerWalletPrivateKey":"accountPrivateKey",
    "etherscanAPIKey":"etherscanKey"
}
```

## Step 2: Phase 1

---

1. Create a simple ERC20 contract with a pre-minting of 1 million tokens.
2. Compile the contract file:

```
npx hardhat compile
```

3. Write the test cases, and run them by typing this command:

```
npx hardhat test
```

4. Write the `scripts/deploy.js` file.
