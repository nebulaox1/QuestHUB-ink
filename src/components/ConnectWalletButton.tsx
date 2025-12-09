'use client';

import React from 'react';

interface ConnectWalletButtonProps {
    isConnected: boolean;
    isLoading?: boolean;
    address?: string;
    onClick: () => void;
    className?: string;
}

const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * ConnectWalletButton - Kintsu-inspired design for Ink QuestHUB
 * 
 * Features:
 * - Dark purple/ink base (#0a0514)
 * - Soft border and inner shadow
 * - Hover: Scale up (1.03), Purple Glow, Shimmer Sweep
 * - Active: Scale down (0.98), Pressed shadow
 * - Connected: Calmer style, shortened address
 */
export default function ConnectWalletButton({
    isConnected,
    isLoading,
    address,
    onClick,
    className = '',
}: ConnectWalletButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`
        relative group overflow-hidden
        px-6 py-2.5 rounded-full min-w-[160px]
        transition-all duration-300 ease-out
        border border-purple-500/20
        
        /* Default State: Dark Ink Base */
        bg-[#0a0514]
        text-purple-100
        shadow-[0_0_0_1px_rgba(139,92,246,0.05),0_4px_12px_rgba(0,0,0,0.2)]

        /* Hover State: Scale & Glow */
        hover:scale-[1.03]
        hover:border-purple-400/40
        hover:shadow-[0_0_20px_rgba(139,92,246,0.25),0_0_40px_rgba(167,139,250,0.1)]
        
        /* Active State: Press */
        active:scale-[0.98]
        active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]

        /* Connected State Overrides */
        ${isConnected ? 'bg-purple-950/20 border-purple-500/10 hover:border-purple-500/30' : ''}
        
        /* Loading State */
        ${isLoading ? 'opacity-80 cursor-wait' : ''}

        ${className}
      `}
        >
            {/* Shimmer Effect (Hover Only) */}
            <div
                className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
                style={{ content: '""' }}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-cyan-500/5 opacity-50 pointer-events-none" />

            {/* Content */}
            <span className="relative z-20 flex items-center justify-center gap-2 font-medium text-sm">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Connecting...</span>
                    </>
                ) : isConnected && address ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"></span>
                        <span className="font-mono tracking-wide text-purple-100">{shortenAddress(address)}</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Connect Wallet</span>
                    </>
                )}
            </span>
        </button>
    );
}
