import {
    CosmWasmClient,
    encodeSecp256k1Pubkey,
    GetNonceResult,
    IndexedTx,
    makeSignBytes,
    PostTxResult,
    pubkeyToAddress,
    SearchTxQuery,
    Secp256k1Pen
} from 'secretjs';

import * as dotenv from 'dotenv';
import {Msg, PubKey, StdFee, StdSignature, StdTx} from 'secretjs/types/types';

dotenv.config();

async function main(): Promise<void> {

    // As in previous tutorial, initialise client from ENV
    const mnemonic: string = process.env.MNEMONIC;
    const signingPen: Secp256k1Pen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey: PubKey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress: string = pubkeyToAddress(pubkey, 'secret');
    const client: CosmWasmClient = new CosmWasmClient(process.env.SECRET_REST_URL);
    const chainId: string = await client.getChainId();


    // Optionally, define a memo for the transaction
    const memo = 'This is a secret message';

    const sendMsg: Msg = {
        type: 'cosmos-sdk/MsgSend',
        value: {
            from_address: accAddress,
            to_address: accAddress,
            amount: [
                {
                    denom: 'uscrt',
                    amount: '100000',
                },
            ],
        },
    };
    const fee: StdFee = {
        amount: [
            {
                amount: '5000',
                denom: 'uscrt',
            },
        ],
        gas: '100000',
    };
    const {accountNumber, sequence}: GetNonceResult = await client.getNonce(accAddress);
    const signBytes: Uint8Array = makeSignBytes([sendMsg], fee, chainId, memo, accountNumber, sequence);
    const signature: StdSignature = await signingPen.sign(signBytes);
    const signedTx: StdTx = {
        msg: [sendMsg],
        fee: fee,
        memo: memo,
        signatures: [signature],
    };
    const {logs, transactionHash}: PostTxResult = await client.postTx(signedTx);

    const query: SearchTxQuery = {id: transactionHash}
    const tx: readonly IndexedTx[] = await client.searchTx(query)
    console.log('Transaction: ', tx);
}

main().then(console.log).catch(console.log);
