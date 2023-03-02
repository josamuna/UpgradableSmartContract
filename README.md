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

- Install **Hardhat Upgrades** from Openszppelin, **Hardhat Etherscan** and Openzeppelin contracts (To use Timelock behavior).

```
npm install @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-etherscan @openzeppelin/contracts
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

- Instead of using constructor, we will follow the openzeppelin pattern without inporting openzeppelin file ([Read here](https://zpl.in/upgrades/error-001)).

2. Compile the contract file:

```
npx hardhat compile
```

3. Write the test cases (For the contract V1 and the Proxy version also), and run them by typing this command:

```
npx hardhat test
```

4. Write the `scripts/deploy.js` file.
5. Deploy the scripts to `goerli testnet` ans save the output address as **Proxy Address** inside **addresses.json** file (.txt could be also used, just a preference):

```
npx hardhat run scripts/deploy.js --network goerli
```

6. We can proceed with the verification contract using the deployed address directly from [goerli ethercan](https://goerli.etherscan.io/). For this project, the full link with address will be [this](https://goerli.etherscan.io/address/0x8731cC23eB3Fe2bd08Fd64Eecf65bD1e21E6c41E).

- Navigate to **contract tab**.
- Chooce **More Options**.
- Click on **Is this is a proxy?**.
- Click on **Verify**.
- Copy the **Implementation address** and save it inside the `addresses.json file`.

If the verification failed, we can use this command:

```
npx hardhat verify --network goerli 0x3f27585a5e0C84bE5D81C08E468325c43A40191b
```

The result will look like:

```
Verifying implementation: 0x646B16f440923BbaB111be6971aa36bE2d5F0311
Nothing to compile
Successfully submitted source code for contract
contracts/JosamTokenV1.sol:JosamToken at 0x646B16f440923BbaB111be6971aa36bE2d5F0311
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JosamToken on Etherscan.
https://goerli.etherscan.io/address/0x646B16f440923BbaB111be6971aa36bE2d5F0311#code
Verifying proxy: 0x3f27585a5e0C84bE5D81C08E468325c43A40191b
Contract at 0x3f27585a5e0C84bE5D81C08E468325c43A40191b already verified.
Linking proxy 0x3f27585a5e0C84bE5D81C08E468325c43A40191b with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x8b7b7DC5911c3C889E5913A09CCbEdC7C22cdA83
Contract at 0x8b7b7DC5911c3C889E5913A09CCbEdC7C22cdA83 already verified.

Proxy fully verified.
```

7. Copy the `Tmelock.sol` contract from `node_modules` (`/node_modules/@opezeppelin/contracts/governance/TimelockController.sol`) and past it on the contract folder. Update import with openzeppelin full import (This contract will behave as the Administrator of Smart Contract during upgrade process and **delaying Smart Contract function execution**.).
8. Create a multisignature wallet with [Gnosis safe](https://safe.global/), and play the role of `proposer` and `executor`. This will allow multisign transaction and call timelock to wait for the delay to upgrade `JosamTokenV1` to `JosamTokenV2`.

- Connect MetaMask account used in earlier steps.
- Provide a project name: `ProxyImplementation` and select `goerli`.
- Add at least one owner and give a name of each one (eg.: first, second, etc.).

9. Create `arguments file` to specify time duration to execute transaction (By the contract itself), executors array and proposers array to be passed as arguments to Timelock.sol contract during deployment.
10. Create Admin address for the Timelock.sol contract ([By following the documentation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/TimelockController.sol)) to be deployed.
11. Deploy the `Timelock.sol` contract after writing the proper script file `scripts/deploy-timelock.js`.

```
npx hardhat run scripts/deploy-timelock.js --network goerli
```

12. Verify that the Timelock contract has deployed successfully by typing this command:

```
npx hardhat verify --network goerli --constructor-args arguments.js 0x45aC0f1607D1CF80e7e1Ce6Beb349428E8674500
```

Result will look like this:

```
Successfully submitted source code for contract
contracts/Timelock.sol:TimelockController at 0x45aC0f1607D1CF80e7e1Ce6Beb349428E8674500
for verification on the block explorer. Waiting for verification result...

Successfully verified contract TimelockController on Etherscan.
https://goerli.etherscan.io/address/0x45aC0f1607D1CF80e7e1Ce6Beb349428E8674500#code
```

13. inside `.openzeppelin/goerli.json` file, copy the `Admin address` inside the `addresses.json file` as `ProxyAdmin`.
14. Write the file `transfer_ownership.js` to make `Timelock` the ownership of our proxy contract. Change the administrator. Write the script file and execute it (The current ProxyAdmin address should became the `TimelockController`):

```
npx hardhat run scripts/transfer_ownership.js --network goerli
```

The result will look like this:

```
Transferring ownership of ProxyAdmin
✔ 0x8731cC23eB3Fe2bd08Fd64Eecf65bD1e21E6c41E (transparent) proxy ownership transfered through admin proxy
✔ 0x4F963F063531C4d51e0fb38e2F4575c0011B339c (transparent) proxy ownership transfered through admin proxy
✔ 0x220cF9b775888C996B77b4bb6DCb40C8754FbB31 (transparent) proxy ownership transfered through admin proxy
✔ 0x3f27585a5e0C84bE5D81C08E468325c43A40191b (transparent) proxy ownership transfered through admin proxy
Transferred ownership of ProxiAdmin to: 0x45aC0f1607D1CF80e7e1Ce6Beb349428E8674500
```

15. Prepare `JosamTokenV2` by writting the new Smart Contract.
16. Compile the contract file with the command:

```
npx hardhat compile
```

16. Write test cases for `JosamTokenV2` and `JosamTokenV2.proxy` (Where we deploy **V1 Proxy contract** and **V2 Proxy using V1 upgrade Proxy address**), then run it with this command:

```
npx hardhat test
```

17. Prepare the
