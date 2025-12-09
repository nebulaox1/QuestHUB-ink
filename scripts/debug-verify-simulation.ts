
import { verifyVerificationConfig } from '../lib/verify';

const CONFIG = {
    type: 'onchain',
    chainId: 8453,
    contractAddress: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64',
    eventName: 'V3FundsDeposited',
    argName: 'depositor',
    eventAbi: {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'inputToken', type: 'address' },
            { indexed: true, internalType: 'address', name: 'outputToken', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'destinationChainId', type: 'uint256' },
            { indexed: false, internalType: 'uint32', name: 'depositId', type: 'uint32' },
            { indexed: false, internalType: 'uint32', name: 'quoteTimestamp', type: 'uint32' },
            { indexed: false, internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
            { indexed: false, internalType: 'uint32', name: 'exclusivityDeadline', type: 'uint32' },
            { indexed: true, internalType: 'address', name: 'depositor', type: 'address' },
            { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
            { indexed: false, internalType: 'address', name: 'exclusiveRelayer', type: 'address' }
        ],
        name: 'V3FundsDeposited',
        type: 'event'
    },
    eventSignatureHash: '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3'
};

async function main() {
    const USER = '0x954a2228d6cea072fd6bf06d351baa000b5040f8';

    console.log(`Simulating Verification for Across...`);
    console.time('Total Verification');

    try {
        const result = await verifyVerificationConfig(CONFIG, USER, 'Debug Simulation');
        console.log('Result:', result);
    } catch (e) {
        console.error('Error:', e);
    }

    console.timeEnd('Total Verification');
}

main();
