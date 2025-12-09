
import { createPublicClient, http, decodeEventLog } from 'viem';
import { QUESTS } from '../data/quests';

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
    // TX provided by user: Deposit into Tydro via Mavrk
    const txHash = '0x8db7c677c06b18e71dec0ccc6271b195bc318ccd07a825db488d914cdd841884';
    console.log(`Fetching logs for tx ${txHash}...`);

    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });

        console.log(`Status: ${receipt.status}`);
        console.log(`To (Interacted Contract): ${receipt.to}`);
        console.log(`From (User): ${receipt.from}`);

        // Tydro Quest Config
        const quest = QUESTS['12'];
        const verification = quest.steps[0].verification;

        if (!verification || verification.type !== 'onchain') {
            console.log('Quest 12 has no onchain verification config!');
            return;
        }

        const targetContract = verification.contractAddress;
        console.log(`Target Tydro Contract: ${targetContract}`);

        console.log(`Total Logs: ${receipt.logs.length}`);

        // Check logs
        for (const log of receipt.logs) {
            if (log.address.toLowerCase() === targetContract?.toLowerCase()) {
                console.log('MATCHING TYDRO CONTRACT FOUND in logs!');
                // Try decode
                try {
                    const decoded = decodeEventLog({
                        abi: [verification.eventAbi],
                        data: log.data,
                        topics: log.topics,
                    });
                    console.log('Decoded Event:', decoded.eventName);
                    console.log('Args:', decoded.args);

                    // Check if user matches
                    // @ts-ignore
                    const onBehalfOf = decoded.args.onBehalfOf;
                    // @ts-ignore
                    const user = decoded.args.user;
                    console.log(`Event onBehalfOf: ${onBehalfOf}`);
                    console.log(`Event user: ${user}`);
                    console.log(`Tx From (User): ${receipt.from}`);

                    if (onBehalfOf && onBehalfOf.toLowerCase() === receipt.from.toLowerCase()) {
                        console.log("SUCCESS: User IS the onBehalfOf address.");
                    } else if (user && user.toLowerCase() === receipt.from.toLowerCase()) {
                        console.log("SUCCESS: User IS the user address.");
                    } else {
                        console.log("FAIL: User address does NOT match event arguments.");
                    }

                } catch (e) {
                    console.log('Log found but failed to decode with ABI');
                }
            }
        }
    } catch (e) {
        console.error('Error fetching/processing tx:', e);
    }
}

main();
