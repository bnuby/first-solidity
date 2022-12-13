const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
/**
 * @type {Web3.default}
 */
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../ethereum/build/Crownfunding.json');

let manager;
let accounts;
let crownfunding;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    manager = accounts[0];
    crownfunding = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: [0, manager],
        })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Crownfunding', () => {
    it('deploy a contract', () => {
        assert.ok(crownfunding.options.address);
    });
    it('check default crownfunding minimun contribute', async () => {
        const minimun = await crownfunding.methods
            .getMinimunContribute()
            .call();
        assert.equal(minimun, 0);
    });
    it('account 1 is not in approver list', async () => {
        const result = await crownfunding.methods.approvers(accounts[1]).call();
        assert.equal(result, false);
    });
    it('contribute account', async () => {
        const value = web3.utils.toWei('1000', 'wei');
        await crownfunding.methods.contribute().send({
            from: accounts[1],
            value,
        });
        const result = await crownfunding.methods.approvers(accounts[1]).call();
        assert.equal(result, true, 'Account 1 is not in the list');
        const poolAmount = await web3.eth.getBalance(
            crownfunding.options.address
        );
        assert.notEqual(
            poolAmount,
            '999.9',
            'New pool amount is not correct (1)'
        );
        assert.notEqual(
            poolAmount,
            '1001',
            'New pool amount is not correct (2)'
        );
        assert.notEqual(
            poolAmount,
            '999',
            'New pool amount is not correct (3)'
        );
        assert.notEqual(
            poolAmount,
            '1000.4',
            'New pool amount is not correct (4)'
        );
    });
    it('Old pool amount wont affect new pool amount', async () => {
        const value = web3.utils.toWei('1000', 'wei');
        const poolAmount = await web3.eth.getBalance(
            crownfunding.options.address
        );
        assert.notEqual(poolAmount, value, 'New pool amount is not correct');
    });
    it('verify restriction, only manager can create, expected: fail to create request', async () => {
        const recipient = accounts[2];
        const requestCount = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount, 0, 'Incorrect request count (expected: 0)');
        let error;
        try {
            await crownfunding.methods
                .createRequest('This is a test request', '1000', recipient)
                .send({
                    from: accounts[2],
                    gas: '500000',
                });
            error = new Error('Failed restriction');
            throw error;
        } catch (e) {
            if (e === error) assert.ok(false, e.message);
            assert.ok(true);
        }
    });
    it('create request -> fail to finalize request', async () => {
        const recipient = accounts[2];
        let requestCount = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount, 0, 'Incorrect request count (expected: 0)');
        const r = await crownfunding.methods
            .createRequest('This is a test request', 1000, recipient)
            .send({
                from: manager,
                gas: '500000',
            });

        requestCount = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount, 1, 'Incorrect request count (expected: 1)');
        let error;
        try {
            await crownfunding.methods.finalizeRequest(0).send({
                from: manager,
            });
            error = new Error("Shouldn't able to finalize this request");
            throw error;
        } catch (e) {
            if (e === error) assert.ok(false, e.message);
            assert.ok(true);
        }
    });
    it('create request -> fail to approve request', async () => {
        const recipient = accounts[2];
        const requestCount = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount, 0, 'Incorrect request count (expected: 0)');
        const request = await crownfunding.methods
            .createRequest('This is a test request', 1000, recipient)
            .send({
                from: manager,
                gas: '999999',
            });
        assert.equal(await crownfunding.methods.approversCount().call(), 0);
        const requestCount2 = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount2, 1, 'Incorrect request count (expected: 1)');
        let error;
        try {
            await crownfunding.methods.approveRequest(0).call({
                from: manager,
            });
            error = new Error("Shouldn't able to approve this request");
            throw error;
        } catch (e) {
            if (e === error) assert.ok(false, e.message);
            assert.ok(true);
        }
    });
    it('user contribute -> create request -> approve request -> success finalize request', async () => {
        // user contribute
        await crownfunding.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10000', 'wei'),
        });

        // Check is user joined successful
        assert.equal(await crownfunding.methods.approversCount().call(), 1);

        // Verify initial num of request
        const recipient = accounts[2];
        const requestCount = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount, 0, 'Incorrect request count');

        // Create a new request
        const desc = 'This is a test request';
        const r = await crownfunding.methods
            .createRequest(desc, '1000', recipient)
            .send({
                from: manager,
                gas: '999999',
            });
        const requestCount2 = await crownfunding.methods.numRequest().call();
        assert.equal(requestCount2, 1, 'Incorrect request count (expected: 1)');

        // Get request and verify data
        let request = await crownfunding.methods.requests(0).call();
        assert.equal(request.description, desc);

        // approve request
        await crownfunding.methods.approveRequest(0).send({
            from: accounts[1],
        });

        // finalize request
        await crownfunding.methods.finalizeRequest(0).send({
            from: manager,
        });

        // check the request is verified
        request = await crownfunding.methods.requests(0).call();
        assert.ok(request.complete, 'Request failed to finalize');
    });
});
