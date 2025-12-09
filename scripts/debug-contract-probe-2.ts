
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
// Guessing common storage patterns
const ABI = parseAbi([
    'function users(address) view returns (uint256, uint256)',
    'function lastCheckInTime(address) view returns (uint256)',
    'function checkInHistory(address) view returns (uint256)',
    'function nextCheckIn(address) view returns (uint256)'
]);

async function checkFunctions() {
    const user = '0x52b821477755c064993cc61ec908c6913c122264'; // User from screenshot

    console.log("Probing contract state...");

    try {
        const res = await client.readContract({ address: ADDRESS, abi: ABI, functionName: 'users', args: [user] });
        console.log(`users(address):`, res);
    } catch (e) { console.log("users(address) failed"); }

    try {
        const res = await client.readContract({ address: ADDRESS, abi: ABI, functionName: 'lastCheckInTime', args: [user] });
        console.log(`lastCheckInTime: ${res}`);
    } catch (e) { console.log("lastCheckInTime failed"); }

    try {
        const res = await client.readContract({ address: ADDRESS, abi: ABI, functionName: 'nextCheckIn', args: [user] });
        console.log(`nextCheckIn: ${res}`);
    } catch (e) { console.log("nextCheckIn failed"); }
}

checkFunctions();
