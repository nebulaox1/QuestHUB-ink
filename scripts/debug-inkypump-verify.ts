
import { createPublicClient, http } from 'viem';
import { ink } from 'viem/chains';
import * as fs from 'fs';

const client = createPublicClient({
    chain: ink,
    transport: http('https://rpc-gel.inkonchain.com')
});

async function analyzeTx() {
    const txHash = '0xf59e1d1f388077a6c9940dde17d1e01d0f71c9ea4869df710b36e0f3fcf27701';
    let output = `Analyzing Tx: ${txHash}\n`;

    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        output += `Status: ${receipt.status}\n`;
        output += `To: ${receipt.to}\n`;
        output += `Logs: ${receipt.logs.length}\n`;

        for (const log of receipt.logs) {
            output += '------------------------------------------------\n';
            output += `Address: ${log.address}\n`;
            output += `Topics: ${JSON.stringify(log.topics)}\n`;
            output += `Data: ${log.data}\n`;
        }

        fs.writeFileSync('src/scripts/inkypump-logs.txt', output);
        console.log("Logs written to file.");

    } catch (error) {
        console.error("Error fetching tx:", error);
    }
}

analyzeTx();
