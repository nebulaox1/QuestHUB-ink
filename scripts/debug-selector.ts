
import { toEventSelector } from 'viem';

const signatures = [
    // Base Case
    'event V3FundsDeposited(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, uint32 depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, address depositor, address recipient, address exclusiveRelayer, bytes message)',
    // Try uint256 for all
    'event V3FundsDeposited(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, uint256 depositId, uint256 quoteTimestamp, uint256 fillDeadline, uint256 exclusivityDeadline, address depositor, address recipient, address exclusiveRelayer, bytes message)',
    // Try int types? No.
    // Try destinationChainId as uint64
    'event V3FundsDeposited(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint64 destinationChainId, uint32 depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, address depositor, address recipient, address exclusiveRelayer, bytes message)',
    // Try no bytes message (older version?)
];

const TARGET = '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3';

signatures.forEach(sig => {
    const selector = toEventSelector(sig);
    console.log(`Sig: ${sig}\nHash: ${selector} ${selector === TARGET ? 'MATCH ✅' : '❌'}\n`);
});
