'use client';

interface QuestProgressProps {
    totalSteps: number;
    currentStep: number;
}

export default function QuestProgress({ totalSteps, currentStep }: QuestProgressProps) {
    const progressPercentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100);

    return (
        <div className="bg-[#13091f]/50 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6 sticky top-24 z-20 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-3 text-sm">
                <h3 className="font-bold text-white flex items-center gap-2">
                    Quest Progress
                </h3>
                <div className="font-mono text-purple-200/60">
                    <span className="text-white font-bold">{currentStep}</span> of {totalSteps} steps <span className="mx-1">·</span> <span className="text-purple-400">{progressPercentage}%</span>
                </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                        width: `${progressPercentage}%`,
                        background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #d8b4fe 100%)'
                    }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                </div>
            </div>
        </div>
    );
}
