
import { createPublicClient, http, toEventSelector, getAddress, pad, toHex } from 'viem';
import { base } from 'viem/chains';

const QUEST_DATA = {
    chainId: 8453,
    contractAddress: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64',
    eventSignatureHash: '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3',
};

// USER ADDRESS from debug.json (Verified Correct)
const USER_ADDRESS = '0xd6335f7604f1e97fc47027feb0d9d718ce3ce9fa';

const client = createPublicClient({
    chain: base,
    transport: http('https://base.llamarpc.com')
});

async function run() {
    console.log('--- Debugging Fallback Logic (Clean Bisect) ---');

    const cSumContract = getAddress(QUEST_DATA.contractAddress);
    const checksumAddress = getAddress(USER_ADDRESS);
    const paddedAddress = pad(checksumAddress, { size: 32 });
    const selector = QUEST_DATA.eventSignatureHash;

    console.log(`Contract: ${cSumContract}`);
    console.log(`User: ${checksumAddress}`);
    console.log(`Selector: ${selector}`);

    // Topics: [Selector, null, null, PaddedAddress]
    // ArgIndex 9 (depositor) is the 3rd indexed arg (after inputToken(0), outputToken(1)). 
    // Wait. V3FundsDeposited:
    // 0: inputToken (indexed)
    // 1: outputToken (indexed)
    // ...
    // 9: depositor (indexed)
    // So topic index is 3. (0=sig, 1=inputToken, 2=outputToken, 3=depositor).
    // Array: [Sig, null, null, Padded]

    const topics: any[] = [selector, null, null, paddedAddress];
    console.log('Topics:', JSON.stringify(topics));

    // TEST 1: Address Only
    console.log('\n--- TEST 1: Address Only (Latest Block) ---');
    try {
        const logs1 = await client.getLogs({
            address: cSumContract,
            fromBlock: 'latest',
            toBlock: 'latest'
        });
        console.log(`✅ TEST 1 PASSED. Found ${logs1.length} logs.`);
    } catch (e: any) {
        console.error(`❌ TEST 1 FAILED:`, e.details || e.message);
    }

    // TEST 2: Topics Only
    console.log('\n--- TEST 2: Topics Only (Block 39179000) ---');
    try {
        // Use BigInt since viem prefers it, casting if needed to avoid TS noise
        const logs2 = await client.getLogs({
            topics: topics as any,
            fromBlock: BigInt(39179000),
            toBlock: 'latest'
        });
        console.log(`✅ TEST 2 PASSED. Found ${logs2.length} logs.`);
    } catch (e: any) {
        console.error(`❌ TEST 2 FAILED:`, e.details || e.message);
    }

    // TEST 3: Full
    console.log('\n--- TEST 3: Full (Address + Topics + Block) ---');
    try {
        const rawLogs = await client.getLogs({
            address: cSumContract,
            topics: topics as any,
            fromBlock: BigInt(39179000),
            toBlock: 'latest'
        });
        console.log(`✅ TEST 3 PASSED. Found ${rawLogs.length} logs.`);
    } catch (e: any) {
        console.error(`❌ TEST 3 FAILED:`, e.details || e.message);
    }
}

run();
