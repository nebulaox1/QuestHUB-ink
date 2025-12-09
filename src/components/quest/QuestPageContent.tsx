'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Quest } from '@/data/quests';
import QuestHeader from '@/components/quest/QuestHeader';
import QuestProgress from '@/components/quest/QuestProgress';
import QuestSteps from '@/components/quest/QuestSteps';
import QuestVerify from '@/components/quest/QuestVerify';
import { useUserProgress } from '@/context/UserProgressContext';

interface QuestPageContentProps {
    quest: Quest;
}

export default function QuestPageContent({ quest }: QuestPageContentProps) {
    const { isQuestCompleted, claimQuest } = useUserProgress();
    const { address } = useAccount();

    // State: Array of completed step indices
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Fetch completed steps on mount/address change
    useEffect(() => {
        if (!address) {
            setCompletedSteps([]);
            return;
        }

        const fetchSteps = async () => {
            try {
                const res = await fetch(`/api/quests/${quest.id}/verify/step?address=${address}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.completedIndices) {
                        setCompletedSteps(data.completedIndices);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch step completions", e);
            }
        };

        fetchSteps();
    }, [quest.id, address]);

    // Use optional chain/default to prevent crash if context is loading (though it shouldn't)
    const isCompleted = isQuestCompleted ? isQuestCompleted(quest.id) : false;

    useEffect(() => {
        if (isCompleted) {
            // mark all as completed if quest is done
            setCompletedSteps(quest.steps.map((_, i) => i));
        }
    }, [isCompleted, quest]);

    const totalSteps = quest.steps.length;
    const completedCount = completedSteps.length;

    // Ready if all steps are completed (indices 0 to total-1 exist in array)
    // Or just simple count check, assuming no duplicates
    const isReadyToVerify = completedCount === totalSteps;

    const handleStart = () => {
        document.getElementById('quest-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleStepComplete = (index: number) => {
        if (!completedSteps.includes(index)) {
            setCompletedSteps(prev => [...prev, index]);
        }
    };

    const handleVerifySuccess = (xp: number) => {
        claimQuest(quest.id, xp);
        // alert(`Quest Verified! You've received ${xp} XP!`);
    };

    const handleVerifyStep = async (stepIndex: number): Promise<{ success: boolean; error?: string }> => {
        if (!address) {
            return { success: false, error: 'Please connect your wallet' };
        }
        try {
            const res = await fetch(`/api/quests/${quest.id}/verify/step`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, stepIndex })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                handleStepComplete(stepIndex);
                if (data.xpAwarded) {
                    // Trigger a toast or UI update for XP? 
                    // Context will auto-sync eventually, or we can rely on page refresh for XP.
                }
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Verification failed' };
            }
        } catch (e) {
            console.error(e);
            return { success: false, error: 'Network error during verification' };
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-purple-200/40 font-medium">
                <Link href="/" className="hover:text-purple-200 transition-colors">Quests</Link>
                <span>/</span>
                <span className="text-purple-100">{quest.title}</span>
            </div>

            {/* Header */}
            <QuestHeader
                quest={quest}
                hasStarted={completedCount > 0}
                isCompleted={isCompleted}
                isClaimed={isCompleted}
                onStart={handleStart}
                onContinue={handleStart}
                onClaim={() => { }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-12">
                    <div id="quest-start">
                        <QuestProgress totalSteps={totalSteps} currentStep={completedCount} />
                    </div>

                    <div id="quest-steps">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-2xl font-bold text-white">Mission Steps</h2>
                            </div>

                            <QuestSteps
                                steps={quest.steps}
                                completedSteps={completedSteps}
                                onStepComplete={handleStepComplete}
                                onVerifyStep={handleVerifyStep}
                                partnerName={quest.partner?.name}
                                externalUrl={quest.externalUrl}
                                brandColor={quest.brandColor}
                                brandGradient={quest.brandGradient}
                            />
                        </div>


                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-[#13091f] border border-purple-500/20 rounded-xl p-6 shadow-lg shadow-purple-900/10">
                            <h3 className="text-purple-100 font-bold mb-2 flex items-center gap-2">
                                Why this quest?
                            </h3>
                            <p className="text-sm text-purple-200/70 leading-relaxed">
                                Interacting with key protocols like {quest.partner?.name || 'this one'} helps you build your onchain reputation and qualifies you for potential future rewards.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Progress */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-[#1e1030]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm">Mission Progress</span>
                        <span className="text-purple-400 font-bold text-sm">{Math.round((completedCount / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / totalSteps) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
