// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const CampaignFactory = require('./build/CampaignFactory.json');

const mnemonic =
    'buzz concert involve wall cactus help digital sponsor half sport reform parent';
// const url = 'https://rinkeby.infura.io/v3/9688353a42db47fb8e43ccb449e7e70d';
const url = 'https://sepolia.infura.io/v3/2dce5ff922754bbeb3791857d543b3f7';

const writeStream = fs.createWriteStream(path.resolve('stdout.log'), {
    flags: 'a',
});
const provider = new HDWalletProvider(mnemonic, url);
/**
 * @type import('web3').default
 */
const web3 = new Web3(provider);

const log = console.log;
console.log = (...args) => {
    const time = `[${new Date().toISOString()}] `;
    log(time, ...args);
    writeStream.write(time + args.join(' ') + '\n');
};

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('Attempting to deploy from account', account);
    const inbox = await new web3.eth.Contract(CampaignFactory.abi)
        .deploy({
            data: CampaignFactory.evm.bytecode.object,
            arguments: [],
        })
        .send({
            from: account,
            gas: '2000000',
        });
    console.log('Contract deployed to >>> ', inbox.options.address);
    provider.engine.stop();
};

deploy();
