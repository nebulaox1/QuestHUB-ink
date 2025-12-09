
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
    const txHash = '0x986affa1ff409c609f419d91f7537199146e353d27ebae84fdf9d2819eaff1c5';
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
        }

        fs.writeFileSync('src/scripts/debug-thedeep.txt', output);
        console.log('Output saved to src/scripts/debug-thedeep.txt');
    } catch (e) {
        console.error(e);
    }
}

main();
