import {
    encodeSecp256k1Pubkey,
    EnigmaUtils,
    ExecuteResult,
    FeeTable,
    InstantiateResult,
    pubkeyToAddress,
    Secp256k1Pen,
    SigningCosmWasmClient,
    UploadResult
} from 'secretjs';

import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {PubKey} from 'secretjs/types/types';

dotenv.config();

const customFees: FeeTable = {
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

async function main(): Promise<void> {
    const httpUrl: string = process.env.SECRET_REST_URL;
    const mnemonic: string = process.env.MNEMONIC;
    const signingPen: Secp256k1Pen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey: PubKey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress: string = pubkeyToAddress(pubkey, 'secret');

    const txEncryptionSeed: Uint8Array = EnigmaUtils.GenerateNewSeed();
    const client: SigningCosmWasmClient = new SigningCosmWasmClient(
        httpUrl,
        accAddress,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, customFees
    );
    console.log('Wallet address: ', accAddress);

    const wasm: Buffer = fs.readFileSync('contract.wasm');
    const uploadReceipt: UploadResult = await client.upload(wasm, {});

    const codeId: number = uploadReceipt.codeId;
    const initMsg = {'count': 101};
    const contract: InstantiateResult =
        await client.instantiate(codeId, initMsg, 'My Counter' + Math.ceil(Math.random() * 10000));

    const contractAddress: string = contract.contractAddress;
    console.log('contract:', contract)

    let response = await client.queryContractSmart(contractAddress, {'get_count': {}});
    console.log('Count: ', response.count);

    const handleMsg = {increment: {}};
    response = await client.execute(contractAddress, handleMsg) as ExecuteResult;
    console.log('response: ', response);

    // Query again to confirm it worked
    console.log('Querying contract for updated count')
    response = await client.queryContractSmart(contractAddress, {'get_count': {}})

    console.log('New Count: ', response.count);
}

main().then(console.log).catch(console.log);
