'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

interface VerifyButtonProps {
    questId: string;
    onVerify?: (xp: number) => void;
}

export default function VerifyButton({ questId, onVerify }: VerifyButtonProps) {
    const { address, isConnected } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();

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
                router.refresh(); // Refresh to update any server-side state if needed
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCompleted) {
        return (
            <button
                disabled
                className="w-full py-4 bg-green-500/20 border border-green-500 text-green-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-default"
            >
                <span>✓</span> Quest Completed
            </button>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleVerify}
                disabled={isLoading || !isConnected}
                className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2
          ${isLoading
                        ? 'bg-gray-700 text-gray-400 cursor-wait'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25'
                    }
          ${!isConnected && 'opacity-50 cursor-not-allowed'}
        `}
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                    </>
                ) : (
                    'Verify Quest Completion'
                )}
            </button>

            {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}
