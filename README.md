## Figment Learn Secret Network Tutorial 1 - w/TypeScript

Adapted version of the [Secret Tutorial by Figment](https://github.com/figment-networks/tutorials/tree/main/secret) to
use TypeScript types provided by [secret.js](https://www.npmjs.com/package/secretjs), executed using [ts-node](https://github.com/TypeStrong/ts-node).

### Contents

* Connecting to Secret Network node using DataHub
* Creating account using SecretJS
* Query Secret Network
* Submitting transactions
* Using contracts

## 1. Installation

To install all required packages run:

```bash
npm install
```

or manually...

Install TypeScript + ts-node to dev dependencies

```bash
npm install typescript@latest ts-node --save-dev
```

Install TypeScript + ts-node globally if necessary

```bash
npm install -g ts-node typescript@latest
```

## 2. Setup

### Configure the environment

Make sure to copy .env.example file to .env file and update its contents.

.env.example is mainnet config, to test locally copy .env.local.example, and for testnet copy .env.testnet.example

### Create a tsconfig.json file

You need this to **transpile** the TypeScript to JavaScript.

Output to the desired specification with `target`

```json
"target": "es5",
```

## 3. Running tutorials

* `npm run 1` - Connecting to node tutorial
* `npm run 2` - Creating account tutorial
* `npm run 3` - Query node tutorial
* `npm run 4` - Transfer tokens - simple
* `npm run 4:advanced` - Transfer tokens - advanced
* `npm run 5` - Create, deploy and use a Secret Contract

The difference between executing the TypeScript files rather than JavaScript files:

#### TypeScript

```bash
ts-node send.ts
``` 
#### JavaScript

```bash
node send.ts
```
