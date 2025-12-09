
import { toEventSelector } from 'viem';

// The exact ABI currently in quests.ts
const abi = [
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
    { indexed: false, internalType: 'address', name: 'exclusiveRelayer', type: 'address' },
    { indexed: false, internalType: 'bytes', name: 'message', type: 'bytes' }
];

const name = 'V3FundsDeposited';
const sig = `${name}(${abi.map(i => i.type).join(',')})`;

console.log('Signature:', sig);
console.log('Selector:', toEventSelector(sig));

const TARGET = '0xa123dc29aebf7d0c3322c8eeb5b999e859f39937950ed31056532713d0de396f';
console.log('Target:', TARGET);

if (toEventSelector(sig) === TARGET) {
    console.log('MATCH! The current ABI generates 0xa123...');
} else {
    console.log('NO MATCH. The current ABI generates', toEventSelector(sig));
}
