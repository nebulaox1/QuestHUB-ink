
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http(),
});

// The verified correct address
const CONTRACT_ADDRESS = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';
const USER_ADDRESS = '0xd6335f7604f1e97fc47027feb0d9d718ce3ce9fa';

// The verified correct ABI
const eventAbi = {
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

async function check() {
    try {
        const currentBlock = await client.getBlockNumber();
        const fromBlock = currentBlock - BigInt(10000);

        console.log(`Checking logs from block ${fromBlock} to latest...`);
        console.log(`Address: ${CONTRACT_ADDRESS}`);
        console.log(`User: ${USER_ADDRESS}`);

        // 1. Try WITH filter
        console.log('--- Attempt 1: Filter by depositor ---');
        const logs = await client.getLogs({
            address: CONTRACT_ADDRESS,
            event: eventAbi,
            args: {
                depositor: USER_ADDRESS
            },
            fromBlock: fromBlock
        });
        console.log(`Found ${logs.length} logs with filter.`);

        if (logs.length === 0) {
            // 2. Try WITHOUT filter (but limit block range tightly to expected block to avoid massive response)
            // Expected block is roughly 39179545 
            // We can check small range around it.
            console.log('--- Attempt 2: No filter, specific block range ---');
            const targetBlock = BigInt(39179545);
            const logsAll = await client.getLogs({
                address: CONTRACT_ADDRESS,
                event: eventAbi,
                fromBlock: targetBlock - BigInt(10),
                toBlock: targetBlock + BigInt(10)
            });
            console.log(`Found ${logsAll.length} logs in tight range around tx block.`);
            if (logsAll.length > 0) {
                const match = logsAll.find(l => l.args.depositor.toLowerCase() === USER_ADDRESS.toLowerCase());
                console.log(`Did manual find match? ${!!match}`);
                if (match) console.log('Match args:', match.args);
            }
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

check();
