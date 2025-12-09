'use client';

import { LEADERBOARD_DATA, formatAddress, getRankBadge, LeaderboardUser } from '@/data/leaderboard';
import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { useUserProgress } from '@/context/UserProgressContext';

type TimeFilter = 'season' | 'all-time' | 'weekly';

export default function Leaderboard() {
    const [filter, setFilter] = useState<TimeFilter>('season');
    const { address } = useAccount();
    const { xp, completedQuests } = useUserProgress();

    // Merge mock data with real user data
    const { displayedUsers, currentUserMetrics, showUserSeparate } = useMemo(() => {
        let allUsers = [...LEADERBOARD_DATA];

        if (address) {
            // Remove existing entry if it exists to prevent duplicates
            allUsers = allUsers.filter(u => u.address.toLowerCase() !== address.toLowerCase());

            // Add current user
            const currentUser: LeaderboardUser = {
                rank: 0, // Will be calculated
                address: address,
                displayName: 'You',
                xp: xp,
                questsCompleted: completedQuests.length,
                badges: [],
                avatar: '👤'
            };
            allUsers.push(currentUser);
        }

        // Sort by XP descending
        allUsers.sort((a, b) => b.xp - a.xp);

        // Assign Ranks
        allUsers.forEach((u, i) => u.rank = i + 1);

        // Find current user's new position
        const userIndex = allUsers.findIndex(u => u.address.toLowerCase() === address?.toLowerCase());
        const currentUserMetrics = userIndex !== -1 ? allUsers[userIndex] : null;

        // Top 100
        const top100 = allUsers.slice(0, 100);

        // Determine if we need to show the user separately (if rank > 100)
        // Only show if user exists AND is not already in top 100
        const showUserSeparate = userIndex >= 100 && !!currentUserMetrics;

        return { displayedUsers: top100, currentUserMetrics, showUserSeparate };
    }, [address, xp, completedQuests]);

    // Total stats derivation
    const totalQuesters = LEADERBOARD_DATA.length + (address ? 1 : 0); // Approx
    const totalXp = LEADERBOARD_DATA.reduce((sum, user) => sum + user.xp, 0) + (address ? Math.max(0, xp - (LEADERBOARD_DATA.find(u => u.address === address)?.xp || 0)) : 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Overview
                    </h2>
                    <p className="text-purple-300/60 mt-1">Top questers in the Ink ecosystem</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex bg-[#13091f] border border-[rgba(139,92,246,0.15)] p-1 rounded-lg">
                    {(['season', 'all-time', 'weekly'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${filter === f
                                ? 'bg-purple-500/20 text-purple-200 shadow-sm border border-purple-500/30'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                    <div className="text-purple-300/50 text-sm mb-1">Total Questers</div>
                    <div className="text-3xl font-bold text-purple-100">{totalQuesters.toLocaleString()}</div>
                </div>
                <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                    <div className="text-purple-300/50 text-sm mb-1">Total XP Earned</div>
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text">
                        {totalXp.toLocaleString()}
                    </div>
                </div>
                <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                    <div className="text-purple-300/50 text-sm mb-1">Quests Completed</div>
                    <div className="text-3xl font-bold text-white">
                        {LEADERBOARD_DATA.reduce((sum, user) => sum + user.questsCompleted, 0).toLocaleString()}+
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl overflow-hidden shadow-lg shadow-purple-900/10">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-sm font-semibold text-gray-400">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-7 md:col-span-7">Player</div>
                    <div className="col-span-2 text-right">XP</div>
                    <div className="col-span-2 md:col-span-2 text-right">Quests</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {displayedUsers.map((user, index) => (
                        <LeaderboardRow
                            key={user.address}
                            user={user}
                            index={index}
                            isCurrentUser={address === user.address}
                        />
                    ))}

                    {/* Pending User Row if outside Top 100 */}
                    {showUserSeparate && (
                        <>
                            {/* Separator */}
                            <div className="px-6 py-2 bg-white/5 border-b border-white/5 flex justify-center">
                                <span className="text-gray-500 font-mono text-sm tracking-widest">. . .</span>
                            </div>

                            {/* Pinned User Row */}
                            {currentUserMetrics && (
                                <LeaderboardRow
                                    user={currentUserMetrics}
                                    index={currentUserMetrics.rank - 1}
                                    isCurrentUser={true}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function LeaderboardRow({ user, index, isCurrentUser }: { user: LeaderboardUser; index: number; isCurrentUser: boolean }) {
    const isTopThree = user.rank <= 3;

    return (
        <div
            className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors ${isTopThree ? 'bg-gradient-to-r from-purple-500/10 to-transparent' : ''} ${isCurrentUser ? 'bg-purple-500/10 border-l-2 border-purple-500' : ''}`}
        >
            {/* Rank */}
            <div className="col-span-1 flex items-center">
                <span className={`text-xl font-bold ${isTopThree ? 'text-purple-200' : 'text-gray-500'}`}>
                    #{user.rank}
                </span>
            </div>

            {/* Player Info */}
            <div className="col-span-7 md:col-span-7 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl relative">
                    {user.avatar || '👤'}
                    {/* Main Chain Icon (Placeholder) */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-black flex items-center justify-center text-[8px]" title="Main Chain: Base">
                        🔵
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        {user.displayName && (
                            <span className="font-semibold text-white">{user.displayName}</span>
                        )}
                        {isCurrentUser && (
                            <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded uppercase">You</span>
                        )}
                    </div>
                    <span className="text-sm text-gray-400 font-mono">
                        {formatAddress(user.address)}
                    </span>
                </div>
            </div>

            {/* XP */}
            <div className="col-span-2 flex items-center justify-end">
                <div className="text-right">
                    <div className="font-bold text-white">{user.xp.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">XP</div>
                </div>
            </div>

            {/* Quests Completed */}
            <div className="col-span-2 md:col-span-2 flex items-center justify-end">
                <div className="text-right">
                    <div className="font-bold text-white">{user.questsCompleted}</div>
                    <div className="text-xs text-gray-400">completed</div>
                </div>
            </div>
        </div>
    );
}
