
import { createPublicClient, http, defineChain } from 'viem';
import fs from 'fs';

const inkchain = defineChain({
    id: 57073,
    name: 'Inkchain',
    network: 'inkchain',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://rpc-gel.inkonchain.com'] },
        public: { http: ['https://rpc-gel.inkonchain.com'] },
    },
});

const client = createPublicClient({
    chain: inkchain,
    transport: http(),
});

async function main() {
    const txHash = '0x79cf99176579170184556f8410e862441f2c35340d89806b6e6aab1916795525';
    let output = '';
    const logOut = (msg: string) => {
        console.log(msg);
        output += msg + '\n';
    };

    logOut(`Analyzing Tx: ${txHash}`);

    try {
        const tx = await client.getTransaction({ hash: txHash });
        logOut('Transaction To: ' + tx.to);

        const receipt = await client.getTransactionReceipt({ hash: txHash });
        logOut('Status: ' + receipt.status);
        logOut('Logs Count: ' + receipt.logs.length);

        for (const log of receipt.logs) {
            logOut(`Log from: ${log.address}`);
            // Swap event signature hash: 0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822
            if (log.topics[0] === '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822') {
                logOut('  -> SWAP EVENT DETECTED!');
            }
        }

        fs.writeFileSync('src/scripts/debug-output.txt', output);
        console.log('Output saved to src/scripts/debug-output.txt');
    } catch (e) {
        console.error(e);
    }
}

main();
