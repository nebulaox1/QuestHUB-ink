
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import fs from 'fs';

const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.merkle.io'),
});

async function main() {
    const txHash = '0x5b3a8e67626b6a23dc5c92488a48c48fff534bb6992ca91a208cef921e2dcbcf';
    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        if (receipt.logs.length > 0) {
            const log = receipt.logs[0];
            const data = `ADDRESS:${log.address}\nTOPIC0:${log.topics[0]}`;
            fs.writeFileSync('src/scripts/debug-bungee.txt', data);
            console.log('Saved to debug-bungee.txt');
        }
    } catch (e) {
        console.error(e);
    }
}

main();
