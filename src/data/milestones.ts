export interface Milestone {
    id: string;
    name: string;
    description: string;
    xpRequired: number;
    nftImage: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
    benefits: string[];
}

export const MILESTONES: Milestone[] = [
    {
        id: 'explorer',
        name: 'Ink Explorer',
        description: 'Welcome to the Ink ecosystem! Your journey begins here.',
        xpRequired: 500,
        nftImage: '🌊',
        rarity: 'Common',
        benefits: [
            'Explorer Badge NFT',
            'Access to beginner quests',
            'Community recognition'
        ]
    },
    {
        id: 'adventurer',
        name: 'Ink Adventurer',
        description: 'You\'re making waves in the Ink ecosystem!',
        xpRequired: 1000,
        nftImage: '⚡',
        rarity: 'Common',
        benefits: [
            'Adventurer Badge NFT',
            'Exclusive Discord role',
            '5% XP boost on future quests'
        ]
    },
    {
        id: 'champion',
        name: 'Ink Champion',
        description: 'A true champion of the Superchain!',
        xpRequired: 2000,
        nftImage: '🔥',
        rarity: 'Rare',
        benefits: [
            'Champion Badge NFT',
            'Early access to new quests',
            '10% XP boost',
            'Special champion flair'
        ]
    },
    {
        id: 'master',
        name: 'Ink Master',
        description: 'Mastery of the Ink ecosystem achieved!',
        xpRequired: 3500,
        nftImage: '💎',
        rarity: 'Epic',
        benefits: [
            'Master Badge NFT',
            'Priority support',
            '15% XP boost',
            'Exclusive merch access',
            'Governance voting rights'
        ]
    },
    {
        id: 'legend',
        name: 'Ink Legend',
        description: 'Your name will be remembered in Ink history!',
        xpRequired: 5000,
        nftImage: '👑',
        rarity: 'Legendary',
        benefits: [
            'Legendary Badge NFT',
            'VIP Discord access',
            '25% XP boost',
            'Exclusive events invitation',
            'Custom profile customization',
            'Airdrop eligibility'
        ]
    },
    {
        id: 'mythic',
        name: 'Ink Deity',
        description: 'You have transcended mortal questers. A true deity of Ink!',
        xpRequired: 10000,
        nftImage: '✨',
        rarity: 'Mythic',
        benefits: [
            'Mythic Deity NFT',
            'Permanent Hall of Fame entry',
            '50% XP boost',
            'Direct team access',
            'Beta tester for new features',
            'Guaranteed airdrops',
            'Custom quest creation rights'
        ]
    }
];

export function getMilestonesForXP(xp: number): {
    achieved: Milestone[];
    next: Milestone | null;
    progress: number;
} {
    const achieved = MILESTONES.filter(m => xp >= m.xpRequired);
    const next = MILESTONES.find(m => xp < m.xpRequired) || null;

    let progress = 0;
    if (next) {
        const previousMilestone = achieved[achieved.length - 1];
        const previousXP = previousMilestone?.xpRequired || 0;
        const requiredXP = next.xpRequired - previousXP;
        const currentXP = xp - previousXP;
        progress = (currentXP / requiredXP) * 100;
    } else {
        progress = 100; // All milestones achieved
    }

    return { achieved, next, progress };
}

export function getRarityColor(rarity: Milestone['rarity']): string {
    switch (rarity) {
        case 'Common':
            return 'from-gray-400 to-gray-600';
        case 'Rare':
            return 'from-blue-400 to-blue-600';
        case 'Epic':
            return 'from-purple-400 to-purple-600';
        case 'Legendary':
            return 'from-yellow-400 to-orange-600';
        case 'Mythic':
            return 'from-pink-400 to-red-600';
        default:
            return 'from-gray-400 to-gray-600';
    }
}

export function getRarityGlow(rarity: Milestone['rarity']): string {
    switch (rarity) {
        case 'Common':
            return 'shadow-gray-500/50';
        case 'Rare':
            return 'shadow-blue-500/50';
        case 'Epic':
            return 'shadow-purple-500/50';
        case 'Legendary':
            return 'shadow-yellow-500/50';
        case 'Mythic':
            return 'shadow-pink-500/50';
        default:
            return 'shadow-gray-500/50';
    }
}
