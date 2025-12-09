import { NextRequest, NextResponse } from 'next/server';
import { verifyQuestOnChain } from '@/lib/verify';
import { QUESTS } from '@/data/quests';
import { db } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { address } = body;

        if (!address) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }

        // Get the quest
        const quest = QUESTS[id];
        if (!quest) {
            return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        }

        // 1. Check if already completed (Persistent DB check)
        if (db.getCompletion(id, address)) {
            return NextResponse.json({ error: 'Quest already completed' }, { status: 400 });
        }

        // 2. Perform Verification
        type VerificationResult = { success: boolean; xp?: number; message?: string; error?: string };
        let result: VerificationResult;


        // Check for multi-step verification (if quest.verification is undefined but steps have verification)
        const hasStepVerification = quest.steps.some(step => step.verification);

        if (!quest.verification && hasStepVerification) {
            // Check if ALL verifiable steps are completed in DB
            const stepsWithVerification = quest.steps.map((step, index) => ({ step, index })).filter(item => item.step.verification);

            const allStepsCompleted = stepsWithVerification.every(item => {
                return db.getStepCompletion(id, item.index, address);
            });

            if (allStepsCompleted) {
                result = {
                    success: true,
                    xp: quest.xp,
                    message: 'All steps completed! Quest verified.'
                };
            } else {
                result = {
                    success: false,
                    error: 'Please complete and verify all steps first.'
                };
            }
        }
        // Legacy/Standard Verification
        else if (quest.verification) {
            // Handle array or single object - check if ANY onchain verification exists
            const verifications = Array.isArray(quest.verification) ? quest.verification : [quest.verification];
            const isOnchain = verifications.some(v => v.type === 'onchain');

            if (isOnchain) {
                result = await verifyQuestOnChain(id, address);
            } else {
                // Manual/API placeholder
                result = {
                    success: true,
                    xp: quest.xp,
                    message: 'Quest completed! (Manual verification)'
                };
            }
        } else {
            // No verification config and no step verification -> Auto-complete (Manual default)
            result = {
                success: true,
                xp: quest.xp,
                message: 'Quest completed!'
            };
        }

        if (result.success) {
            // 3. Mark as completed (Persistent DB write)
            db.setCompletion(id, address);

            return NextResponse.json({
                success: true,
                xp: result.xp || quest.xp,
                message: result.message || 'Quest verified! XP awarded.'
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error || 'Verification failed'
            }, { status: 400 });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
