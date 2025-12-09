
import { createPublicClient, http, defineChain } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.merkle.io'),
});

async function main() {
    const txHash = '0x5b3a8e67626b6a23dc5c92488a48c48fff534bb6992ca91a208cef921e2dcbcf';

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
