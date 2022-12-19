import web3 from './web3';
import Crownfunding from './build/Crownfunding.json';

export default function (address) {
    return new web3.eth.Contract(Crownfunding.abi, address);
}
