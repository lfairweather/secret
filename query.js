const {
    CosmWasmClient
} = require("secretjs");

require('dotenv').config();

const main = async () => {
    // Create connection to DataHub Secret Network node
    const client = new CosmWasmClient(process.env.SECRET_REST_URL)

    const nodeInfo = await client.restClient.nodeInfo();
    console.log('nodeInfo: ', nodeInfo);

    const blocksLatest = await client.restClient.blocksLatest();
    console.log('blocksLatest: ', blocksLatest);

    const account = await client.getAccount(process.env.ADDRESS)
    console.log('Account: ', account);
}

main().then(resp => {
    console.log(resp);
}).catch(err => {
    console.log(err);
})
