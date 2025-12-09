'use client';

import Link from 'next/link';
import Chip from './Chip';
import { Quest, QuestCategory } from '@/data/quests';

interface FeaturedQuestHeroProps {
    quest: Quest;
}

export default function FeaturedQuestHero({ quest }: FeaturedQuestHeroProps) {
    // Category icons map
    const categoryIcons: Record<QuestCategory, string> = {
        'DeFi': '💱',
        'Bridge': '🌉',
        'Social': '👥',
        'NFT': '🖼️',
        'Gaming': '🎮'
    };

    const brandColor = quest.brandColor || '#a855f7';
    const brandColorDim = `${brandColor}20`;

    return (
        <div
            className="group relative w-full overflow-hidden rounded-2xl border bg-[#13091f] p-6 md:p-10 transition-all duration-300 hover:border-[var(--brand-color)] hover:shadow-2xl hover:shadow-[var(--brand-color-dim)]"
            style={{
                '--brand-color': brandColor,
                '--brand-color-dim': brandColorDim,
                borderColor: brandColorDim,
            } as React.CSSProperties}
        >
            {/* Brand Background - Gradient */}
            <div
                className="absolute inset-0 opacity-[0.30] transition-opacity duration-500 group-hover:opacity-[0.50]"
                style={{ background: quest.brandGradient || 'var(--brand-color)' }}
            />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Left Content */}
                <div className="flex-1 space-y-4">
                    {/* Header: Icon + Title */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm">
                            {quest.partner?.logo?.startsWith('/') ? (
                                <img src={quest.partner.logo} alt={quest.partner.name} className="w-8 h-8 object-contain" />
                            ) : (
                                categoryIcons[quest.category]
                            )}
                        </div>
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                                    🔥 Featured
                                </span>
                            </div>
                            <h3 className="line-clamp-1 text-2xl font-bold text-white md:text-3xl">
                                {quest.title}
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="line-clamp-1 max-w-2xl text-base text-purple-200/70">
                        {quest.description}
                    </p>

                    {/* Compact Tags Row */}
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-purple-200/60">
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                            <span className="text-purple-400">🏷️</span>
                            <span>{quest.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                            <span className="text-purple-400">📊</span>
                            <span>{quest.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white">{quest.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                            <span className="text-purple-400">⏱️</span>
                            <span>{quest.timeEstimate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                            <span className="text-purple-400">🔗</span>
                            <span>{quest.network}</span>
                        </div>
                    </div>
                </div>

                {/* Right CTA */}
                <div className="flex-shrink-0">
                    <Link
                        href={`/quests/${quest.id}`}
                        className="inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[var(--brand-color-dim)] transition-transform duration-300 hover:scale-105 active:scale-95 md:w-auto"
                        style={{ backgroundColor: 'var(--brand-color)' }}
                    >
                        Start Quest
                    </Link>
                </div>
            </div>
        </div>
    );
}
