'use client';

import Link from 'next/link';
import Chip from './Chip';
import { Quest, QuestCategory } from '@/data/quests';

interface FeaturedQuestCardProps {
    quest: Quest;
}

export default function FeaturedQuestCard({ quest }: FeaturedQuestCardProps) {
    // Category icons
    const categoryIcons: Record<QuestCategory, string> = {
        'DeFi': '💱',
        'Bridge': '🌉',
        'Social': '👥',
        'NFT': '🖼️',
        'Gaming': '🎮'
    };

    const brandColor = quest.brandColor || '#a855f7'; // Default purple
    const brandColorDim = `${brandColor}20`; // 20% opacity approx

    return (
        <div
            className="relative bg-[#13091f] border rounded-xl p-8 overflow-hidden group hover:border-[var(--brand-color)] hover:shadow-xl hover:shadow-[var(--brand-color-dim)] transition-all duration-300"
            style={{
                '--brand-color': brandColor,
                '--brand-color-dim': brandColorDim,
                borderColor: 'var(--brand-color-dim)'
            } as React.CSSProperties}
        >
            {/* Brand Background - Gradient or Solid */}
            <div
                className="absolute inset-0 opacity-[0.40] group-hover:opacity-[0.60] transition-opacity duration-300"
                style={{ background: quest.brandGradient || 'var(--brand-color)' }}
            />

            <div className="relative z-10 grid md:grid-cols-3 gap-6">
                {/* Left: Quest info */}
                <div className="md:col-span-2 space-y-4">
                    {/* Title with Icon */}
                    <div className="flex items-start gap-3">
                        <span className="text-4xl flex-shrink-0">{categoryIcons[quest.category]}</span>
                        <h3 className="text-3xl font-bold text-white group-hover:text-[var(--brand-color)] transition-colors">
                            {quest.title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-purple-200/80 leading-relaxed text-base">
                        {quest.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip variant="network">{quest.network}</Chip>
                        <Chip variant="category" category={quest.category}>{quest.category}</Chip>
                        <Chip variant="difficulty" difficulty={quest.difficulty}>{quest.difficulty}</Chip>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm pt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg border border-purple-500/30">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-purple-100 font-bold text-base">{quest.xp} XP</span>
                        </div>
                        <span className="text-purple-500/40">·</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-purple-400">⏱️</span>
                            <span className="text-purple-300/70">{quest.timeEstimate}</span>
                        </div>
                        {quest.partner && (
                            <>
                                <span className="text-purple-500/40">·</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg">{quest.partner.logo}</span>
                                    <span className="text-white font-medium">{quest.partner.name}</span>
                                    {quest.partner.verified && (
                                        <span className="text-blue-400 text-xs">✓</span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col justify-center gap-3">
                    <Link
                        href={`/quests/${quest.id}`}
                        className="w-full py-3 px-6 text-white font-bold rounded-lg transition-all text-center shadow-lg shadow-[var(--brand-color-dim)] hover:shadow-xl hover:shadow-[var(--brand-color-dim)] hover:scale-105 duration-300 brightness-110"
                        style={{ backgroundColor: 'var(--brand-color)' }}
                    >
                        Start Quest
                    </Link>
                    <Link
                        href={`/quests/${quest.id}`}
                        className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all text-center border border-white/10 hover:border-[var(--brand-color)]"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div >
    );
}
