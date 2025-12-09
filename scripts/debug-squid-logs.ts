
import { createPublicClient, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';

const inkChain = {
    id: 57073,
    name: 'Ink',
    network: 'ink',
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: { default: { http: ['https://rpc-gel.inkonchain.com'] } },
} as const;

const client = createPublicClient({
    chain: inkChain,
    transport: http(),
});

async function main() {
    const address = '0x9eBf93fdBA9F32aCCAb3D6716322dcCd617a78F3'; // SquidMarket
    console.log(`Fetching logs for ${address}...`);

    try {
        const currentBlock = await client.getBlockNumber();
        const logs = await client.getLogs({
            address: address,
            fromBlock: currentBlock - 2000n, // Last 2000 blocks
            toBlock: 'latest'
        });

        console.log(`Found ${logs.length} logs.`);

        if (logs.length > 0) {
            console.log('Sample Log Topics:', logs[0].topics);
            console.log('Sample Log Data:', logs[0].data);

            // Try to deduce signature
            const topic0 = logs[0].topics[0];
            console.log('Event Signature Hash:', topic0);
        } else {
            console.log('No logs found in recent blocks. Contract might be inactive or address wrong.');
        }

    } catch (e) {
        console.error('Error fetching logs:', e);
    }
}

main();
