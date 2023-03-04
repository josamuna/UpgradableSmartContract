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

6. We can proceed with the verification contract using the deployed address directly from [goerli ethercan](https://goerli.etherscan.io/). For this project, the full link with address was [this](https://goerli.etherscan.io/address/0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7).

- Navigate to **contract tab**.
- Chooce **More Options**.
- Click on **Is this is a proxy?**.
- Click on **Verify**.
- Copy the **Implementation address** and save it inside the `addresses.json file` (`proxyAddress`).

**If the verification failed, we can use this command (This was the case)**:

```
npx hardhat verify --network goerli 0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7
```

The result will look like:

```
Verifying implementation: 0xf6486485Fc8CEB4a5914e1516FcbE5E162C4eEe1
Nothing to compile
Successfully submitted source code for contract
contracts/JosamTokenV1.sol:JosamToken at 0xf6486485Fc8CEB4a5914e1516FcbE5E162C4eEe1
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JosamToken on Etherscan.
https://goerli.etherscan.io/address/0xf6486485Fc8CEB4a5914e1516FcbE5E162C4eEe1#code
Verifying proxy: 0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7
Contract at 0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7 already verified.
Linking proxy 0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7 with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x609BB601d0130697DfbFB43e03484473EF04b151
Contract at 0x609BB601d0130697DfbFB43e03484473EF04b151 already verified.

Proxy fully verified.
```

7. Copy the `Tmelock.sol` contract from `node_modules` (`/node_modules/@opezeppelin/contracts/governance/TimelockController.sol`) and past it on the contract folder. Update import with openzeppelin full import (This contract will behave as the Administrator of Smart Contract during upgrade process and **delaying Smart Contract function execution**.).
8. Create a multisignature wallet with [Gnosis safe](https://safe.global/), and play the role of `proposer` and `executor`. This will allow multisign transaction and call timelock to wait for the delay to upgrade `JosamTokenV1` to `JosamTokenV2`.

- Connect MetaMask account used in earlier steps.
- Provide a project name: `ProxyUpgradeImplementation` and select `goerli`.
- Add at least one owner and give a name of each one (eg.: first, second, etc.).

9. Create `arguments file` to specify time duration to execute transaction (By the contract itself), executors array and proposers array to be passed as arguments to Timelock.sol contract during deployment.
10. Create Admin address for the Timelock.sol contract ([By following the documentation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/TimelockController.sol)) to be deployed.
11. Deploy the `Timelock.sol` contract after writing the proper script file `scripts/deploy-timelock.js`.

```
npx hardhat run scripts/deploy-timelock.js --network goerli
```

The result will look like this:

```
Compiled 11 Solidity files successfully
Deploying contract with the account: 0x383ed93db019c2B371AFD70fA49b0B55f836ECdE
Account balance: 1276545331521920582
Timelock contract deployed on address: 0x66b251eaC8E7E567165C676e612F334af65E8819
```

12. Verify that the Timelock contract has deployed successfully by typing this command:

```
npx hardhat verify --network goerli --constructor-args arguments.js 0x66b251eaC8E7E567165C676e612F334af65E8819
```

Result will look like this:

```
Successfully submitted source code for contract
contracts/Timelock.sol:TimelockController at 0x66b251eaC8E7E567165C676e612F334af65E8819
for verification on the block explorer. Waiting for verification result...

Successfully verified contract TimelockController on Etherscan.
https://goerli.etherscan.io/address/0x66b251eaC8E7E567165C676e612F334af65E8819#code
```

13. inside `.openzeppelin/goerli.json` file, copy the `Admin address` inside the `addresses.json file` as `ProxyAdmin`.
14. Write the file `transfer_ownership.js` to make `Timelock Contract` the ownership of our proxy contract to change the Administrator. Write the script file and execute it (The current ProxyAdmin address should became the `TimelockController`):

```
npx hardhat run scripts/transfer_ownership.js --network goerli
```

The result will look like this:

```
Transferring ownership of ProxyAdmin
✔ 0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7 (transparent) proxy ownership transfered through admin proxy
Transferred ownership of ProxiAdmin to: 0x66b251eaC8E7E567165C676e612F334af65E8819
```

> Now, the `Timelock Contract` is the new owner.

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

> All tests should passed to go forward.

4. Prepare the upgrade by writting a new script file: `prepare_upgradeV1.V2.js` (**The propose part** of the upgration, and **The execution part** will be done at the next step.):

```
npx hardhat run scripts/prepare_upgradeV1.V2.js --network goerli
```

The result will look like this (Then copy this deployed address on **addresses.json** file.):

```
Preparing upgrade...
JosamTokenV2 upgrade at: 0xA26c47Dd9D6a6C0D6Ac59F7d7003E32C0974cCF5

```

> This address will be the `Implementation Address` of the `JosamTokenV2 Contract`.

5. Getting Hexadecimal Data.

- Use the `ProxyAdminAddress` from earlier `Timelock` creation on [Goerli Ethercan](https://goerli.etherscan.io/).
- Go to Contract tab, and connect MetaMask wallet.
- Choose option 4 `upgrade` and copy `proxy address` (Our first deployed contract Address: `0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7`) and `Implementation address` (For JosamTokenV2 from prepare_upgradeV1.V2: `0xA26c47Dd9D6a6C0D6Ac59F7d7003E32C0974cCF5`).
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
- Specify `ProxyAdmin Address` on the `Target field`.
- `value` will be `0`.
- `payload` will be the `HEX data` copied on earlier stage.
- For `predecessor` and `salt`, we can give zero address (`0x0000000000000000000000000000000000000000000000000000000000000000`).
- Click on `Add transaction`.
- Click on `Create Batch`.
- Click first on `Simulate` to be sure that all field are properly filled.
- Click on `Send Batch`.

9. Gnosis success Transactions (`Schedule` and `Execute`) of V1 to V2.

![JosamTokenV1 to JosamTokenV2](https://user-images.githubusercontent.com/15903230/222914157-42c4f31a-841d-4fdc-96ec-9b06e5306117.png)

10. Use the `Proxy Contract Address` (**0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7**) on Etherscan (On `Contract Tab`) to be able to `Read as Proxy` and `Write as Proxy` to verify that the contract was upgraded successfully.
11. Then to be able to use the feature of the current contract version (`JosamTokenV2`), a verification should be require, do that by using **the last Contract implementation Address** (`0xA26c47Dd9D6a6C0D6Ac59F7d7003E32C0974cCF5`) with this command:

```
npx hardhat verify --network goerli 0xa26c47dd9d6a6c0d6ac59f7d7003e32c0974ccf5
```

The result will look like this:

```
Nothing to compile
Successfully submitted source code for contract
contracts/JosamTokenV2.sol:JosamTokenV2 at 0xa26c47dd9d6a6c0d6ac59f7d7003e32c0974ccf5
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JosamTokenV2 on Etherscan.
https://goerli.etherscan.io/address/0xa26c47dd9d6a6c0d6ac59f7d7003e32c0974ccf5#code
```

12. JosamTokenV2 upgraded implementation on Etherscan

![JosamTokenV1 to JosamTokenV2 upgraded on Etherscan Goerli](https://user-images.githubusercontent.com/15903230/222914395-6af1c7c7-e614-43da-992f-ffba1aef0e60.png)

## Step 4: Phase 3

---

1. Write `version 3` of the contract `JosamTokenV3` with `onlyOwner` behavior and `custom ReentrancyGuard` behavior also.
2. Write test cases for `JosamTokenV3` (Including `JosamTokenV3.proxy`) and run them with this command.

```
npx hardhat test
```

3. Write te `prepare_upgradeV2.V3.js` script file and run it to upgrade from `V2` to `V3`, and run it also:

```
npx hardhat run scripts/prepare_upgradeV2.V3.js --network goerli
```

The result will look like this:

```
Preparing upgrade...
JosamTokenV3 upgrade at: 0xd057a43029B1f4097450D10edaCFAe6A04e4E8Fb
```

The new address will be the new `Implementation Address` of the Contract (`JosamTokenV3`). We are going to coy it inside the `addresses.json`.

4. Then we can proceed with the previous steps (**Step3 : Phase 2: From 5 to 9**) by using address of `latest contract implementation` and the new `HEX Data`.

5. Gnosis success Transactions (`Schedule` and `Execute`) of upgrade from V2 to V3.

![JosamTokenV2 to JosamTokenV3](https://user-images.githubusercontent.com/15903230/222914545-b4067db9-ed06-4321-9c32-04273f705b60.png)

6. Use the `Proxy Contract Address` (**0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7**) on Etherscan (On `Contract Tab`) to be able to `Read as Proxy` and `Write as Proxy` to verify that the final (`JosamTokenV3`) has upgraded successfully.
7. Then to be able to use the feature of this final contract version (`JosamTokenV3`), a verification should be require, do that by using **the last Contract implementation Address** (`0xd057a43029B1f4097450D10edaCFAe6A04e4E8Fb`) with this command:

```
npx hardhat verify --network goerli 0xd057a43029B1f4097450D10edaCFAe6A04e4E8Fb
```

The result will look like this:

```
Nothing to compile
Successfully submitted source code for contract
contracts/JosamTokenV3.sol:JosamTokenV3 at 0xd057a43029B1f4097450D10edaCFAe6A04e4E8Fb
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JosamTokenV3 on Etherscan.
https://goerli.etherscan.io/address/0xd057a43029B1f4097450D10edaCFAe6A04e4E8Fb#code
```

8. JosamTokenV3 upgraded implementation on Etherscan

![JosamTokenV2 to JosamTokenV3 upgraded on Etherscan Goerli](https://user-images.githubusercontent.com/15903230/222914580-4dfabbbe-14ab-4c6a-93c4-4bb453697146.png)

9. With that, the upgrade of `JosamTokenV1` to `JosamTokenV2` then to `JosamTokenV3` is done successfully with all features inside final Contract version (**Custom ERC20 Token with custom Reentrancy guard behavior**).
