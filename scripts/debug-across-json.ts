
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import * as fs from 'fs';

const client = createPublicClient({
    chain: base,
    transport: http(),
});

const TX_HASH = '0x73d1018d0e1d7053e62d20900933c10ea0753e68f77ca05e011fc5f895ddd802';

async function debug() {
    try {
        const receipt = await client.getTransactionReceipt({ hash: TX_HASH });
        const currentBlock = await client.getBlockNumber();

        const output = {
            blockNumber: receipt.blockNumber.toString(),
            currentBlock: currentBlock.toString(),
            diff: (currentBlock - receipt.blockNumber).toString(),
            logs: receipt.logs.map(l => ({
                address: l.address,
                topics: l.topics,
                data: l.data
            }))
        };

        fs.writeFileSync('debug.json', JSON.stringify(output, null, 2));
        console.log('Done writing debug.json');

    } catch (e) {
        console.error('Error fetching tx:', e);
    }
}

debug();
