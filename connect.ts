// Load environment variables
import * as dotenv from 'dotenv';
// Load SecretJS components
import {CosmWasmClient} from 'secretjs';

dotenv.config();

async function main(): Promise<void> {
    // Create connection to DataHub Secret Network node
    const client: CosmWasmClient = new CosmWasmClient(process.env.SECRET_REST_URL);

    // Query chain ID
    const chainId: string = await client.getChainId();

    // Query chain height
    const height: number = await client.getHeight();

    console.log('ChainId:', chainId);
    console.log('Block height:', height);
}

main().then(console.log).catch(console.log);
