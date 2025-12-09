
import { createPublicClient, http, parseAbi } from 'viem';

const inkChain = {
    id: 57073,
    name: 'Ink',
    network: 'ink',
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: {
        default: { http: ['https://rpc-gel.inkonchain.com'] },
    },
} as const;

const client = createPublicClient({
    chain: inkChain,
    transport: http()
});

const CONTRACT_ADDRESS = '0x8bc5453DDd0D8978F3bDc52A130eb6A3349FD9ec';
const ABI = parseAbi([
    'function getStreak(address) view returns (uint256)'
]);

async function checkStreak() {
    const txHash = '0xad6de88089653e8007fc3e175f327a62a1a63b3dfcbea778cde54f6ddeaf240d';
    console.log(`Analyzing Tx: ${txHash}`);

    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        console.log(`User Address: ${receipt.from}`);

        const streak = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'getStreak',
            args: [receipt.from]
        });

        console.log(`On-Chain Streak for ${receipt.from}: ${streak}`);
    } catch (error) {
        console.error("Error:", error);
    }
}

checkStreak();
