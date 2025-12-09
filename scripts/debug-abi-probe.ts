
import { createPublicClient, http, parseAbi } from 'viem';

const inkChain = {
    id: 57073,
    name: 'Ink',
    network: 'ink',
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: {
        default: { http: ['https://rpc-gel.inkonchain.com'] },
    },
} as const;

const client = createPublicClient({
    chain: inkChain,
    transport: http()
});

const ADDRESS = '0x8bc5453DDd0D8978F3bDc52A130eb6A3349FD9ec';
// Guessing common function names
const ABI = parseAbi([
    'function lastCheckIn(address) view returns (uint256)',
    'function getLastCheckIn(address) view returns (uint256)',
    'function userLastCheckIn(address) view returns (uint256)',
    'function hasCheckedIn(address) view returns (bool)'
]);

async function checkFunctions() {
    const user = '0xa8c1c38ff57428e5c3a34e0899be5cb385476507'; // Using user from logs

    console.log("Checking lastCheckIn...");
    try {
        const res = await client.readContract({ address: ADDRESS, abi: ABI, functionName: 'lastCheckIn', args: [user] });
        console.log(`lastCheckIn: ${res}`);
    } catch (e) { console.log("lastCheckIn failed"); }

    console.log("Checking getLastCheckIn...");
    try {
        const res = await client.readContract({ address: ADDRESS, abi: ABI, functionName: 'getLastCheckIn', args: [user] });
        console.log(`getLastCheckIn: ${res}`);
    } catch (e) { console.log("getLastCheckIn failed"); }

}

checkFunctions();
