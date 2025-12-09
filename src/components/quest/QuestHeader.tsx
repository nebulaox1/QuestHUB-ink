'use client';

import { Quest } from '@/data/quests';
import Chip from '../Chip';

interface QuestHeaderProps {
    quest: Quest;
    hasStarted: boolean;
    isCompleted: boolean;
    isClaimed: boolean;
    onStart: () => void;
    onContinue: () => void;
    onClaim: () => void;
}

export default function QuestHeader({ quest, hasStarted, isCompleted, isClaimed, onStart, onContinue, onClaim }: QuestHeaderProps) {
    const brandColor = quest.brandColor || '#a855f7';

    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-[#13091f] border border-white/10 p-6 md:p-8"
            style={{ '--brand-color': brandColor } as React.CSSProperties}
        >
            {/* Brand Background - Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-[0.25] pointer-events-none"
                style={{ background: quest.brandGradient || brandColor }}
            />

            <div className="relative z-10 space-y-6">
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Chip variant="status" status={isCompleted || isClaimed ? 'completed' : 'active'}>
                        {isCompleted || isClaimed ? 'Completed' : 'In Progress'}
                    </Chip>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <Chip variant="difficulty" difficulty={quest.difficulty}>{quest.difficulty}</Chip>
                    <Chip variant="category" category={quest.category}>{quest.category}</Chip>
                    <Chip variant="network">{quest.network}</Chip>
                </div>

                {/* Title & Description */}
                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {quest.title}
                    </h1>
                    <p className="text-lg text-purple-200/60 leading-relaxed">
                        {quest.description}
                    </p>
                </div>

                {/* Context Row: Reward & Partner */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                    {/* XP Badge */}
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border rounded-lg"
                        style={{ borderColor: `${brandColor}40` }}
                    >
                        <span className="text-yellow-400 text-lg">⭐</span>
                        <span className="text-white font-bold">{quest.xp} XP</span>
                    </div>

                    <div className="w-px h-8 bg-white/10 hidden md:block" />

                    {/* Time */}
                    <div className="flex items-center gap-2 text-purple-200/60 text-sm font-medium">
                        <span>⏱️</span>
                        <span>{quest.timeEstimate}</span>
                    </div>

                    {/* Partner */}
                    {quest.partner && (
                        <>
                            <div className="w-px h-8 bg-white/10 hidden md:block" />
                            {quest.partner.website ? (
                                <a
                                    href={quest.partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 group/partner hover:opacity-80 transition-opacity"
                                >
                                    <span className="text-xl bg-white/5 p-1 rounded-md text-white/90">
                                        {(quest.partner.logo.startsWith('/') || quest.partner.logo.startsWith('http')) ? (
                                            <img
                                                src={quest.partner.logo}
                                                alt={quest.partner.name}
                                                className="w-6 h-6 object-contain"
                                            />
                                        ) : (
                                            quest.partner.logo
                                        )}
                                    </span>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white font-bold text-sm tracking-tight group-hover/partner:text-[var(--brand-color)] transition-colors">{quest.partner.name}</span>
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-xl bg-white/5 p-1 rounded-md text-white/90">
                                        {(quest.partner.logo.startsWith('/') || quest.partner.logo.startsWith('http')) ? (
                                            <img
                                                src={quest.partner.logo}
                                                alt={quest.partner.name}
                                                className="w-6 h-6 object-contain"
                                            />
                                        ) : (
                                            quest.partner.logo
                                        )}
                                    </span>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white font-bold text-sm tracking-tight">{quest.partner.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Primary CTA */}
                <div className="pt-6">
                    {isCompleted && !isClaimed ? (
                        <button
                            onClick={onClaim}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 font-bold rounded-xl transition-all hover:scale-105"
                        >
                            <span>🎉</span> Claim Reward
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
