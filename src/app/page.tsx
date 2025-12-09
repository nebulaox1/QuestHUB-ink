'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import Link from 'next/link';
import QuestList from '@/components/QuestList';
import FeaturedQuestHero from '@/components/FeaturedQuestHero';
import TrendingQuestRail from '@/components/TrendingQuestRail';
import SeasonSection from '@/components/SeasonSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { useUserProgress } from '@/context/UserProgressContext';
import { useReadContract } from 'wagmi';
import { QUESTS } from '@/data/quests';
import { INK_STREAK_ADDRESS, INK_STREAK_ABI } from '@/data/contracts';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const { xp, completedQuests } = useUserProgress();

  // Ink Streak Data
  const {
    data: streakData,
    isLoading: isStreakLoading,
    isError: isStreakError,
    error: streakError,
    refetch: refetchStreak
  } = useReadContract({
    address: INK_STREAK_ADDRESS,
    abi: INK_STREAK_ABI,
    functionName: 'getStreak',
    chainId: 57073, // Enforce Inkchain
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: 1, // Minimize retry spam
      refetchOnWindowFocus: false, // Prevent flicker on tab switch
    }
  });

  // Debug Log
  useEffect(() => {
    if (isStreakError) {
      console.error("Streak Fetch Error:", streakError);
    }
    if (streakData !== undefined) {
      console.log("Streak Data:", streakData);
    }
  }, [streakData, isStreakError, streakError]);

  const currentStreak = streakData ? Number(streakData) : 0;

  // Logic: Loading -> "...", Error -> "!", Success -> Value
  let showStreak: string | number = currentStreak;
  if (isStreakLoading) showStreak = "...";
  if (isStreakError) showStreak = "!";

  // Dynamic user data
  const userStats = {
    xp: xp,
    rank: Math.max(100 - Math.floor(xp / 100), 1),
    questsCompleted: completedQuests.length,
    weeklyProgress: completedQuests.length,
    seasonGoal: 5000
  };

  const progressPercent = Math.min((userStats.xp / userStats.seasonGoal) * 100, 100);

  // Featured Quest: Ink Bridge (ID 2)
  const featuredQuest = QUESTS['2'];

  // Trending Quests: Top 5 by completions excluding featured
  const trendingQuests = Object.values(QUESTS)
    .filter(q => q.id !== featuredQuest.id)
    .sort((a, b) => (b.completions || 0) - (a.completions || 0))
    .slice(0, 5);

  const handleWalletClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      setIsConnecting(true);
      try {
        connect({ connector: injected() });
      } catch (error) {
        console.error('Failed to connect:', error);
      } finally {
        setTimeout(() => setIsConnecting(false), 500);
      }
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Dashboard Header / Hero */}
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isConnected ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Dashboard Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Identity */}
                <div className="bg-[#13091f] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-emoji shadow-lg">
                      👤
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white max-w-[100px] truncate">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </div>
                      <div className="text-xs text-green-400 font-medium">Online</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-purple-300/60 bg-white/5 p-2 rounded-lg">
                    <span>🔥</span> {showStreak} Day Streak
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-[#13091f] border border-white/5 rounded-2xl p-5 flex flex-col justify-center">
                  <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">Total XP</div>
                  <div className="text-3xl font-extrabold text-white mb-1">
                    {userStats.xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-300/50">Global Rank #{userStats.rank}</div>
                </div>

                {/* Activity */}
                <div className="bg-[#13091f] border border-white/5 rounded-2xl p-5 flex flex-col justify-center items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{userStats.questsCompleted}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Completed Quests</div>
                  </div>
                </div>

                {/* Season Goal */}
                <div className="bg-gradient-to-br from-purple-900/40 to-[#13091f] border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-purple-300">Next Reward</span>
                      <span className="text-xs font-bold text-white">Legend Tier</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full mb-3">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="text-xs text-purple-200/70">
                      Finish 3 more quests to level up!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Landing Hero (Keep simplified if disconnected)
            <div className="max-w-4xl mx-auto text-center space-y-8 py-16 animate-in fade-in duration-700">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                Your Onchain <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Reputation Layer</span>
              </h1>
              <p className="text-xl text-purple-200/60 max-w-2xl mx-auto">
                Connect to Ink QuestHUB to track your journey, earn XP, and unlock exclusive ecosystem rewards.
              </p>

            </div>
          )}
        </div>
      </section>

      {/* Trending Quests Section (Redesigned) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">🔥</span>
                <h2 className="text-2xl font-bold text-white">Trending Quests</h2>
              </div>
              <p className="text-xs font-medium text-purple-200/50 uppercase tracking-wider pl-1">
                Sorted by: Most active this week
              </p>
            </div>

            <Link
              href="#all-quests"
              className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors mb-1"
            >
              View all quests →
            </Link>
          </div>

          <div className="space-y-6">
            {/* Hero */}
            <FeaturedQuestHero quest={featuredQuest} />

            {/* Rail */}
            <TrendingQuestRail quests={trendingQuests} />
          </div>
        </div>
      </section>

      {/* Available Quests */}
      <section id="all-quests" className="py-8">
        <QuestList />
      </section>

      {/* Season Section */}
      <section className="py-12 bg-black/20">
        <SeasonSection userXP={isConnected ? userStats.xp : 0} />
      </section>

      {/* FAQ */}
      <section className="py-12">
        <FAQSection />
      </section>

      <Footer />
    </div>
  );
}
