
import { createPublicClient, http, getAddress, pad } from 'viem';
import { base } from 'viem/chains';

const QUEST_DATA = {
    chainId: 8453,
    contractAddress: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64',
    eventSignatureHash: '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3',
};
const USER_ADDRESS = '0xd6335f7604f1e97fc47027feb0d9d718ce3ce9fa';

const client = createPublicClient({
    chain: base,
    transport: http('https://base.llamarpc.com')
});

async function run() {
    console.log('--- Testing Address ONLY (1000 blocks limit) ---');

    const targetAddress = getAddress(QUEST_DATA.contractAddress);
    const checksumAddress = getAddress(USER_ADDRESS);
    const paddedAddress = pad(checksumAddress, { size: 32 }).toLowerCase();
    const selector = QUEST_DATA.eventSignatureHash.toLowerCase();

    try {
        const currentBlock = await client.getBlockNumber();
        const fromBlock = currentBlock - BigInt(1000);

        console.log(`Scanning from ${fromBlock} to latest...`);

        const logs = await client.getLogs({
            address: targetAddress,
            fromBlock: fromBlock,
            toBlock: 'latest'
        });

        console.log(`✅ RPC Call Success. Found ${logs.length} logs for contract.`);

        let matches = 0;
        logs.forEach((log: any) => {
            const t0 = (log.topics[0] || '').toLowerCase();
            const t3 = (log.topics[3] || '').toLowerCase();

            if (t0 === selector && t3 === paddedAddress) {
                matches++;
                console.log(`🎉 MATCH FOUND! Tx: ${log.transactionHash}`);
            }
        });

        console.log(`Total user matches: ${matches}`);

    } catch (e: any) {
        console.error(`❌ RPC Failed:`, e.details || e.message);
    }
}

run();
