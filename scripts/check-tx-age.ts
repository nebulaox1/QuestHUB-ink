
import { createPublicClient, http, defineChain } from 'viem';

const inkchain = defineChain({
    id: 57073,
    name: 'Inkchain',
    network: 'inkchain',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://rpc-gel.inkonchain.com'] },
        public: { http: ['https://rpc-gel.inkonchain.com'] },
    },
});

const client = createPublicClient({
    chain: inkchain,
    transport: http(),
});

async function main() {
    const txHash = '0x421163b37b35a66d975f1312bf26623202e3cbd3fe6043f1d6d7b25276001aa6';

    try {
        const currentBlock = await client.getBlockNumber();
        const tx = await client.getTransaction({ hash: txHash });

        console.log(`Current Block: ${currentBlock}`);
        console.log(`Tx Block: ${tx.blockNumber}`);
        const age = currentBlock - (tx.blockNumber || 0n);
        console.log(`Age in blocks: ${age}`);

    } catch (e) {
        console.error(e);
    }
}

main();
