
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
    const txHash = '0x65979ed218f98630f65b20777c6b7b0d238270da0c87d5f8d973999921201afa';
    let output = '';
    const logOut = (msg: string) => {
        console.log(msg);
        output += msg + '\n';
    };

    logOut(`Analyzing Tx: ${txHash}`);

    try {
        const tx = await client.getTransaction({ hash: txHash });
        logOut('Transaction From: ' + tx.from);
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
        }

        fs.writeFileSync('src/scripts/debug-output-nfts2me.txt', output);
        console.log('Output saved to src/scripts/debug-output-nfts2me.txt');
    } catch (e) {
        console.error(e);
    }
}

main();
