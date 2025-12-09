
import { createPublicClient, http, getAddress, pad, toHex } from 'viem';
import { base } from 'viem/chains';

// Original lowercase
const ADDR_LOWER = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';
const USER = '0x6335f7604f1e97fc47027feb0d9d718ce3ce9fa';
const SIG = '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3';

const client = createPublicClient({
    chain: base,
    transport: http('https://base.llamarpc.com')
});

async function test() {
    console.log('Testing with checksum address...');
    const checksumAddr = getAddress(ADDR_LOWER);
    console.log('Checksum:', checksumAddr);

    const paddedUser = pad(getAddress(USER), { size: 32 });
    console.log('Padded User:', paddedUser);

    const topics = [SIG, null, null, paddedUser];
    console.log('Topics:', topics);

    try {
        const logs = await client.getLogs({
            address: checksumAddr,
            fromBlock: BigInt(39179000),
            toBlock: 'latest',
            topics: topics as any
        });
        console.log(`Success! Found ${logs.length} logs.`);
    } catch (e: any) {
        console.error('CHECKSUM FAILED:', e.details || e.message);

        // Try without address filter?
        console.log('Testing WITHOUT address filter (just topic)...');
        try {
            const logs2 = await client.getLogs({
                fromBlock: BigInt(39179000),
                toBlock: 'latest',
                topics: topics as any
            });
            console.log(`Success (No Addr)! Found ${logs2.length} logs.`);
        } catch (e2: any) {
            console.error('NO ADDR FAILED:', e2.details || e2.message);
        }
    }
}

test();
