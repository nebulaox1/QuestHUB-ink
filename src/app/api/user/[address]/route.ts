import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { QUESTS } from '@/data/quests';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const completedQuestIds = db.getUserCompletions(address);

        // Calculate total XP
        let totalXp = 0;
        completedQuestIds.forEach(id => {
            const quest = QUESTS[id];
            if (quest) {
                totalXp += quest.xp;
            }
        });

        return NextResponse.json({
            address,
            completedQuests: completedQuestIds,
            stepCompletions: db.getAllUserStepCompletions(address),
            xp: totalXp
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
