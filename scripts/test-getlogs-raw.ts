
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http(),
});

const CONTRACT_ADDRESS = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';
const TX_BLOCK = BigInt(39179545);

async function check() {
    console.log(`Checking raw logs around block ${TX_BLOCK}...`);
    try {
        const logs = await client.getLogs({
            address: CONTRACT_ADDRESS,
            fromBlock: TX_BLOCK - BigInt(1),
            toBlock: TX_BLOCK + BigInt(1)
        });

        console.log(`Found ${logs.length} raw logs.`);
        logs.forEach((l, i) => {
            console.log(`Log ${i}: Topic0 ${l.topics[0]}`);
            if (l.topics[0] === '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3') {
                console.log('MATCHING SIGNATURE FOUND!');
                console.log('Log:', l);
            }
        });

    } catch (e) {
        console.error('Error:', e);
    }
}

check();
