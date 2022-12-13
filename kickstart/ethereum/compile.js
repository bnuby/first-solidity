// compile code will go here
const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// create build folder
const buildPath = path.resolve(__dirname, 'build');
console.log('process build folder');
if (fs.existsSync(buildPath)) fs.rmSync(buildPath, { recursive: true });
fs.ensureDirSync(buildPath);

const input = {
    language: 'Solidity',
    sources: {},
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// create crownfunding sol path
console.log('Read Crown Funding');
const cfPath = path.resolve(__dirname, 'contracts', 'Crownfunding.sol');
const cfSource = fs.readFileSync(cfPath, 'utf8');
console.log('Read Campaign Factory');
const cftPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const cftSource = fs.readFileSync(cftPath, 'utf8');

input.sources = {
    Crownfunding: { content: cfSource },
    CampaignFactory: { content: cftSource },
};
const cfContracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

for (let contract in cfContracts) {
    const outputFile = contract.replace('.sol', '') + '.json';
    console.log('output: ' + outputFile);
    fs.outputJSONSync(
        path.resolve(buildPath, outputFile),
        cfContracts[contract][contract]
    );
}
console.log('~~~ Build successful ~~~');
