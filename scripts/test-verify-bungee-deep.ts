
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
    chain: mainnet,
    transport: http('https://ethereum.publicnode.com'),
});

const CONTRACT = '0xbd4abb321138e8eddc399ce64e66451294325a14';
const TOPIC0 = '0x97efc519b9020a140ffe13878e03d340b976676090bc7fe3e33191192df7c72c';
const USER = '0xd6335f7604f1e97fc47027feb0d9d718ce3ce9fa';

async function main() {
    console.log('--- DEEP VERIFY BUNGEE ---');
    try {
        const currentBlock = await client.getBlockNumber();
        const fromBlock = currentBlock - 200n; // ~40 mins
        console.log(`Scanning from block ${fromBlock} to ${currentBlock}`);

        const logs = await client.getLogs({
            address: CONTRACT,
            topics: [TOPIC0],
            fromBlock: fromBlock,
            toBlock: 'latest'
        });

        console.log(`Found ${logs.length} logs.`);

        // Check for user match
        let found = false;
        // Optimization: Deduplicate tx hashes first
        const txs = [...new Set(logs.map(l => l.transactionHash))];
        console.log(`${txs.length} unique transactions.`);

        // Check the most recent 10 txs
        const recentTxs = txs.reverse().slice(0, 10);

        for (const hash of recentTxs) {
            const tx = await client.getTransaction({ hash });
            const match = tx.from.toLowerCase() === USER.toLowerCase();
            console.log(`Tx: ${hash} | From: ${tx.from} | Match? ${match}`);
            if (match) found = true;
        }

        if (found) {
            console.log('SUCCESS: User transaction found!');
        } else {
            console.log('FAILURE: User transaction NOT found in recent history.');
        }

    } catch (e) {
        console.error(e);
    }
}

main();
