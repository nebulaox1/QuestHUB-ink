import { NextResponse } from 'next/server';
import { verifyQuestStepOnChain } from '@/lib/verify';
import { db } from '@/lib/db';
import { QUESTS } from '@/data/quests';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: questId } = await params;
        const { address, stepIndex } = await request.json();

        if (!address || stepIndex === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing address or stepIndex' },
                { status: 400 }
            );
        }

        const quest = QUESTS[questId];
        if (!quest) {
            console.log(`[step-verify] Quest not found for ID: ${questId}`);
            return NextResponse.json(
                { success: false, error: 'Quest not found' },
                { status: 404 }
            );
        }

        // Check if already verified
        const isStepCompleted = db.getStepCompletion(questId, stepIndex, address);
        if (isStepCompleted) {
            return NextResponse.json({
                success: true,
                message: 'Step already verified',
                alreadyCompleted: true
            });
        }

        // Verify on-chain
        try {
            const result = await verifyQuestStepOnChain(questId, stepIndex, address);

            if (result.success) {
                // Mark step as completed
                db.setStepCompletion(questId, stepIndex, address);

                // Calculate and award XP split
                const totalSteps = quest.steps.length;
                const xpPerStep = Math.floor(quest.xp / totalSteps);

                if (xpPerStep > 0) {
                    db.addXp(address, xpPerStep);
                }

                // Check if ALL steps are now completed
                const completedSteps = db.getUserStepCompletions(questId, address);
                if (completedSteps.length === quest.steps.length) {
                    // Mark quest as fully completed
                    db.setCompletion(questId, address);
                }

                return NextResponse.json({
                    success: true,
                    message: result.message,
                    xpAwarded: xpPerStep
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: (result as any).error || 'Verification failed'
                });
            }
        } catch (verifyError: any) {
            console.error('Step verification error:', verifyError);
            return NextResponse.json({
                success: false,
                error: verifyError.message || 'Verification error'
            });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: questId } = await params;
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json({ success: false, error: 'Missing address' }, { status: 400 });
        }

        const completedIndices = db.getUserStepCompletions(questId, address);
        return NextResponse.json({ success: true, completedIndices });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
