import {Account, CosmWasmClient} from 'secretjs';
import * as dotenv from 'dotenv';
import {BlockResponse, NodeInfo} from 'secretjs/types/restclient';

dotenv.config();

async function main(): Promise<void> {
    // Create connection to DataHub Secret Network node
    const client: CosmWasmClient = new CosmWasmClient(process.env.SECRET_REST_URL);
    // @ts-ignore
    const blocksLatest: BlockResponse = await client.restClient.blocksLatest();
    console.log('blocksLatest: ', blocksLatest);

    const account: Account = await client.getAccount(process.env.ADDRESS)
    console.log('Account: ', account);

    // @ts-ignore
    const nodeInfo: NodeInfo = await client.restClient.nodeInfo();
    console.log('nodeInfo: ', nodeInfo);
}

main().then(console.log).catch(console.log);
