
import { toEventSelector } from 'viem';

const TARGET = '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3';

const uintOptions = ['uint256', 'uint32'];
const chainIdOptions = ['uint256', 'uint64', 'uint32'];
const messageOptions = [true, false]; // has message bytes at end

// Fields: 
// 1. inputAmount (always u256?) - assume yes
// 2. outputAmount (always u256?) - assume yes
// 3. destinationChainId (var)
// 4. depositId (var)
// 5. quoteTimestamp (var)
// 6. fillDeadline (var)
// 7. exclusivityDeadline (var)

// Fixed: address, address, u256, u256
// Vars: 3, 4, 5, 6, 7
// Fixed: address, address, address
// Var: bytes

function check() {
    for (const chainId of chainIdOptions) {
        for (const depositId of uintOptions) {
            for (const quoteTs of uintOptions) {
                for (const fillDl of uintOptions) {
                    for (const exclDl of uintOptions) {
                        for (const hasMsg of messageOptions) {

                            const types = [
                                'address', 'address', // tokens
                                'uint256', 'uint256', // amounts
                                chainId,
                                depositId,
                                quoteTs,
                                fillDl,
                                exclDl,
                                'address', 'address', 'address' // depositor, recipient, relayer
                            ];

                            if (hasMsg) types.push('bytes');

                            const sig = `V3FundsDeposited(${types.join(',')})`;
                            const hash = toEventSelector(sig);

                            if (hash === TARGET) {
                                console.log('MATCH FOUND! ✅');
                                console.log(sig);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    console.log('No match found in permutations.');
}

check();
