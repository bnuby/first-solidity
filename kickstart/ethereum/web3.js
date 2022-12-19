import Web3 from 'web3';
import { isServer } from '../utils/isServer';

/**
 * @type {Web3}
 */
let web3;

if (!isServer && typeof window.ethereum !== 'undefined') {
    // // We are in the browser and metamask is running.
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://sepolia.infura.io/v3/2dce5ff922754bbeb3791857d543b3f7'
    );
    web3 = new Web3(provider);
}

export default web3;
