'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

interface QuestVerifyProps {
    questId: string;
    onVerify?: (xp: number) => void;
    isReady: boolean;
    isAlreadyCompleted?: boolean;
}

export default function QuestVerify({ questId, onVerify, isReady, isAlreadyCompleted = false }: QuestVerifyProps) {
    const { address, isConnected } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();

    const showCompletedState = isCompleted || isAlreadyCompleted;

    const handleVerify = async () => {
        if (!isConnected || !address) {
            setError('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/quests/${questId}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsCompleted(true);
                if (onVerify) onVerify(data.xp);
                router.refresh();
            } else if (data.error === 'Quest already completed') {
                // If backend says it's already done (but local storage forgot), restore completed state
                setIsCompleted(true);
                if (onVerify) onVerify(0); // 0 XP because already claimed
                router.refresh();
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showCompletedState) {
        return (
            <div className="bg-gradient-to-br from-green-500/10 to-[#1e1030] border border-green-500/20 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                        ✓
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Quest Completed!</h3>
                    <p className="text-green-200/60 max-w-sm mx-auto">
                        {isAlreadyCompleted
                            ? "You have already mastered this quest and claimed your XP."
                            : "Excellent work! You've verified your actions and claimed your XP."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="transition-all duration-500">
            <div className="bg-[#1e1030] border border-purple-500/30 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Ready to Verify?</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Once you've completed all steps, verify your onchain actions to claim your XP reward.
                </p>

                <div className="max-w-xs mx-auto space-y-4">
                    <button
                        onClick={handleVerify}
                        disabled={isLoading || !isConnected || !isReady}
                        className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group
                            ${!isReady
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                : isLoading
                                    ? 'bg-gray-700 text-gray-400 cursor-wait'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105'
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <span>Verify Completion</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
