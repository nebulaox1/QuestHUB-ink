
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
    const txHash = '0xbbf6d19d3e4ffad452a7ac3d7e45e9e120a71cb035c23bf1d8c60f478c319b96';
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
            log.topics.forEach((topic, index) => {
                logOut(`  Topic${index}: ${topic}`);
            });
            logOut(`  Data: ${log.data}`);
            // We are looking for TokenCreated event
        }

        fs.writeFileSync('src/scripts/debug-output-pump.txt', output);
        console.log('Output saved to src/scripts/debug-output-pump.txt');
    } catch (e) {
        console.error(e);
    }
}

main();
