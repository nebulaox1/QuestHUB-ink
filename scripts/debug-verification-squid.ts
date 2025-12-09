
import { verifyQuestOnChain } from '@/lib/verify';
import { createPublicClient, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

async function main() {
    // Generate a random address that definitely hasn't traded
    const account = privateKeyToAccount(generatePrivateKey());
    const randomAddress = account.address;
    console.log(`Testing verification for random address: ${randomAddress}`);

    try {
        const result = await verifyQuestOnChain('17', randomAddress);
        console.log('Result for random address:', result);

        if (result.success) {
            console.error('CRITICAL: Verification succeeded for a random address! Logic is broken.');
        } else {
            console.log('Verification correctly failed for random address.');
        }
    } catch (e) {
        console.log('Verification threw error (expected for failure):', e);
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
