'use client';

import Link from 'next/link';
import { Quest, QuestCategory } from '@/data/quests';
import { useUserProgress } from '@/context/UserProgressContext';

interface TrendingQuestCardProps {
    quest: Quest;
}

export default function TrendingQuestCard({ quest }: TrendingQuestCardProps) {
    const { isQuestCompleted, getQuestProgress } = useUserProgress();
    const isCompleted = isQuestCompleted(quest.id);
    const completedSteps = getQuestProgress(quest.id);
    const totalSteps = quest.steps?.length || 0;

    const categoryIcons: Record<QuestCategory, string> = {
        'DeFi': '💱',
        'Bridge': '🌉',
        'Social': '👥',
        'NFT': '🖼️',
        'Gaming': '🎮'
    };

    const statusLabels = {
        active: 'Not Started',
        completed: 'Completed',
        locked: 'Locked',
    };

    const brandColor = quest.brandColor || '#a855f7';
    const brandColorDim = `${brandColor}20`; // 20% opacity for border

    // Determine visual status
    const showCompleted = isCompleted || (completedSteps === totalSteps && totalSteps > 0);
    const showInProgress = !isCompleted && completedSteps > 0 && totalSteps > 0 && completedSteps < totalSteps;

    return (
        <Link
            href={`/quests/${quest.id}`}
            className="group relative flex h-full w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-xl border bg-[#13091f] transition-all duration-200 ease-out hover:border-[var(--brand-color)] hover:shadow-lg hover:shadow-[var(--brand-color-dim)] motion-safe:hover:-translate-y-2"
            style={{
                '--brand-color': brandColor,
                '--brand-color-dim': brandColorDim,
                borderColor: showCompleted ? 'rgba(34, 197, 94, 0.5)' : brandColorDim,
            } as React.CSSProperties}
        >
            {/* Subtle Brand Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-[0.40] transition-opacity duration-300 group-hover:opacity-[0.60]"
                style={{ background: quest.brandGradient || 'var(--brand-color)' }}
            />

            <div className="relative z-10 flex h-full flex-col justify-between p-4">
                {/* Top Section */}
                <div>
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xl backdrop-blur-sm">
                            {quest.partner?.logo?.startsWith('/') ? (
                                <img src={quest.partner.logo} alt={quest.partner.name} className="w-7 h-7 object-contain" />
                            ) : (
                                categoryIcons[quest.category]
                            )}
                        </div>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${showCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : showInProgress
                                ? 'bg-blue-500/20 text-blue-300'
                                : quest.status === 'active' ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-gray-500/20 text-gray-400'
                            }`}>
                            {showCompleted
                                ? 'Completed'
                                : showInProgress
                                    ? `In Progress: ${completedSteps}/${totalSteps}`
                                    : statusLabels[quest.status]
                            }
                        </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors">
                        {quest.title}
                    </h3>
                </div>

                {/* Bottom Meta */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs font-medium text-purple-200/50">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            ⏱️ {quest.timeEstimate}
                        </span>
                        <span className="flex items-center gap-1 text-white">
                            ⭐ {quest.xp} XP
                        </span>
                    </div>

                </div>
            </div>
        </Link>
    );
}
