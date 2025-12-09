export interface LeaderboardUser {
    rank: number;
    address: string;
    displayName?: string;
    xp: number;
    questsCompleted: number;
    badges: string[];
    avatar?: string;
}

// Helper to generate consistent mock users
const generateMockUsers = (count: number): LeaderboardUser[] => {
    const users: LeaderboardUser[] = [];
    const seedAddresses = [
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c',
        '0x1234567890123456789012345678901234567890', '0xabcdef1234567890abcdef1234567890abcdef12', '0x9876543210987654321098765432109876543210',
        '0x4567890123456789012345678901234567890123', '0xfedcba0987654321fedcba0987654321fedcba09', '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222'
    ];

    // Top users fixed for consistency
    const topNames = ['InkMaster', 'ChainExplorer', 'DeFiNinja', 'BridgeMaster', 'QuestSeeker', 'SwapKing', 'NFTCollector', 'YieldFarmer', 'SocialButterfly', 'InkPioneer'];

    for (let i = 0; i < count; i++) {
        const rank = i + 1;
        // Curve: fast drop at start, then long tail
        // Base: 5000. Drop: exponential decay-ish.
        // Formula: 5000 * (0.95 ^ i) but flattened at end
        let xp = Math.floor(5000 * Math.pow(0.96, i));
        if (xp < 100) xp = Math.max(50, 200 - i); // Minimum floor around 50

        // Randomized variation for natural look
        const startXp = 5800;
        if (i === 0) xp = startXp;
        else xp = Math.floor(startXp * (1000 / (1000 + i * 15)));

        users.push({
            rank,
            address: i < seedAddresses.length ? seedAddresses[i] : `0x${Math.random().toString(16).substr(2, 40)}`.padEnd(42, '0'),
            displayName: i < topNames.length ? topNames[i] : undefined,
            xp,
            questsCompleted: Math.max(1, Math.floor(xp / 250)),
            badges: i < 3 ? ['🏆', '⚡'] : i < 10 ? ['⚡'] : [],
            avatar: ['🦑', '🐙', '🦈', '🐳', '🦀', '🐠', '🐡', '🦞', '🐚'][i % 9]
        });
    }
    return users;
};

export const LEADERBOARD_DATA: LeaderboardUser[] = generateMockUsers(100);

export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getRankBadge(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
}
