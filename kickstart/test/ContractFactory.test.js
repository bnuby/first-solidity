const { AssertionError } = require('assert');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../ethereum/build/CampaignFactory.json');
const Crownfunding = require('../ethereum/build/Crownfunding.json');
/**
 * @type {Web3.default}
 */
const web3 = new Web3(ganache.provider());

let accounts,
    /**
     * @type {InstanceType<Web3.default['eth']['Contract']>}
     */
    campaignFactory,
    manager;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    manager = accounts[0];
    campaignFactory = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
        })
        .send({
            from: manager,
            gas: '2000000',
        });
});

describe.only('Contract Factory', () => {
    it('deploy a contract', () => {
        assert.ok(campaignFactory.options.address);
    });
    it('Create a campaign successful', async () => {
        let deployedContracts = await campaignFactory.methods
            .getDeployedCampaigns()
            .call();
        assert.equal(deployedContracts.length, 0);
        const r = await campaignFactory.methods.createCampaign(0).send({
            from: accounts[1],
            gas: '3000000',
        });
        deployedContracts = await campaignFactory.methods
            .getDeployedCampaigns()
            .call();
        assert.equal(deployedContracts.length, 1);

        [campaignAddress] = deployedContracts;
        const campaign = new web3.eth.Contract(
            Crownfunding.abi,
            campaignAddress
        );

        try {
            assert(false);
        } catch (e) {
            if (e instanceof AssertionError) throw e;
            assert(e);
        }
    });
});
