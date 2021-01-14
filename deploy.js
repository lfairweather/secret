const {
    EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey
} = require('secretjs');
const fs = require('fs');
require('dotenv').config();

const customFees = {
    upload: {
        amount: [{amount: '2000000', denom: 'uscrt'}],
        gas: '2000000',
    },
    init: {
        amount: [{amount: '500000', denom: 'uscrt'}],
        gas: '500000',
    },
    exec: {
        amount: [{amount: '500000', denom: 'uscrt'}],
        gas: '500000',
    },
    send: {
        amount: [{amount: '80000', denom: 'uscrt'}],
        gas: '80000',
    },
}

const main = async () => {
    const httpUrl = process.env.SECRET_REST_URL;
    const mnemonic = process.env.MNEMONIC;
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress = pubkeyToAddress(pubkey, 'secret');

    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
    const client = new SigningCosmWasmClient(
        httpUrl,
        accAddress,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, customFees
    );
    console.log('Wallet address: ', accAddress);

    const wasm = fs.readFileSync('contract.wasm');
    const uploadReceipt = await client.upload(wasm, {});

    const codeId = uploadReceipt.codeId;
    const initMsg = {'count': 101};
    const contract = await client.instantiate(codeId, initMsg, 'My Counter' + Math.ceil(Math.random() * 10000));
    const contractAddress = contract.contractAddress;
    console.log('contract:', contract)

    let response = await client.queryContractSmart(contractAddress, {'get_count': {}});
    console.log('Count: ', response.count);

    const handleMsg = {increment: {}};
    response = await client.execute(contractAddress, handleMsg);
    console.log('response: ', response);

    // Query again to confirm it worked
    console.log('Querying contract for updated count')
    response = await client.queryContractSmart(contractAddress, {'get_count': {}})

    console.log('New Count: ', response.count);
};

main();
