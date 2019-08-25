const { toWei } = require('ethjs-unit');
const HDWalletProvider = require('truffle-hdwallet-provider');

// const infuraConfigRinkeby = require('./infura_rinkeby_deploy.json');
// const infuraConfigMainnet = require('./infura_main_deploy.json');

const skalePrivateKey = "0xa06bbd0e41f35e0f5c9251746a41b1cb47f75ec7d15630edfa313198c389953c"
const skaleUrl = "https://ethberlin01.skalenodes.com:10216"
const skalePublicKey = "0x01206c58b70068Bb86792ac91c0E6F3aE96cCA77"

module.exports = {
    
    migrations_directory: "./migrations",
    
    networks: {
        // infura_rinkeby: {
        //     provider() {
        //       return new HDWalletProvider(infuraConfigRinkeby.privateKey, infuraConfigRinkeby.infuraUrl);
        //     },
        //     from: infuraConfigRinkeby.fromAddress,
        //     network_id: 4,
        //     gasPrice: toWei(10, 'gwei').toNumber(),
        //     gas: toWei(6, 'mwei').toNumber()
        // },
        
        // infura_main: {
        //     provider() {
        //       return new HDWalletProvider(infuraConfigMainnet.privateKey, infuraConfigMainnet.infuraUrl);
        //     },
        //     from: infuraConfigMainnet.fromAddress,
        //     network_id: 0,
        //     gasPrice: toWei(50, 'gwei').toNumber(),
        //     gas: toWei(6, 'mwei').toNumber()
        // },
        
        development: {
            host: "localhost",
            port: 7545,
            network_id: "5777"
        },

        skale: {
          provider() {
            return new HDWalletProvider(skalePrivateKey, skaleUrl);
          },
          from: skalePublicKey,
          network_id: 0,
          gasPrice: toWei(50, 'gwei').toNumber(),
          gas: toWei(6, 'mwei').toNumber()
        },
    },
    
    compilers: {
        solc: {
          version: "0.5.0",
          settings: {
            optimizer: {
              enabled: true,
              runs: 500
            },
            evmVersion: "byzantium"
          }
        }
    },
    
    mocha: {
        reporter: 'eth-gas-reporter',
        reporterOptions: {
            currency: 'USD',
            gasPrice: 10
        }
    }
};