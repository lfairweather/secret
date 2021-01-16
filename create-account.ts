import {Account, CosmWasmClient, encodeSecp256k1Pubkey, pubkeyToAddress, Secp256k1Pen} from 'secretjs';

import {Bip39, Random} from '@iov/crypto';
import {PubKey} from 'secretjs/types/types';

require('dotenv').config();

const main = async () => {
    const mnemonic: string = Bip39.encode(Random.getBytes(16)).toString();
    const signingPen: Secp256k1Pen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey: PubKey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress: string = pubkeyToAddress(pubkey, 'secret');
    const client: CosmWasmClient = new CosmWasmClient(process.env.SECRET_REST_URL);
    const account: Account = await client.getAccount(accAddress);

    console.log('mnemonic: ', mnemonic);
    console.log('address: ', accAddress);
    console.log('account: ', account);
}

main().then(console.log).catch(console.log);

