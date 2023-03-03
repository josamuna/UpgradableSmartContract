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
5. Deploy the scripts to `goerli testnet` and save the output address as **Proxy Address** inside **addresses.json** file (.txt could be also used, just a preference):

```
npx hardhat run scripts/deploy.js --network goerli
```

> This ProxyAddress will keep track of state variables and help to separate state (Proxy Contract) from the logic (Implementation Contract): **Link the Proxy with Implementation**.

6. We can proceed with the verification contract using the deployed address directly from [goerli ethercan](https://goerli.etherscan.io/). For this project, the full link with address was [this](https://goerli.etherscan.io/address/0x011f85C35A23429b1b5d266c5eD99E29c6C6b019).

- Navigate to **contract tab**.
- Chooce **More Options**.
- Click on **Is this is a proxy?**.
- Click on **Verify**.
- Copy the **Implementation address** and save it inside the `addresses.json file`.

**If the verification failed, we can use this command (This was the case and this test was made later, after setting up ProxyAdmin)**:

```
npx hardhat verify --network goerli 0x011f85C35A23429b1b5d266c5eD99E29c6C6b019
```

The result will look like:

```
Verifying implementation: 0x7B945033c0a137A567F78203fb7537907AAFB487
Nothing to compile
Successfully submitted source code for contract
contracts/JosamTokenV1.sol:JosamToken at 0x7B945033c0a137A567F78203fb7537907AAFB487
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JosamToken on Etherscan.
https://goerli.etherscan.io/address/0x7B945033c0a137A567F78203fb7537907AAFB487#code
Verifying proxy: 0x011f85C35A23429b1b5d266c5eD99E29c6C6b019
Contract at 0x011f85C35A23429b1b5d266c5eD99E29c6C6b019 already verified.
Linking proxy 0x011f85C35A23429b1b5d266c5eD99E29c6C6b019 with implementation
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
npx hardhat verify --network goerli --constructor-args arguments.js 0x49Cdf38938b5C61eA1d1f8245a7D344379E90F26
```

Result will look like this:

```
Successfully submitted source code for contract
contracts/Timelock.sol:TimelockController at 0x49Cdf38938b5C61eA1d1f8245a7D344379E90F26
for verification on the block explorer. Waiting for verification result..

Successfully verified contract TimelockController on Etherscan.
https://goerli.etherscan.io/address/0x49Cdf38938b5C61eA1d1f8245a7D344379E90F26#code
```

13. inside `.openzeppelin/goerli.json` file, copy the `Admin address` inside the `addresses.json file` as `ProxyAdmin`.
14. Write the file `transfer_ownership.js` to make `Timelock Contract` the ownership of our proxy contract to change the Administrator. Write the script file and execute it (The current ProxyAdmin address should became the `TimelockController`):

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
✔ 0x011f85C35A23429b1b5d266c5eD99E29c6C6b019 (transparent) proxy ownership transfered through admin proxy
Transferred ownership of ProxiAdmin to: 0x45aC0f1607D1CF80e7e1Ce6Beb349428E8674500
```

## Step 3: Phase 2

---

1. Prepare `JosamTokenV2` by writting the new Smart Contract.
2. Compile the contract file with the command:

```
npx hardhat compile
```

3. Write test cases for `JosamTokenV2` and `JosamTokenV2.proxy` (Where we deploy **V1 Proxy contract**, and **V2 Proxy using V1 upgrade Proxy address**), then run it with this command:

```
npx hardhat test
```

> All tests shoul passed to go forward.

4. Prepare the upgrade by writting a new script file: `prepare_upgradeV1.V2.js` (**The propose part** of the upgration, and **The execution part** will be done at the next step.):

```
npx hardhat run scripts/prepare_upgradeV1.V2.js --network goerli
```

The result will look like this (Then copy this deployed address on **addresses.json** file.):

```
Preparing upgrade...
JosamTokenV2 upgrade at: 0x6784bd0Ca85B7757b4d2a34d7765259a8Ff5ec65

```

5. Getting Hexadecimal Data.

- Use the `ProxyAdminAddress` from earlier `Timelock` creation on [Goerli Ethercan](https://goerli.etherscan.io/).
- Go to Contract tab, and connect MetaMask wallet.
- Choose option 4 `upgrade` and copy `proxy address` (Our first deployed contract Address: `0x011f85C35A23429b1b5d266c5eD99E29c6C6b019`) and `Implementation address` (For JosamTokenV2 from prepare_upgradeV1.V2: `0x6784bd0Ca85B7757b4d2a34d7765259a8Ff5ec65`).
- Click on write, and on MetaMask (Don't validate transaction), copy the `HEX Data` from `HEX tab` somewere.
- Reject MetaMask Transaction.

6. Schedule and Execute transaction from Gnosis Safe.

- Connect MetaMask wallet (It will be the case by default, because it was done at earliers stage).
- Create transaction by cliking on `New transaction`.
- Chose `Contract interaction`.
- Specify the `Timelock Address` on address field.
- Specify the `abi` (Including brackets also) code of the Timelock Contract from `artifacts` directory of the Hardhat Project.
- On `Transaction information` leaves at it is.
- Choose `schedule` on `Contract Method Selector` to schedule the Upgrade execution (For the delau=y specified ealier).
- Specify `ProxyAdmin Address` on the `Target field`.
- `value` will be `0`.
- `data` will be the `HEX data` copied on earlier stage.
- For `predecessor` and `salt`, we can give zero address (`0x0000000000000000000000000000000000000000000000000000000000000000`).
- For the `delay`, we specify `150` as we did on in the deploy scripts at earlier stage.
- Click on `Add transaction` to proceed.
- Click first on `Simulate` to be sure that all field are properly filled.
- Click on `Create Batch`.
- Click on `Submit` and validate transaction on MetaMask.
- Click on `Send Batch`.

7. Verify the execution of the `Schedule` event on etherscan by copying the `Timelock Address` on Etherscan an verify on the `event tab` (**CallScheduled**) the execution of the task after `150 secondes`.
8. Execute the transaction.

- Create transaction by cliking on `New transaction`.
- Chose `Contract interaction`.
- Specify the `Timelock Address` on address field.
- Specify the `abi` (Including brackets also) code of the Timelock Contract from `artifacts` directory of the Hardhat Project.
- On `Transaction information` leaves at it is.
- `GOR value` will be `0`.
- Oon `Contract Method Selector` instead of `schedule`, we are going to choose `execute` to execute the final transaction (To process the upgrade from V1 to V3).
- `value` will be `0`.
- `payload` will be the `HEX data` copied on earlier stage.
- For `predecessor` and `salt`, we can give zero address (`0x0000000000000000000000000000000000000000000000000000000000000000`).
- Click on `Add transaction`.
- Click on `Create Batch`.
- Click first on `Simulate` to be sure that all field are properly filled.
