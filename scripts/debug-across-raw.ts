
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http('https://base.publicnode.com'),
});

const ACROSS_ADDRESS = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';

async function main() {
    try {
        const currentBlock = await client.getBlockNumber();
        const logs = await client.getLogs({
            address: ACROSS_ADDRESS,
            fromBlock: currentBlock - 500n,
            toBlock: 'latest'
        });

        if (logs.length > 0) {
            const counts: Record<string, number> = {};
            logs.forEach(l => { const s = l.topics[0] || ''; counts[s] = (counts[s] || 0) + 1; });
            const sig = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

            console.log('HASH_PART1:' + sig.substring(0, 32));
            console.log('HASH_PART2:' + sig.substring(32));

            const sample = logs.find(l => l.topics[0] === sig);
            if (sample) {
                console.log('topics_len: ' + sample.topics.length);
                sample.topics.forEach((t, i) => console.log(`T${i}: ${t}`));
            }
        } else {
            console.log('No logs.');
        }

    } catch (e) {
        console.error(e);
    }
}

main();
