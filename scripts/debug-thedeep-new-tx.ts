
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
    const txHash = '0x421163b37b35a66d975f1312bf26623202e3cbd3fe6043f1d6d7b25276001aa6';
    let output = '';
    const logOut = (msg: string) => {
        console.log(msg);
        output += msg + '\n';
    };

    logOut(`Analyzing Tx: ${txHash}`);

    try {
        const tx = await client.getTransaction({ hash: txHash });
        logOut('Transaction To: ' + tx.to);
        logOut('Transaction From: ' + tx.from);

        const receipt = await client.getTransactionReceipt({ hash: txHash });
        logOut('Status: ' + receipt.status);
        logOut('Logs Count: ' + receipt.logs.length);

        for (const log of receipt.logs) {
            logOut(`Log from: ${log.address}`);
            log.topics.forEach((topic, index) => {
                logOut(`  Topic${index}: ${topic}`);
            });
            // logOut(`  Data: ${log.data}`); // Simplify output
        }

        fs.writeFileSync('src/scripts/debug-thedeep-new.txt', output);
        console.log('Output saved to src/scripts/debug-thedeep-new.txt');
    } catch (e) {
        console.error(e);
    }
}

main();
