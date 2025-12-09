'use client';

import { Quest } from '@/data/quests';
import TrendingQuestCard from './TrendingQuestCard';
import { useRef } from 'react';

interface TrendingQuestRailProps {
    quests: Quest[];
}

export default function TrendingQuestRail({ quests }: TrendingQuestRailProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="space-y-4">
            {/* Header is handled in parent to include Featured Hero context if needed, but per request: 
                 "Sorted by: Most active this week" helper text should be communicated.
                 The parent page.tsx will handle the Section Title. This component just handles the rail.
             */}

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="no-scrollbar flex w-full gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
            >
                {quests.map((quest) => (
                    <div key={quest.id} className="snap-start">
                        <TrendingQuestCard quest={quest} />
                    </div>
                ))}
            </div>

            {/* Mobile scroll hint could go here if needed */}
        </div>
    );
}
