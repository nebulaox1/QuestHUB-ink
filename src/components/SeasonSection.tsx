'use client';

interface Milestone {
    xp: number;
    title: string;
    description: string;
    visualPos: number; // 0-100% position on the bar
}

interface SeasonSectionProps {
    userXP?: number;
}

// Adjusted visual positions to create a balanced look
const MILESTONES: Milestone[] = [
    { xp: 500, title: 'Early Adopter', description: 'Badge + Discord role', visualPos: 15 },
    { xp: 1500, title: 'Quest Master', description: 'Raffle entry + role', visualPos: 50 },
    { xp: 5000, title: 'Legend', description: 'Exclusive NFT drop', visualPos: 100 }
];

export default function SeasonSection({ userXP = 0 }: SeasonSectionProps) {
    // Logic to calculate visual progress % based on the non-linear milestone positions
    const getVisualProgress = (xp: number) => {
        if (xp >= 5000) return 100;
        if (xp <= 0) return 0;

        // 0 -> 500 XP  maps to  0% -> 15%
        if (xp < 500) {
            return (xp / 500) * 15;
        }
        // 500 -> 1500 XP maps to 15% -> 50%
        else if (xp < 1500) {
            const rangeProgress = (xp - 500) / (1500 - 500);
            return 15 + (rangeProgress * (50 - 15));
        }
        // 1500 -> 5000 XP maps to 50% -> 100%
        else {
            const rangeProgress = (xp - 1500) / (5000 - 1500);
            return 50 + (rangeProgress * (100 - 50));
        }
    };

    const progressPercent = getVisualProgress(userXP);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 md:p-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-purple-300 text-xs font-bold uppercase tracking-wider">Season 1 Active</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Season 1: Genesis Pass</h2>
                            <p className="text-gray-400 max-w-lg leading-relaxed">
                                Complete quests, refer friends, and maintain your streak to earn XP.
                                Unlock exclusive badges, Discord roles, and future rewards.
                            </p>
                            <a href="/docs" className="text-purple-400 hover:text-purple-300 text-sm font-medium hover:underline inline-block">
                                Learn what counts →
                            </a>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-3xl font-bold text-white mb-1">{userXP.toLocaleString()} XP</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">Current Progress</div>
                        </div>
                    </div>

                    {/* Visual Season Track */}
                    <div className="relative py-12 mb-8 mx-4 md:mx-0">
                        {/* Track Background */}
                        <div className="absolute top-1/2 left-0 right-0 h-4 bg-purple-900/20 rounded-full -translate-y-1/2 border border-white/5" />

                        {/* Progress Fill */}
                        <div
                            className="absolute top-1/2 left-0 h-4 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full -translate-y-1/2 shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Current Position Marker */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-purple-500 z-20" />
                            <div className="absolute right-0 bottom-full mb-3 translate-x-1/2 whitespace-nowrap">
                                <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                    You
                                </div>
                            </div>
                        </div>

                        {/* Milestones */}
                        {MILESTONES.map((milestone) => {
                            const isUnlocked = userXP >= milestone.xp;

                            return (
                                <div
                                    key={milestone.xp}
                                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center group"
                                    style={{ left: `${milestone.visualPos}%` }}
                                >
                                    {/* Tick Mark */}
                                    <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors duration-300 ${isUnlocked
                                        ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                                        : 'bg-[#13091f] border-gray-600 group-hover:border-gray-400'
                                        }`} />

                                    {/* Label */}
                                    <div className={`absolute top-full mt-4 flex flex-col items-center w-32 text-center pointer-events-none transition-all duration-300 ${
                                        // Slight horizontal shift adjustment nearest the edges
                                        milestone.visualPos > 90 ? '-translate-x-1/4' :
                                            milestone.visualPos < 10 ? 'translate-x-1/4' : ''
                                        }`}>
                                        <span className={`text-xs font-bold mb-0.5 transition-colors ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                            {milestone.title}
                                        </span>
                                        <span className="text-[10px] text-gray-600 font-mono">
                                            {milestone.xp} XP
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
