
import { toEventSelector, parseAbiItem } from 'viem';

const abiString = 'event V3FundsDeposited(address indexed inputToken, address indexed outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, uint32 depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, address indexed depositor, address recipient, address exclusiveRelayer)';
const abiItem = parseAbiItem(abiString);
const hash = toEventSelector(abiItem);

console.log('Calculated Hash: ' + hash);
console.log('Quests.ts Hash:  0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3');
