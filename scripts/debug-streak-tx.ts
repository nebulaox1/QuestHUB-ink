
import { createPublicClient, http } from 'viem';

const inkChain = {
    id: 57073,
    name: 'Ink',
    network: 'ink',
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: {
        default: { http: ['https://rpc-gel.inkonchain.com'] },
        public: { http: ['https://rpc-gel.inkonchain.com'] },
    },
} as const;

const client = createPublicClient({
    chain: inkChain,
    transport: http()
});

async function checkTx() {
    const txHash = '0xad6de88089653e8007fc3e175f327a62a1a63b3dfcbea778cde54f6ddeaf240d';
    console.log(`Checking Streak Tx: ${txHash}`);

    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        console.log(`Status: ${receipt.status}`);
        console.log(`Block Number: ${receipt.blockNumber}`);
        console.log(`From: ${receipt.from}`);
        console.log(`Gas Used: ${receipt.gasUsed}`);
    } catch (error) {
        console.error("Error fetching receipt:", error);
    }
}

checkTx();
