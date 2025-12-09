export type QuestCategory = 'DeFi' | 'Bridge' | 'Social' | 'NFT' | 'Gaming';
export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestStep {
    title: string;
    description: string;
    actionLabel?: string;
    helperText?: string;
    verification?: QuestVerification;
    startUrl?: string;
}



export interface QuestPartner {
    name: string;
    logo: string; // Emoji or URL
    verified: boolean;
    website?: string;
}


export interface QuestVerification {
    type: 'onchain' | 'manual' | 'api';
    chainId?: number;
    contractAddress?: string; // Can be string or string[] logic handled in verify.ts, but keeping string for now
    contracts?: string[]; // Alternative to single address
    eventAbi?: any;
    eventName?: string;
    minAmount?: string;
    tokenDecimals?: number;
    argName?: string; // e.g., 'to' or 'sender'
    eventSignatureHash?: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    xp: number;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    timeEstimate: string; // e.g., "5 min"
    network: string; // e.g., "Inkchain", "Optimism"
    partner: QuestPartner;
    steps: QuestStep[];
    status: 'active' | 'completed' | 'locked';
    externalUrl?: string; // Direct link to the dApp
    completions?: number; // Total number of users who completed this quest
    brandColor?: string; // Primary brand color for accents
    brandGradient?: string; // Gradient background

    // Verification Fields
    verification?: QuestVerification | QuestVerification[];
    hidden?: boolean;
}

export const QUESTS: Record<string, Quest> = {
    // BRIDGE QUESTS
    '1': {
        id: '1',
        title: 'Bridge via Brid.gg',
        description: 'Bridge ETH to Inkchain using Brid.gg - the fastest bridge for Inkchain.',
        xp: 500,
        category: 'Bridge',
        difficulty: 'Easy',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 12450,
        brandColor: '#A79DEE',
        brandGradient: 'linear-gradient(90deg, #A79DEE 0%, #121212 100%)',
        externalUrl: 'https://www.brid.gg/ink?amount=&originChainId=1&token=ETH',
        partner: {
            name: 'Brid.gg',
            logo: '/images/bridgg-logo.png',
            verified: true,
            website: 'https://www.brid.gg/'
        },
        hidden: true,

        steps: [
            {
                title: 'Bridge ETH',
                description: 'Bridge ETH from Ethereum to Inkchain.',
                startUrl: 'https://www.brid.gg/ink?amount=&originChainId=1&token=ETH',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x0000000000000000000000000000000000000000', // TODO: Add Brid.gg contract
                    eventName: 'Bridge',
                    argName: 'sender',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
                        ],
                        name: 'Bridge',
                        type: 'event'
                    }
                }
            },


        ],

    },
    '2': {
        id: '2',
        title: 'Bridge via Bungee',
        description: 'Use Bungee Exchange to bridge assets from Base to Inkchain.',
        xp: 500,
        category: 'Bridge',
        difficulty: 'Easy',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 8900,
        brandColor: '#FFD219',
        brandGradient: 'linear-gradient(90deg, #FFD219 0%, #1F2124 100%)',
        externalUrl: 'https://www.bungee.exchange/?fromChainId=8453&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=57073&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        partner: {
            name: 'Bungee',
            logo: '/images/bungee-logo.png',
            verified: true,
            website: 'https://www.bungee.exchange/'
        },

        steps: [
            {
                title: 'Bridge Assets',
                description: 'Bridge from Ethereum to Inkchain.',
                startUrl: 'https://www.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=57073&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                verification: {
                    type: 'onchain',
                    chainId: 1, // Ethereum Mainnet
                    contractAddress: '0xbd4abb321138e8eddc399ce64e66451294325a14', // Verified from User Tx
                    eventName: 'BridgeRefuel', // 0x97ef...
                    argName: 'sender',
                    eventSignatureHash: '0x97efc519b9020a140ffe13878e03d340b976676090bc7fe3e33191192df7c72c',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                            { indexed: false, internalType: 'address', name: 'token', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'toChainId', type: 'uint256' },
                            { indexed: false, internalType: 'bytes32', name: 'bridgeName', type: 'bytes32' },
                            { indexed: false, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'receiver', type: 'address' },
                            { indexed: false, internalType: 'bytes32', name: 'metadata', type: 'bytes32' }
                        ],
                        name: 'SocketBridge',
                        type: 'event'
                    }
                }
            },


        ],

    },
    '3': {
        id: '3',
        title: 'Bridge via Portal Bridge',
        description: 'Use Wormhole\'s Portal Bridge to transfer assets to Inkchain.',
        xp: 750,
        category: 'Bridge',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 3400,
        brandColor: '#AFA7F6',
        brandGradient: 'linear-gradient(90deg, #AFA7F6 0%, #17161C 100%)',
        externalUrl: 'https://portalbridge.com/',
        partner: {
            name: 'Portal Bridge',
            logo: '/images/wormhole-logo.png',
            verified: true,
            website: 'https://portalbridge.com/'
        },
        hidden: true,

        steps: [
            {
                title: 'Select Chains',
                description: 'Choose your source chain and Inkchain as destination.',
                startUrl: 'https://portalbridge.com/'
            },


        ],
        verification: {
            type: 'onchain',
            chainId: 57073,
            contractAddress: '0x0000000000000000000000000000000000000000', // TODO: Add Portal contract
            eventName: 'Transfer',
            argName: 'from',
            eventAbi: {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
                ],
                name: 'Transfer',
                type: 'event'
            }
        }
    },
    '4': {
        id: '4',
        title: 'Bridge via Rhino.fi',
        description: 'Bridge ETH from Base to Inkchain using Rhino.fi.',
        xp: 500,
        category: 'Bridge',
        difficulty: 'Easy',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 5600,
        brandColor: '#E96C19',
        brandGradient: 'linear-gradient(90deg, #F7F6F3 0%, #E96C19 100%)',
        externalUrl: 'https://app.rhino.fi/bridge?mode=pay&chainIn=BASE&chainOut=INK&token=ETH&tokenOut=ETH',
        partner: {
            name: 'Rhino.fi',
            logo: '/images/rhino-logo.png',
            verified: true,
            website: 'https://app.rhino.fi/'
        },
        hidden: true,

        steps: [
            {
                title: 'Bridge ETH',
                description: 'Bridge ETH from Base to Inkchain.',
                startUrl: 'https://app.rhino.fi/bridge?mode=pay&chainIn=BASE&chainOut=INK&token=ETH&tokenOut=ETH',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x2f59E9086ec8130E21BD052065a9E6B2497bb102', // Rhino.fi Contract
                    eventName: 'Deposit',
                    argName: 'user',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
                        ],
                        name: 'Deposit',
                        type: 'event'
                    }
                }
            },


        ],

    },
    '5': {
        id: '5',
        title: 'Bridge via Across Protocol',
        description: 'Use Across Protocol to bridge and swap assets to Inkchain.',
        xp: 500,
        category: 'Bridge',
        difficulty: 'Easy',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 7200,
        brandColor: '#6CF9D8',
        brandGradient: 'linear-gradient(90deg, #2D2E33 0%, #6CF9D8 100%)',
        externalUrl: 'https://app.across.to/bridge-and-swap',
        partner: {
            name: 'Across',
            logo: '/images/across-logo.png',
            verified: true,
            website: 'https://app.across.to/'
        },

        steps: [
            {
                title: 'Bridge',
                description: 'Bridge assets to Inkchain.',
                startUrl: 'https://app.across.to/bridge-and-swap',
                verification: {
                    type: 'onchain',
                    chainId: 8453, // Base
                    contractAddress: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64', // Across SpokePool on Base (Verified from tx logs)
                    eventName: 'V3FundsDeposited',
                    argName: 'depositor',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'inputToken', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'outputToken', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'destinationChainId', type: 'uint256' },
                            { indexed: false, internalType: 'uint32', name: 'depositId', type: 'uint32' },
                            { indexed: false, internalType: 'uint32', name: 'quoteTimestamp', type: 'uint32' },
                            { indexed: false, internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
                            { indexed: false, internalType: 'uint32', name: 'exclusivityDeadline', type: 'uint32' },
                            { indexed: true, internalType: 'address', name: 'depositor', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'exclusiveRelayer', type: 'address' }
                        ],
                        name: 'V3FundsDeposited',
                        type: 'event'
                    },
                    eventSignatureHash: '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3'
                }
            },


        ],

    },

    // DEFI QUESTS
    '6': {
        id: '6',
        title: 'Swap on DyorSwap',
        description: 'Perform your first swap on DyorSwap, Inkchain\'s premier DEX.',
        xp: 500,
        category: 'DeFi',
        difficulty: 'Easy',
        timeEstimate: '3 min',
        network: 'Inkchain',
        status: 'active',
        completions: 15420,
        brandColor: '#0780F7',
        brandGradient: 'linear-gradient(90deg, #0780F7 0%, #E4EFF3 100%)',
        externalUrl: 'https://dyorswap.finance/?chainId=57073',
        partner: {
            name: 'DyorSwap',
            logo: '/images/dyorswap-logo.png',
            verified: true,
            website: 'https://dyorswap.finance'
        },

        steps: [
            {
                title: 'Swap Tokens',
                description: 'Swap any amount of tokens.',
                startUrl: 'https://dyorswap.finance/?chainId=57073',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x73a09cd53871B2AC4F5e08B89Eb2E25e1959d92A', // DyorSwap LP Address
                    eventName: 'Swap',
                    argName: 'to', // Filter by the recipient (user) instead of sender (router)
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
                            { indexed: true, internalType: 'address', name: 'to', type: 'address' }
                        ],
                        name: 'Swap',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '7': {
        id: '7',
        title: 'Swap on Curve Finance',
        description: 'Trade stablecoins on Curve Finance\'s Inkchain deployment.',
        xp: 750,
        category: 'DeFi',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 9800,
        brandColor: '#2563EB', // Keeping blue for accent
        brandGradient: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e, #3b82f6)', // Rainbow approximation
        externalUrl: 'https://www.curve.finance/dex/ink/swap',
        partner: {
            name: 'Curve',
            logo: '/images/curve-logo.png',
            verified: true,
            website: 'https://www.curve.finance'
        },

        steps: [
            {
                title: 'Swap Stablecoins',
                description: 'Swap stablecoins with low slippage.',
                startUrl: 'https://www.curve.finance/dex/ink/swap',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0xd7E72f3615aa65b92A4DBdC211E296a35512988B', // Curve Contract
                    eventName: 'TokenExchange',
                    argName: 'buyer',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
                            { indexed: false, internalType: 'int128', name: 'sold_id', type: 'int128' },
                            { indexed: false, internalType: 'uint256', name: 'tokens_sold', type: 'uint256' },
                            { indexed: false, internalType: 'int128', name: 'bought_id', type: 'int128' },
                            { indexed: false, internalType: 'uint256', name: 'tokens_bought', type: 'uint256' }
                        ],
                        name: 'TokenExchange',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '8': {
        id: '8',
        title: 'Swap on InkySwap',
        description: 'Trade tokens on InkySwap, a native Inkchain DEX.',
        xp: 500,
        category: 'DeFi',
        difficulty: 'Easy',
        timeEstimate: '3 min',
        network: 'Inkchain',
        status: 'active',
        completions: 11200,
        brandColor: '#FF6940',
        brandGradient: 'linear-gradient(90deg, #FF6940 0%, #0F0F0F 100%)',
        externalUrl: 'https://inkyswap.com/swap',
        partner: {
            name: 'InkySwap',
            logo: '/images/inky-logo.png',
            verified: true,
            website: 'https://inkyswap.com'
        },

        steps: [
            {
                title: 'Swap Tokens',
                description: 'Perform a token swap.',
                startUrl: 'https://inkyswap.com/swap',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    // contractAddress removed to allow verifying Swap on ANY pool
                    eventName: 'Swap',
                    argName: 'to',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
                            { indexed: true, internalType: 'address', name: 'to', type: 'address' }
                        ],
                        name: 'Swap',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '9': {
        id: '9',
        title: 'Create & Trade on InkyPump',
        description: 'Launch your own token or trade meme coins on InkyPump.',
        xp: 1000,
        category: 'DeFi',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 6500,
        brandColor: '#A855F7',
        brandGradient: 'linear-gradient(90deg, #1A1D1F 0%, #A855F7 100%)',
        externalUrl: 'https://inkypump.com/',
        partner: {
            name: 'InkyPump',
            logo: '/images/inky-logo.png',
            verified: true,
            website: 'https://inkypump.com/'
        },

        steps: [
            {
                title: 'Create Token',
                description: 'Launch your own meme coin.',
                startUrl: 'https://inkypump.com/',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x1D74317d760f2c72A94386f50E8D10f2C902b899', // InkyPump Deployer Contract
                    eventName: 'TokenCreated',
                    argName: 'creator',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'token', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'creator', type: 'address' }
                        ],
                        name: 'TokenCreated',
                        type: 'event'
                    }
                }
            },
            {
                title: 'Trade Token',
                description: 'Buy or sell existing tokens.',
                startUrl: 'https://inkypump.com/',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    // contractAddress removed to allow verifying Swap on ANY pool
                    eventName: 'Swap',
                    argName: 'to',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
                            { indexed: true, internalType: 'address', name: 'to', type: 'address' }
                        ],
                        name: 'Swap',
                        type: 'event'
                    }
                }
            },
        ],
    },
    '10': {
        id: '10',
        title: 'Explore Mavrk Ecosystem',
        description: 'Try Mavrk\'s suite of DeFi tools: bridge, create, tydro, or pay.',
        xp: 750,
        category: 'DeFi',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 4200,
        brandColor: '#C084FC',
        brandGradient: 'linear-gradient(90deg, #F3E7FF 0%, #000000 100%)',
        externalUrl: 'https://www.mavrk.ink/',
        partner: {
            name: 'Mavrk',
            logo: '/images/mavrk-logo.png',
            verified: true,
            website: 'https://www.mavrk.ink/'
        },
        hidden: true,

        steps: [
            {
                title: 'Bridge Assets',
                description: 'Bridge assets to Inkchain using Mavrk Bridge.',
                startUrl: 'https://www.mavrk.ink/bridge',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0xa5F565650890fBA1824Ee0F21EbBbF660a179934',
                    eventName: 'Deposit',
                    argName: 'sender',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
                        ],
                        name: 'Deposit',
                        type: 'event'
                    }
                }
            },
            {
                title: 'Launch Token',
                description: 'Deploy your own token via Mavrk Create.',
                startUrl: 'https://www.mavrk.ink/create',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x61F2976610970AFeDc1d83229e1E21bdc3D5cbE4',
                    eventName: 'TokenCreated',
                    argName: 'creator',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'token', type: 'address' }
                        ],
                        name: 'TokenCreated',
                        type: 'event'
                    }
                }
            },
            {
                title: 'Supply on Tydro',
                description: 'Supply assets to Tydro via Mavrk.',
                startUrl: 'https://www.mavrk.ink/tydro',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x2816cf15f6d2a220e789aa011d5ee4eb6c47feba', // Correct Tydro Pool Address
                    eventName: 'Supply',
                    argName: 'onBehalfOf',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'reserve', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'user', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'onBehalfOf', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                            { indexed: true, internalType: 'uint16', name: 'referralCode', type: 'uint16' }
                        ],
                        name: 'Supply',
                        type: 'event'
                    }
                }
            },
            {
                title: 'Stream Verification',
                description: 'Create a payment stream using USDG.',
                startUrl: 'https://www.mavrk.ink/pay',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0xa5F565650890fBA1824Ee0F21EbBbF660a179934',
                    eventName: 'CreateStream', // Guessing standard stream event
                    argName: 'sender',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                            { indexed: false, internalType: 'address', name: 'token', type: 'address' }
                        ],
                        name: 'CreateStream',
                        type: 'event'
                    }
                }
            },
        ],
    },
    '11': {
        id: '11',
        title: 'Swap on SuperSwap',
        description: 'Trade tokens on SuperSwap, an Inkchain DEX aggregator.',
        xp: 500,
        category: 'DeFi',
        difficulty: 'Easy',
        timeEstimate: '3 min',
        network: 'Inkchain',
        status: 'active',
        completions: 8100,
        brandColor: '#3B82F6',
        brandGradient: 'linear-gradient(90deg, #080D15 0%, #182A44 100%)',
        externalUrl: 'https://superswap.ink/',
        partner: {
            name: 'SuperSwap',
            logo: '/images/superswap-logo.png',
            verified: true,
            website: 'https://superswap.ink/'
        },
        hidden: true,

        steps: [
            {
                title: 'Swap Tokens',
                description: 'Swap any tokens.',
                startUrl: 'https://superswap.ink/',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x5839389261D1F38aac7c8E91DcDa85646bEcB414', // SuperSwap Contract (Verified)
                    eventName: 'Swapped',
                    argName: 'sender',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'srcToken', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'dstToken', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
                        ],
                        name: 'Swapped',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '12': {
        id: '12',
        title: 'Supply Assets on Tydro',
        description: 'Lend assets and earn yield on Tydro, Inkchain\'s lending protocol.',
        xp: 750,
        category: 'DeFi',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 18900,
        brandColor: '#4ADE80', // Lighter green for visibility
        brandGradient: 'linear-gradient(90deg, #3E4837 0%, #0F110E 100%)',
        externalUrl: 'https://app.tydro.com/',
        partner: {
            name: 'Tydro',
            logo: '/images/tydro-logo.png',
            verified: true,
            website: 'https://app.tydro.com/'
        },

        steps: [
            {
                title: 'Supply Assets',
                description: 'Deposit assets to earn yield.',
                startUrl: 'https://app.tydro.com/',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x2816cf15f6d2a220e789aa011d5ee4eb6c47feba', // Tydro Pool (L2PoolInstance Proxy)
                    eventName: 'Supply',
                    argName: 'onBehalfOf',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'reserve', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'user', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'onBehalfOf', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                            { indexed: true, internalType: 'uint16', name: 'referralCode', type: 'uint16' }
                        ],
                        name: 'Supply',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '13': {
        id: '13',
        title: 'Trade on The Deep',
        description: 'Swap and deposit assets on The Deep, Inkchain\'s DeFi hub.',
        xp: 750,
        category: 'DeFi',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 2100,
        brandColor: '#AED4E4',
        brandGradient: 'linear-gradient(90deg, #10142B 0%, #AED4E4 100%)',
        externalUrl: 'https://app.thedeep.ink',
        partner: {
            name: 'The Deep',
            logo: '/images/thedeep-logo.png',
            verified: true,
            website: 'https://app.thedeep.ink/'
        },

        steps: [
            {
                title: 'Swap or Deposit',
                description: 'Trade tokens or provide liquidity.',
                startUrl: 'https://app.thedeep.ink',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    // contractAddress: '0xF75584eF6673aD213a685a1B58Cc0330B8eA22Cf', // Dynamic Pool Address
                    eventName: 'Swap',
                    argName: 'to',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
                            { indexed: true, internalType: 'address', name: 'to', type: 'address' }
                        ],
                        name: 'Swap',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '14': {
        id: '14',
        title: 'Create Kraken Account',
        description: 'Sign up for Kraken to access Inkchain through a centralized exchange.',
        xp: 200,
        category: 'DeFi',
        difficulty: 'Easy',
        timeEstimate: '5 min',
        network: 'CEX',
        status: 'active',
        completions: 13500,
        brandColor: '#7132F5',
        brandGradient: 'linear-gradient(90deg, #FFFFFF 0%, #7132F5 100%)',
        externalUrl: 'https://inkonchain.com/verify',
        partner: {
            name: 'Kraken',
            logo: '/images/kraken-logo.png',
            verified: true,
            website: 'https://www.kraken.com/'
        },
        hidden: true,

        steps: [
            {
                title: 'Sign Up',
                description: 'Create your account and complete KYC.',
                startUrl: 'https://inkonchain.com/verify',
                verification: {
                    type: 'manual'
                }
            },
        ],
    },

    // SOCIAL & NFT QUESTS
    '15': {
        id: '15',
        title: 'Say GM on Inkchain',
        description: 'Join the Inkchain community and say GM (Good Morning) onchain!',
        xp: 500,
        category: 'Social',
        difficulty: 'Easy',
        timeEstimate: '1 min',
        network: 'Inkchain',
        status: 'active',
        completions: 25000,
        brandColor: '#8C1E60',
        brandGradient: 'linear-gradient(90deg, #8C1E60 0%, #312B85 100%)',
        externalUrl: 'https://gm.inkonchain.com/',
        partner: {
            name: 'GM Ink',
            logo: '/images/gm-logo.png',
            verified: true,
            website: 'https://gm.inkonchain.com/'
        },

        steps: [
            {
                title: 'Say GM',
                description: 'Post your GM message onchain.',
                startUrl: 'https://gm.inkonchain.com/',
                actionLabel: "I've posted GM",
                helperText: "Use the same wallet that is connected to Ink QuestHUB so verification works correctly.",
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x9F500d075118272B3564ac6Ef2c70a9067Fd2d3F', // GM Ink Contract
                    eventName: 'GM',
                    argName: 'sender',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
                        ],
                        name: 'GM',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '16': {
        id: '16',
        title: 'Launch NFT on NFTs2Me',
        description: 'Create and launch your own NFT collection on Inkchain via NFTs2Me.',
        xp: 750,
        category: 'NFT',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 1500,
        brandColor: '#6CB7E6',
        brandGradient: 'linear-gradient(90deg, #6CB7E6 0%, #FFFFFF 100%)', // Adjusted to not be pure white BG
        externalUrl: 'https://nfts2me.com/',
        partner: {
            name: 'NFTs2Me',
            logo: '/images/nfts2me-logo.png',
            verified: true,
            website: 'https://nfts2me.com/'
        },
        hidden: true,

        steps: [
            {
                title: 'Create Collection',
                description: 'Design and deploy your NFT collection.',
                startUrl: 'https://nfts2me.com/',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x00000000001594C61dD8a6804da9AB58eD2483ce', // NFTs2Me Factory
                    eventName: 'Transfer', // Events show Transfer (Mint of Ownership NFT), not CollectionDeployed
                    argName: 'to',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
                        ],
                        name: 'Transfer',
                        type: 'event'
                    }
                }
            },

        ],

    },
    '17': {
        id: '17',
        title: 'Trade NFTs on SquidMarket',
        description: 'Buy or sell NFTs on SquidMarket, Inkchain\'s NFT marketplace.',
        xp: 750,
        category: 'NFT',
        difficulty: 'Medium',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 3200,
        brandColor: '#7579E1',
        brandGradient: 'linear-gradient(90deg, #7579E1 0%, #0F0D0D 100%)',
        externalUrl: 'https://www.squidmarket.xyz/marketplace',
        partner: {
            name: 'SquidMarket',
            logo: '/images/squid-logo.png',
            verified: true,
            website: 'https://www.squidmarket.xyz/'
        },
        hidden: true,

        steps: [
            {
                title: 'Trade NFTs',
                description: 'Buy or list an NFT for sale.',
                startUrl: 'https://www.squidmarket.xyz/marketplace',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0x9eBf93fdBA9F32aCCAb3D6716322dcCd617a78F3', // SquidMarket Contract
                    eventName: 'TakerBid',
                    argName: 'taker',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: false, internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
                            { indexed: false, internalType: 'uint256', name: 'orderNonce', type: 'uint256' },
                            { indexed: true, internalType: 'address', name: 'taker', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'maker', type: 'address' },
                            { indexed: true, internalType: 'address', name: 'strategy', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'currency', type: 'address' },
                            { indexed: false, internalType: 'address', name: 'collection', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' }
                        ],
                        name: 'TakerBid',
                        type: 'event'
                    }
                }
            },

        ],

    },

    '18': {
        id: '18',
        title: 'Get Your .ink Domain',
        description: 'Register your personalized .ink domain name on Inkchain via ZNS.',
        xp: 1000,
        category: 'Social',
        difficulty: 'Hard',
        timeEstimate: '5 min',
        network: 'Inkchain',
        status: 'active',
        completions: 10500,
        brandColor: '#CBFC08',
        brandGradient: 'linear-gradient(135deg, #CBFC08 0%, #000000 100%)',
        externalUrl: 'https://zns.bio/search?chain=57073',
        partner: {
            name: 'ZNS',
            logo: '/images/zns-logo.png',
            verified: true,
            website: 'https://zns.bio/'
        },
        hidden: true,

        steps: [
            {
                title: 'Search Domain',
                description: 'Find and register your .ink domain.',
                startUrl: 'https://zns.bio/search?chain=57073',
                verification: {
                    type: 'onchain',
                    chainId: 57073,
                    contractAddress: '0xFb2Cd41a8aeC89EFBb19575C6c48d872cE97A0A5', // ZNS Contract
                    eventName: 'NameRegistered',
                    argName: 'owner',
                    eventAbi: {
                        anonymous: false,
                        inputs: [
                            { indexed: true, internalType: 'string', name: 'name', type: 'string' },
                            { indexed: true, internalType: 'bytes32', name: 'label', type: 'bytes32' },
                            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                            { indexed: false, internalType: 'uint256', name: 'cost', type: 'uint256' },
                            { indexed: false, internalType: 'uint256', name: 'expires', type: 'uint256' }
                        ],
                        name: 'NameRegistered',
                        type: 'event'
                    }
                }
            },

        ],

    },

};

export const QUEST_LIST = Object.values(QUESTS);
