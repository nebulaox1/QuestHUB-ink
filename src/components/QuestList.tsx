'use client';

import { useState } from 'react';
import QuestCard from './QuestCard';
import { QUEST_LIST, QuestCategory } from '@/data/quests';
import { useUserProgress } from '@/context/UserProgressContext';

type SortOption = 'newest' | 'xp' | 'easiest';

export default function QuestList() {
    const [filter, setFilter] = useState<QuestCategory | 'All'>('All');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const { isQuestCompleted, getQuestProgress } = useUserProgress();

    const filteredQuests = QUEST_LIST
        .filter(quest => !quest.hidden)
        .filter(quest => filter === 'All' || quest.category === filter)
        .sort((a, b) => {
            if (sortBy === 'xp') return b.xp - a.xp;
            if (sortBy === 'easiest') {
                const order = { Easy: 1, Medium: 2, Hard: 3 };
                return order[a.difficulty] - order[b.difficulty];
            }
            return parseInt(b.id) - parseInt(a.id);
        });

    const categories: (QuestCategory | 'All')[] = ['All', 'DeFi', 'Bridge', 'Social', 'NFT', 'Gaming'];

    const totalXP = QUEST_LIST.reduce((sum, quest) => sum + quest.xp, 0);

    return (
        <div id="quests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dashboard-style Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-[#13091f] p-2 rounded-2xl border border-white/5">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${filter === cat
                                ? 'bg-[#7C3AED] text-white shadow-lg shadow-purple-900/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>{cat}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Summary */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 px-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-purple-300">{QUEST_LIST.length} Active</span>
                    </div>
                    <span className="w-px h-3 bg-white/10" />
                    <span>{totalXP.toLocaleString()} XP Pool</span>
                </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-purple-300/60">
                    Showing <span className="font-semibold text-purple-400">{filteredQuests.length}</span> {filteredQuests.length === 1 ? 'quest' : 'quests'}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-400/50 uppercase tracking-wider">
                        Sort:
                    </span>
                    {(['newest', 'xp', 'easiest'] as const).map((option) => (
                        <button
                            key={option}
                            onClick={() => setSortBy(option)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${sortBy === option
                                ? 'bg-purple-500/20 text-purple-100 border border-purple-500/30'
                                : 'text-purple-300/60 hover:text-purple-200 hover:bg-purple-500/10'
                                }`}
                        >
                            {option === 'xp' ? 'Most XP' : option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredQuests.map((quest) => (
                    <QuestCard
                        key={quest.id}
                        {...quest}
                        status={isQuestCompleted(quest.id) ? 'completed' : quest.status}
                        completedSteps={getQuestProgress(quest.id)}
                        totalSteps={quest.steps?.length || 0}
                    />
                ))}
            </div>

            {/* Empty */}
            {filteredQuests.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">No quests found</h3>
                    <p className="text-sm text-purple-300/60">Try selecting a different category</p>
                </div>
            )}
        </div>
    );
}
