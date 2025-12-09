import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { QUEST_LIST } from '@/data/quests';
import { verifyQuestOnChain } from '@/lib/verify';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;
        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const userAddress = address.toLowerCase();

        // 1. Get current completions
        const completedIds = db.getUserCompletions(userAddress);

        // 2. Identify quests to check (Onchain, Active, Not Completed)
        const questsToCheck = QUEST_LIST.filter(quest =>
            quest.status === 'active' &&
            (Array.isArray(quest.verification) ? quest.verification.some(v => v.type === 'onchain') : quest.verification?.type === 'onchain') &&
            !completedIds.includes(quest.id)
        );

        if (questsToCheck.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No quests to sync',
                newCompletions: []
            });
        }

        console.log(`Syncing ${questsToCheck.length} quests for ${userAddress}...`);

        // 3. Run verification in parallel (with limit if needed, but Promise.all is okay for <20 items)
        // We'll map to promises that resolve to the Quest ID if successful, or null
        const results = await Promise.all(questsToCheck.map(async (quest) => {
            try {
                // Add a small delay jitter to avoid slamming RPC if many users hit this
                await new Promise(r => setTimeout(r, Math.random() * 500));

                const result = await verifyQuestOnChain(quest.id, userAddress);
                if (result.success) {
                    return quest.id;
                }
            } catch (error) {
                console.warn(`Sync failed for quest ${quest.id}:`, error);
            }
            return null;
        }));

        // 4. Update DB for successful checks
        const newCompletions = results.filter((id): id is string => id !== null);

        newCompletions.forEach(questId => {
            db.setCompletion(questId, userAddress);
        });

        return NextResponse.json({
            success: true,
            syncedCount: questsToCheck.length,
            newCompletions: newCompletions,
            totalCompletions: db.getUserCompletions(userAddress) // Return full updated list
        });

    } catch (error) {
        console.error('Sync API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
