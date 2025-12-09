'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: 'What is Ink QuestHUB?',
        answer: 'A community-built platform for exploring dApps on Inkchain. Complete onchain tasks to earn XP and unlock seasonal rewards.'
    },
    {
        question: 'Is this official or endorsed by Ink?',
        answer: 'No. Ink QuestHUB is an independent community project, not affiliated with Ink or Kraken.'
    },
    {
        question: 'What do I get from earning XP?',
        answer: 'XP increases your leaderboard rank and unlocks Season 1 milestones: badges, Discord roles, raffle entries, and exclusive NFT drops.'
    },
    {
        question: 'How is quest completion verified?',
        answer: 'We check onchain activity for your wallet (bridges, swaps, mints, etc.). Some quests may require signing a message or linking social accounts.'
    },
    {
        question: 'Which networks are supported?',
        answer: 'Inkchain ecosystem including Brid.gg, Bungee, Portal, Across, Curve, DyorSwap, InkySwap, NFTs2Me, ZNS, and more.'
    },
    {
        question: 'Are there any fees?',
        answer: 'No protocol fees. You pay normal gas fees and any protocol fees when interacting with dApps.'
    },
    {
        question: 'Is this safe?',
        answer: 'Quests use curated partner contracts. You keep full wallet control. Never share your seed phrase and always verify URLs before signing.'
    }
];

function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#13091f] hover:border-purple-500/30 transition-all duration-300">
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-medium text-purple-100 group-hover:text-white transition-colors">
                    {item.question}
                </span>
                <span className={`text-purple-400 text-2xl transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}>
                    ↓
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-6 pt-0">
                    <p className="text-base text-gray-400 leading-relaxed max-w-3xl">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 space-y-2">
                    <h2 className="text-3xl font-bold text-white">FAQ</h2>
                    <p className="text-gray-400">Common questions about QuestHUB</p>
                </div>

                {/* Items */}
                <div className="space-y-3">
                    {FAQ_ITEMS.map((item, index) => (
                        <FAQItemComponent
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>


            </div>
        </div>
    );
}
