import {
    encodeSecp256k1Pubkey,
    EnigmaUtils,
    FeeTable,
    IndexedTx,
    PostTxResult,
    pubkeyToAddress,
    SearchTxQuery,
    Secp256k1Pen,
    SigningCosmWasmClient
} from 'secretjs';

import * as dotenv from 'dotenv';
import {PubKey} from 'secretjs/types/types';

dotenv.config();

async function main(): Promise<any> {

    const mnemonic: string = process.env.MNEMONIC;
    const httpUrl: string = process.env.SECRET_REST_URL;
    const signingPen: Secp256k1Pen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey: PubKey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress: string = pubkeyToAddress(pubkey, 'secret');


    const txEncryptionSeed: Uint8Array = EnigmaUtils.GenerateNewSeed();
    const fees: Partial<FeeTable> = {
        send: {
            amount: [{amount: '80000', denom: 'uscrt'}],
            gas: '80000',
        },
    }

    const client: SigningCosmWasmClient = new SigningCosmWasmClient(
        httpUrl,
        accAddress,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, fees
    );

    const rcpt: string = accAddress; // Set recipient to sender for testing, or generate another account as you did previously.

    // Send 1 SCRT / 1000000 uscrt
    const sent: PostTxResult =
        await client.sendTokens(rcpt, [{amount: '1000000', denom: 'uscrt'}]);


    const query: SearchTxQuery = {id: sent.transactionHash};
    const tx: readonly IndexedTx[] = await client.searchTx(query);
    console.log('Transaction: ', tx);
}

main().then(console.log).catch(console.log);
