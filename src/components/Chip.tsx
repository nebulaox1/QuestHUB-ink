'use client';

interface ChipProps {
    children: React.ReactNode;
    variant?: 'default' | 'difficulty' | 'category' | 'status' | 'network';
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    category?: 'DeFi' | 'Bridge' | 'Social' | 'NFT' | 'Gaming';
    status?: 'active' | 'completed' | 'locked';
}

export default function Chip({ children, variant = 'default', difficulty, category, status }: ChipProps) {
    const baseStyles = 'px-2.5 py-1 rounded-md text-xs font-medium border inline-flex items-center gap-1';

    // Difficulty colors - Inkchain theme
    const difficultyColors = {
        Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    // Category colors - Inkchain theme
    const categoryColors = {
        DeFi: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        Bridge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        Social: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        NFT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        Gaming: 'bg-green-500/10 text-green-400 border-green-500/20',
    };

    // Status colors - Inkchain theme
    const statusColors = {
        active: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        locked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    let colorClass = 'bg-purple-500/10 text-purple-300/70 border-purple-500/20';

    if (variant === 'difficulty' && difficulty) {
        colorClass = difficultyColors[difficulty];
    } else if (variant === 'category' && category) {
        colorClass = categoryColors[category];
    } else if (variant === 'status' && status) {
        colorClass = statusColors[status];
    } else if (variant === 'network') {
        colorClass = 'bg-purple-500/10 text-purple-300/70 border-purple-500/20';
    }

    return (
        <span className={`${baseStyles} ${colorClass}`}>
            {children}
        </span>
    );
}
