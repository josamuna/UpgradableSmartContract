require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");

const { alchemyAPIKeyGoerli } = require("./secrets.json");
const { etherscanAPIKey } = require("./secrets.json");
const { deployerWalletPrivateKey } = require("./secrets.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.6",
  settings: {
    optimize: {
      enabled: true,
      runs: 200,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: alchemyAPIKeyGoerli, // From Alchemy
      accounts: [deployerWalletPrivateKey], // From MetaMask account
      gas: 10000000,
    },
  },
  etherscan: {
    apiKey: etherscanAPIKey, // From Etherscan API
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "cache",
    artifacts: "./artefacts",
  },
};
