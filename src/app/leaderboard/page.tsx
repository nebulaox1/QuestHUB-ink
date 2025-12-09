'use client';

import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center space-y-4 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent -z-10" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                    🏆 Leaderboard
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Compete with other questers and climb the ranks. Complete more quests to earn XP and badges!
                </p>
            </section>

            {/* Leaderboard Component */}
            <Leaderboard />
        </div>
    );
}
