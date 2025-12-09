
import { createPublicClient, http, getAddress, pad, toHex } from 'viem';
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
    console.log('--- Testing Topics ONLY (Client-side Address Filter) ---');

    const targetAddress = getAddress(QUEST_DATA.contractAddress);
    const checksumAddress = getAddress(USER_ADDRESS);
    const paddedAddress = pad(checksumAddress, { size: 32 });
    const selector = QUEST_DATA.eventSignatureHash;

    const topics: any[] = [selector, null, null, paddedAddress];

    // Test without 'address' parameter in getLogs
    try {
        const logs = await client.getLogs({
            topics: topics as any,
            fromBlock: 'latest',
            toBlock: 'latest'
        });
        console.log(`✅ RPC Call Success. Found ${logs.length} logs globally.`);

        // Filter client side
        const filtered = logs.filter((l: any) => getAddress(l.address) === targetAddress);
        console.log(`🔍 Filtered by Address ${targetAddress}: Found ${filtered.length} logs.`);

        if (filtered.length > 0) {
            console.log('🎉 VERIFICATION SUCCESS using Workaround!');
        } else {
            console.log('⚠️ No logs for this specific contract found (but RPC worked).');
        }

    } catch (e: any) {
        console.error(`❌ RPC Failed:`, e.details || e.message);
    }
}

run();
