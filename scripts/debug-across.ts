
import { createPublicClient, http, defineChain } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http('https://base.publicnode.com'),
});

const ACROSS_ADDRESS = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';
const EVENT_ABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'inputToken', type: 'address' },
        { indexed: true, internalType: 'address', name: 'outputToken', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'destinationChainId', type: 'uint256' },
        { indexed: false, internalType: 'uint32', name: 'depositId', type: 'uint32' },
        { indexed: false, internalType: 'uint32', name: 'quoteTimestamp', type: 'uint32' },
        { indexed: false, internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
        { indexed: false, internalType: 'uint32', name: 'exclusivityDeadline', type: 'uint32' },
        { indexed: true, internalType: 'address', name: 'depositor', type: 'address' },
        { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: false, internalType: 'address', name: 'exclusiveRelayer', type: 'address' },
        { indexed: false, internalType: 'bytes', name: 'message', type: 'bytes' }
    ],
    name: 'V3FundsDeposited',
    type: 'event'
};

async function main() {
    console.log('Fetching recent Across V3FundsDeposited events on Base...');
    try {
        const currentBlock = await client.getBlockNumber();
        const logs = await client.getLogs({
            address: ACROSS_ADDRESS,
            event: EVENT_ABI,
            fromBlock: currentBlock - 500n, // Last 500 blocks
            toBlock: 'latest'
        });

        console.log(`Found ${logs.length} logs.`);

        if (logs.length > 0) {
            const sample = logs[0];
            console.log('Sample Log Args:', sample.args);
            console.log('Sample Log Topics:', sample.topics);

            // Check if we can filter by depositor
            const depositor = sample.args.depositor;
            if (depositor) {
                console.log(`Testing filter by depositor: ${depositor}`);
                const filteredLogs = await client.getLogs({
                    address: ACROSS_ADDRESS,
                    event: EVENT_ABI,
                    args: {
                        depositor: depositor
                    },
                    fromBlock: currentBlock - 1000n,
                    toBlock: 'latest'
                });
                console.log(`Filtered search found ${filteredLogs.length} logs for ${depositor}`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

main();
