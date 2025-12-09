
import { createPublicClient, http } from 'viem';
import * as fs from 'fs';

const inkChain = {
    id: 57073,
    name: 'Ink',
    network: 'ink',
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: { default: { http: ['https://rpc-gel.inkonchain.com'] }, public: { http: ['https://rpc-gel.inkonchain.com'] } },
} as const;

const client = createPublicClient({ chain: inkChain, transport: http() });

async function main() {
    const txHash = '0xaf8cf5534353b6262b9207b7a26c8a17f32863fd8286af8af749cc5262b47ea0';
    console.log(`Fetching receipt for: ${txHash}`);

    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        console.log(`Status: ${receipt.status}`);

        let output = '';
        output += `Status: ${receipt.status}\n`;
        output += `To: ${receipt.to}\n`;
        output += `Logs found: ${receipt.logs.length}\n`;

        receipt.logs.forEach((log, i) => {
            output += `--- Log ${i} ---\n`;
            output += `Address: ${log.address}\n`;
            output += `Topics: ${JSON.stringify(log.topics)}\n`;
            output += `Data: ${log.data}\n`;
        });

        fs.writeFileSync('debug_tx_output.txt', output);
        console.log('Written to debug_tx_output.txt');

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
