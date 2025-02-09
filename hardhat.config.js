require("@nomicfoundation/hardhat-toolbox");
require("hardhat-circom")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
      },
      {
        version: "0.4.23",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      chainId: 31337,
    },
    ethereum: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId:1,
      blockConfirmations:6
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId:1101,
      blockConfirmations:9,
    },
    polygon_zkEvm:{
      url: process.env.POLYGON_ZK_EVM,
      accounts: [process.env.PRIVATE_KEY],
      chainId:137,
      blockConfirmations:10,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    user1: {
      default: 1,
    },
  },
  circom : {
    inputBasePath:'./circuits',
    ptau:'https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_15.ptau',
    circuits:[
      {
        name:'sample'
      }
    ]
  }
};
