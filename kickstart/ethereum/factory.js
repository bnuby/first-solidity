import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
import { isServer } from '../utils/isServer';

/**
 * @type {InstanceType<web3['eth']['Contract']>}
 */
let instance = null;
if (web3) {
    instance = new web3.eth.Contract(
        CampaignFactory.abi,
        '0x3Dc5C185179fdce4bA12ea133abbcaDFf033f5d2'
    );
}
export default instance;
