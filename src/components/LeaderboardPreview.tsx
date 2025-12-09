'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Image from 'next/image';

interface LeaderboardEntry {
    rank: number;
    address: string;
    xp: number;
    questsCompleted: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', xp: 8500, questsCompleted: 24 },
    { rank: 2, address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72', xp: 7200, questsCompleted: 21 },
    { rank: 3, address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', xp: 6800, questsCompleted: 19 },
    { rank: 4, address: '0x4Bbeeb066eD09B7AEd07bF39EEe0460DFa261520', xp: 5400, questsCompleted: 16 },
    { rank: 5, address: '0x1234567890123456789012345678901234567890', xp: 4900, questsCompleted: 14 },
];

type TimePeriod = 'season' | 'week' | 'all-time';

export default function LeaderboardPreview() {
    const { address } = useAccount();
    const [period, setPeriod] = useState<TimePeriod>('season');

    const periods: { value: TimePeriod; label: string }[] = [
        { value: 'season', label: 'Season' },
        { value: 'week', label: 'Week' },
        { value: 'all-time', label: 'All Time' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Top Questers</h2>
                        <p className="text-sm text-gray-400">See who's leading</p>
                    </div>
                    <Link
                        href="/leaderboard"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all border border-white/20 text-center"
                    >
                        View Full Leaderboard
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-4 bg-black/40 p-1 rounded-lg border border-white/10 w-fit">
                    {periods.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setPeriod(value)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${period === value
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-gray-900/50 border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-black/40">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Address
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    XP
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Quests
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_LEADERBOARD.map((entry) => {
                                const isCurrentUser = address && entry.address.toLowerCase() === address.toLowerCase();

                                return (
                                    <tr
                                        key={entry.rank}
                                        className={`transition-colors ${isCurrentUser
                                            ? 'bg-purple-500/10 border-l-2 border-l-purple-500'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-lg font-bold text-white flex items-center gap-2">
                                                {entry.rank === 1 && (
                                                    <Image src="/ranks/rank-1.png" alt="Rank 1" width={32} height={32} className="w-8 h-8 object-contain" />
                                                )}
                                                {entry.rank === 2 && (
                                                    <Image src="/ranks/rank-2.png" alt="Rank 2" width={32} height={32} className="w-8 h-8 object-contain" />
                                                )}
                                                {entry.rank === 3 && (
                                                    <Image src="/ranks/rank-3.png" alt="Rank 3" width={32} height={32} className="w-8 h-8 object-contain" />
                                                )}
                                                {entry.rank > 3 && (
                                                    <span>#{entry.rank}</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm text-white">
                                                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                                                </span>
                                                {isCurrentUser && (
                                                    <span className="px-1.5 py-0.5 bg-purple-500 text-white text-xs font-bold rounded">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-yellow-400 font-semibold">
                                                {entry.xp.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-gray-300">
                                                {entry.questsCompleted}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
