'use client';

import Link from 'next/link';
import Chip from './Chip';
import { QuestCategory, QuestDifficulty, QuestPartner } from '@/data/quests';

interface QuestCardProps {
    id: string;
    title: string;
    description: string;
    xp: number;
    status: 'active' | 'completed' | 'locked';
    category: QuestCategory;
    difficulty: QuestDifficulty;
    timeEstimate: string;
    network: string;
    completions?: number;
    brandColor?: string;
    brandGradient?: string;
    variant?: 'card' | 'row';
    partner?: QuestPartner;
    completedSteps?: number;
    totalSteps?: number;
}

export default function QuestCard({ id, title, description, xp, status, category, difficulty, timeEstimate, network, completions, brandColor, brandGradient, variant = 'card', partner, completedSteps = 0, totalSteps = 0 }: QuestCardProps) {
    const statusLabels = {
        active: 'Not Started',
        completed: 'Completed',
        locked: 'Locked',
    };

    // Category icons
    const categoryIcons: Record<QuestCategory, string> = {
        'DeFi': '💱',
        'Bridge': '🌉',
        'Social': '👥',
        'NFT': '🖼️',
        'Gaming': '🎮'
    };

    // Compact Row Variant
    if (variant === 'row') {
        return (
            <Link
                href={`/quests/${id}`}
                className="block group w-full"
                style={{
                    '--brand-color': brandColor || '#a855f7',
                    '--brand-color-dim': `${brandColor}20` || 'rgba(168, 85, 247, 0.2)'
                } as React.CSSProperties}
            >
                <div
                    className={`relative bg-[#13091f] border rounded-xl p-4 transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden
                        ${status === 'completed'
                            ? 'border-green-500/50 shadow-md shadow-green-900/10'
                            : 'hover:border-[var(--brand-color)] hover:shadow-lg hover:shadow-[var(--brand-color-dim)] hover:-translate-y-0.5'
                        }
                    `}
                    style={{ borderColor: status === 'completed' ? 'rgba(34, 197, 94, 0.5)' : 'var(--brand-color-dim)' }}
                >
                    {/* Brand Background */}
                    <div
                        className="absolute inset-0 opacity-[0.40] group-hover:opacity-[0.60] transition-opacity duration-300"
                        style={{ background: brandGradient || 'var(--brand-color)' }}
                    />

                    <div className="relative z-10 flex items-center gap-4 min-w-0">
                        <span className="flex items-center justify-center w-10 h-10 flex-shrink-0 bg-white/5 rounded-lg border border-white/5 text-xl">
                            {partner?.logo?.startsWith('/') ? (
                                <img src={partner.logo} alt={partner.name} className="w-6 h-6 object-contain" />
                            ) : (
                                categoryIcons[category]
                            )}
                        </span>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-purple-100 group-hover:text-white transition-colors truncate pr-2">
                                {title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                {completedSteps === totalSteps && totalSteps > 0 ? (
                                    <span className="bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                                        Completed
                                    </span>
                                ) : completedSteps > 0 && totalSteps > 0 ? (
                                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                                        In Progress: {completedSteps}/{totalSteps}
                                    </span>
                                ) : (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        status === 'active' ? 'bg-purple-500/20 text-purple-300' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {statusLabels[status]}
                                    </span>
                                )}
                                <span className="text-[10px] text-purple-300/50 flex items-center gap-1">
                                    <span>⏱️</span> {timeEstimate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: XP */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 rounded-lg border border-white/5">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-purple-100 font-bold text-sm">{xp}</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Card Variant (Default)
    return (
        <Link
            href={`/quests/${id}`}
            className="block group h-full"
            style={{
                '--brand-color': brandColor || '#a855f7',
                '--brand-color-dim': `${brandColor}20` || 'rgba(168, 85, 247, 0.2)'
            } as React.CSSProperties}
        >
            <div
                className={`relative bg-[#13091f] border rounded-xl p-5 transition-all duration-300 h-full flex flex-col overflow-hidden
                    ${status === 'completed'
                        ? 'border-green-500/50 shadow-lg shadow-green-900/20'
                        : 'hover:border-[var(--brand-color)] hover:shadow-xl hover:shadow-[var(--brand-color-dim)] hover:-translate-y-1'
                    }
                `}
                style={{
                    borderColor: status === 'completed' ? 'rgba(34, 197, 94, 0.5)' : 'var(--brand-color-dim)'
                }}
            >
                {/* Brand Background - Gradient or Solid */}
                <div
                    className="absolute inset-0 opacity-[0.40] group-hover:opacity-[0.60] transition-opacity duration-300"
                    style={{ background: brandGradient || 'var(--brand-color)' }}
                />

                {/* Header: Icon/Title Left, Status/Chain Right */}
                <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="flex items-center justify-center w-10 h-10 flex-shrink-0 bg-white/5 rounded-lg border border-white/5 text-2xl">
                            {partner?.logo?.startsWith('/') ? (
                                <img src={partner.logo} alt={partner.name} className="w-7 h-7 object-contain" />
                            ) : (
                                categoryIcons[category]
                            )}
                        </span>
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-purple-100 group-hover:text-white transition-colors truncate">
                                {title}
                            </h3>
                            <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 w-fit px-1.5 py-0.5 rounded ${completedSteps === totalSteps && totalSteps > 0
                                ? 'bg-green-500/20 text-green-400'
                                : completedSteps > 0 && totalSteps > 0
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        status === 'active' ? 'bg-purple-500/20 text-purple-300' :
                                            'bg-gray-500/20 text-gray-400'
                                }`}>
                                {completedSteps === totalSteps && totalSteps > 0
                                    ? 'Completed'
                                    : completedSteps > 0 && totalSteps > 0
                                        ? `In Progress: ${completedSteps}/${totalSteps}`
                                        : statusLabels[status]
                                }
                            </div>
                        </div>
                    </div>
                    <Chip variant="network">{network}</Chip>
                </div>

                {/* Description */}
                <p className="relative z-10 text-sm text-purple-300/60 leading-relaxed mb-6 line-clamp-1 flex-grow">
                    {description}
                </p>

                {/* Bottom Fixed Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-y-2 gap-x-1 pt-3 border-t border-purple-500/10 text-xs text-purple-300/70">
                    <div className="flex items-center gap-1.5">
                        <span>🏷️</span>
                        <span>{category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>{difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>⭐</span>
                        <span className="text-purple-100 font-bold">{xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>⏱️</span>
                        <span>{timeEstimate}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
