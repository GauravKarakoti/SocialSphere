require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require('dotenv').config();

const NERO_TESTNET_PROVIDER_URL = process.env.NERO_TESTNET_PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    solidity: "0.8.24",
    defaultNetwork: "nero_testnet",
    networks: {
        nero_testnet: {
        url: NERO_TESTNET_PROVIDER_URL,
        accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
    apiKey: process.env.API_KEY,
    customChains: [
    {
        network: "nero_testnet",
        chainId: 689,
        urls: {
        apiURL: "https://api-testnet.neroscan.io/api",
        browserURL: "https://testnet.neroscan.io",
        },
    },
    ],
    enabled: true
    },
};