import { createPublicClient, http, formatUnits, toEventSelector, encodeAbiParameters, parseAbiItem, getAddress, pad } from 'viem';
import { mainnet, base } from 'viem/chains';
import { QUESTS } from '@/data/quests';

// Define Inkchain if not in viem/chains yet (Mocking for now or using a standard one)
// Inkchain Mainnet Configuration
const inkChain = {
    id: 57073,
    name: 'Ink',
    network: 'ink',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://rpc-gel.inkonchain.com'] },
        public: { http: ['https://rpc-gel.inkonchain.com'] },
    },
    blockExplorers: {
        default: { name: 'Blockscout', url: 'https://explorer.inkonchain.com' },
    },
} as const;

const getClient = (chainId?: number) => {
    if (chainId === 1) {
        return createPublicClient({
            chain: mainnet,
            transport: http('https://ethereum.publicnode.com'),
        });
    }
    if (chainId === 8453) {
        return createPublicClient({
            chain: base,
            transport: http('https://base.publicnode.com'),
        });
    }
    // Default to Inkchain
    return createPublicClient({
        chain: inkChain,
        transport: http(),
    });
};

export async function verifyVerificationConfig(config: any, userAddress: string, title: string = 'Quest') {
    const { contractAddress, eventAbi, eventName, minAmount, eventSignatureHash, argName } = config;

    if ((!contractAddress && !eventAbi) || (!eventName && !eventSignatureHash)) {
        return { success: false, error: 'Invalid config: Missing event details' };
    }

    // SIMULATION - DISABLED for Production/Strictness
    if (contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`[VERIFY] Quest ${title} has placeholder address. Verification failed.`);
        return { success: false, error: 'Quest contract not yet integrated.' };
    }

    try {
        const client = getClient(config.chainId);
        const currentBlock = await client.getBlockNumber();
        const fromBlock = currentBlock - BigInt(2000); // Optimized: Reduced from 10k to 2k for speed
        const filterArg = argName || 'sender';

        let logs: any[] = [];


        // Case A: Standard event search
        if (!eventSignatureHash) {
            try {
                const getLogsArgs: any = {
                    event: eventAbi,
                    args: {
                        [filterArg]: getAddress(userAddress), // Ensure checksum for strict RPC filter
                    },
                    fromBlock: fromBlock > BigInt(0) ? fromBlock : BigInt(0),
                    toBlock: 'latest'
                };

                // Only add address if provided
                if (contractAddress) {
                    getLogsArgs.address = contractAddress as `0x${string}`;
                }

                logs = await client.getLogs(getLogsArgs);

                logs = logs.filter((log: any) => {
                    const argVal = log.args?.[filterArg];
                    return typeof argVal === 'string' && argVal.toLowerCase() === userAddress.toLowerCase();
                });

            } catch (e) {
                console.warn('Standard logs query failed', e);
            }
        }

        // Case B: Fallback / Raw Topic Search (Efficient)
        // If Standard Search failed or returned 0 logs, try Raw Topic matching
        if (logs.length === 0) {
            const selector = eventSignatureHash || toEventSelector(eventAbi);
            const inputs = eventAbi.inputs || [];
            const argIndex = inputs.findIndex((i: any) => i.name === filterArg);

            if (argIndex >= 0 && inputs[argIndex].indexed) {
                // Calculate topic position
                let topicIndex = 1;
                for (let i = 0; i < argIndex; i++) {
                    if (inputs[i].indexed) topicIndex++;
                }

                const checksumAddress = getAddress(userAddress);
                const paddedAddress = pad(checksumAddress, { size: 32 });

                // Construct topic filter: [selector, null, ..., address, ...]
                const topics: any[] = [selector];
                for (let i = 1; i < topicIndex; i++) topics.push(null);
                topics.push(paddedAddress);

                const getRawLogsArgs: any = {
                    fromBlock: fromBlock > BigInt(0) ? fromBlock : BigInt(0),
                    toBlock: 'latest',
                    topics: topics as any
                };

                if (contractAddress) {
                    getRawLogsArgs.address = contractAddress as `0x${string}`;
                }

                try {
                    const rawLogs = await client.getLogs(getRawLogsArgs as any);
                    // Filter raw logs to ensure exact match (though topics should handle it)
                    const validRawLogs = rawLogs.filter((log: any) => {
                        const topicVal = log.topics[topicIndex];
                        return topicVal && topicVal.toLowerCase() === paddedAddress.toLowerCase();
                    });

                    if (validRawLogs.length > 0) return { success: true, message: 'Verified (Raw Match)' };
                } catch (e) {
                    console.warn('Raw topic logs query failed', e);
                }
            }
        }

        // Case C: Tx Sender Fallback (User initiated the Tx that emitted the Event)
        // If we are here, strict topic matching failed.
        // Let's find ANY event of this type in recent blocks and check if user was the tx.from
        try {
            // Extended limit to 2000 blocks (approx 1 hour) to catch older user transactions
            // Update: For Mainnet (Chain 1), use larger buffer (7200 -> ~24h)
            const isMainnet = config.chainId === 1;
            const rangeBuffer = isMainnet ? BigInt(7200) : BigInt(2000);
            const recentStartBlock = currentBlock - rangeBuffer;
            const selector = eventSignatureHash || toEventSelector(eventAbi);

            const getAnyLogsArgs: any = {
                topics: [selector],
                fromBlock: recentStartBlock > BigInt(0) ? recentStartBlock : BigInt(0),
                toBlock: 'latest'
            };
            if (contractAddress) getAnyLogsArgs.address = contractAddress as `0x${string}`;

            const candidates = await client.getLogs(getAnyLogsArgs);

            // Optimization: Deduplicate Transaction Hashes
            // A single tx might emit multiple Swap events (multi-hop). We only need to check the tx once.
            const uniqueTxHashes = new Set(candidates.map(l => l.transactionHash));

            // Limit to most recent 500 transactions to prevent infinite loading, but cover enough history
            const txHashesToCheck = Array.from(uniqueTxHashes).reverse().slice(0, 500);

            // Batch processing to speed up RPC calls (parallel batches of 20)
            const BATCH_SIZE = 20;
            for (let i = 0; i < txHashesToCheck.length; i += BATCH_SIZE) {
                const batch = txHashesToCheck.slice(i, i + BATCH_SIZE);

                const results = await Promise.all(batch.map(async (hash) => {
                    try {
                        const tx = await client.getTransaction({ hash });
                        return tx.from.toLowerCase() === userAddress.toLowerCase();
                    } catch (e) {
                        return false;
                    }
                }));

                if (results.some(isMatch => isMatch)) {
                    return { success: true, message: 'Verified (Tx Sender)' };
                }
            }
        } catch (e) {
            console.warn('Tx Sender fallback failed', e);
        }

        // Final Verify Check
        if (logs.length > 0) {
            if (minAmount) {
                const hasValid = logs.some((log: any) => {
                    const args = log.args || {};
                    const amount = args.amount || args.value || args.amount0In || BigInt(0);
                    const formatted = parseFloat(formatUnits(amount, 18));
                    return formatted >= parseFloat(minAmount);
                });
                if (hasValid) return { success: true, message: 'Verified!' };
            } else {
                return { success: true, message: 'Verified!' };
            }
        }

        return { success: false, error: 'No matching transaction found' };
    } catch (e) {
        console.error('Verify error:', e);
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}

export async function verifyQuestStepOnChain(questId: string, stepIndex: number, userAddress: string) {
    const quest = QUESTS[questId];
    if (!quest) throw new Error('Quest not found');

    const step = quest.steps[stepIndex];
    if (!step || !step.verification) throw new Error('Step not verifiable');

    if (step.verification.type === 'manual') {
        return { success: true, message: 'Verified manually', xp: 0 };
    }

    const result = await verifyVerificationConfig(step.verification, userAddress, `Step ${stepIndex + 1}: ${step.title}`);
    return { ...result, xp: 0 }; // Steps don't award XP directly in this model, but returning object structure
}

export async function verifyQuestOnChain(questId: string, userAddress: string) {
    const quest = QUESTS[questId];
    if (!quest || !quest.verification) {
        // If no verification config, likely manual or step-based. 
        throw new Error('Quest verification config not found (might be multi-step)');
    }

    const verifications = Array.isArray(quest.verification) ? quest.verification : [quest.verification];
    const onchainVerifications = verifications.filter(v => v.type === 'onchain');

    if (onchainVerifications.length === 0) throw new Error('No onchain config');

    for (const config of onchainVerifications) {
        const result = await verifyVerificationConfig(config, userAddress, quest.title);
        if (result.success) return { ...result, xp: quest.xp };
    }

    return { success: false, error: 'No matching transaction found' };
}
