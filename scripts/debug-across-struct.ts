
import { createPublicClient, http, defineChain, parseAbiItem, decodeEventLog } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http('https://base.publicnode.com'),
});

const ACROSS_ADDRESS = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';

// The corrected ABI we are using now (NO message)
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
        { indexed: false, internalType: 'address', name: 'exclusiveRelayer', type: 'address' }
    ],
    name: 'V3FundsDeposited',
    type: 'event'
};

async function main() {
    console.log('Fetching recent Across V3FundsDeposited events...');
    try {
        const currentBlock = await client.getBlockNumber();
        const logs = await client.getLogs({
            address: ACROSS_ADDRESS,
            event: EVENT_ABI,
            fromBlock: currentBlock - 500n,
            toBlock: 'latest'
        });

        console.log(`Found ${logs.length} logs using CORRECT ABI and signature.`);

        if (logs.length > 0) {
            // Analyze the first log
            const log = logs[0];
            const tx = await client.getTransaction({ hash: log.transactionHash });

            console.log('\n--- Sample Log Analysis ---');
            console.log('Tx Hash:', log.transactionHash);
            console.log('Tx From:', tx.from);
            console.log('Event Args:', log.args);
            console.log('Depositor Arg:', log.args.depositor);

            console.log('\n--- indexed Check ---');
            console.log('Depositor Match Tx From?', log.args.depositor?.toLowerCase() === tx.from.toLowerCase());

            // Check raw topics to verify index position
            console.log('Raw Topics:', log.topics);
            // Expected: [Sig, InputToken, OutputToken, Depositor]
            // Verify Topic 3 matches Depositor
            // Topic 3 is the 4th element (index 3)
            const topic3 = log.topics[3];
            const paddedDepositor = '0x' + log.args.depositor?.substring(2).padStart(64, '0').toLowerCase();

            console.log('Topic 3:', topic3);
            console.log('Padded Depositor:', paddedDepositor);
            console.log('Topic 3 Matches Depositor?', topic3?.toLowerCase() === paddedDepositor);

        } else {
            console.log('No logs found with this ABI. Is signature correct?');
        }

    } catch (e) {
        console.error(e);
    }
}

main();
