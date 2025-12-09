'use client';

import { useState, useEffect } from 'react';
import { QUEST_LIST } from '@/data/quests';
import Link from 'next/link';
import Chip from './Chip';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredQuests, setFilteredQuests] = useState(QUEST_LIST);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredQuests(QUEST_LIST);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = QUEST_LIST.filter(quest =>
                quest.title.toLowerCase().includes(query) ||
                quest.description.toLowerCase().includes(query) ||
                quest.category.toLowerCase().includes(query)
            );
            setFilteredQuests(filtered);
        }
    }, [searchQuery]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden">
                {/* Search Input */}
                <div className="p-4 border-b border-purple-500/10">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search quests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-purple-300/50 outline-none text-lg"
                            autoFocus
                        />
                        <button
                            onClick={onClose}
                            className="text-purple-300/50 hover:text-purple-200 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {filteredQuests.length > 0 ? (
                        <div className="p-2">
                            {filteredQuests.map((quest) => (
                                <Link
                                    key={quest.id}
                                    href={`/quests/${quest.id}`}
                                    onClick={onClose}
                                    className="block p-4 rounded-lg hover:bg-purple-500/10 transition-colors group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold group-hover:text-purple-200 transition-colors mb-1">
                                                {quest.title}
                                            </h3>
                                            <p className="text-sm text-purple-300/60 line-clamp-1 mb-2">
                                                {quest.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <Chip variant="category" category={quest.category}>{quest.category}</Chip>
                                                <Chip variant="difficulty" difficulty={quest.difficulty}>{quest.difficulty}</Chip>
                                                <span className="text-xs text-purple-400 font-semibold">{quest.xp} XP</span>
                                            </div>
                                        </div>
                                        <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-3">🔍</div>
                            <h3 className="text-lg font-semibold text-white mb-1">No quests found</h3>
                            <p className="text-sm text-purple-300/60">Try a different search term</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-purple-500/10 bg-purple-500/5">
                    <div className="flex items-center justify-between text-xs text-purple-300/50">
                        <span>{filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''} found</span>
                        <span>Press ESC to close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
