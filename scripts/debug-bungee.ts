
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.merkle.io'),
});

async function main() {
    const txHash = '0x5b3a8e67626b6a23dc5c92488a48c48fff534bb6992ca91a208cef921e2dcbcf';
    try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        if (receipt.logs.length > 0) {
            const addr = receipt.logs[0].address;
            console.log('ADDR_P1:' + addr.substring(0, 22));
            console.log('ADDR_P2:' + addr.substring(22));
        }
    } catch (e) {
        console.error(e);
    }
}

main();
