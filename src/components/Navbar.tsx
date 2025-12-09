'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import ConnectWalletButton from './ConnectWalletButton';
import SearchModal from './SearchModal';
import InkStreakButton from './InkStreakButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const handleWalletClick = async () => {
        if (isConnected) {
            disconnect();
        } else {
            setIsConnecting(true);
            try {
                connect({ connector: injected() });
            } catch (error) {
                console.error('Failed to connect:', error);
            } finally {
                setTimeout(() => setIsConnecting(false), 500);
            }
        }
    };

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const navLinks = [
        { href: '/', label: 'Quests' },
        { href: '/leaderboard', label: 'Leaderboard' },
        { href: '/#faq', label: 'FAQ' },
        { href: '/docs', label: 'Docs' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#0d0618]/95 backdrop-blur-md border-b border-[rgba(139,92,246,0.15)] shadow-lg shadow-purple-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo + Brand */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-medium tracking-tight text-white/90">
                                    Ink
                                </span>
                                <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-white via-purple-200 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                    QuestHUB
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                                        ? 'text-purple-100 bg-purple-500/20 shadow-sm'
                                        : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-500/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Search + Connect Wallet */}
                    <div className="flex items-center gap-3">
                        {/* Search (Desktop) - Shrinks when not hovered */}
                        <button
                            onClick={() => setSearchModalOpen(true)}
                            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300/70 hover:bg-purple-500/15 hover:border-purple-500/30 hover:text-purple-200 hover:px-3 transition-all duration-300 group"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="hidden xl:inline whitespace-nowrap opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-300 overflow-hidden">Search</span>
                        </button>

                        {/* Ink Streak Button */}
                        <InkStreakButton />

                        {/* Connect Wallet */}
                        <div className="hidden md:block">
                            <ConnectWalletButton
                                isConnected={isConnected}
                                isLoading={isConnecting}
                                address={address}
                                onClick={handleWalletClick}
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-purple-300 hover:text-purple-100 hover:bg-purple-500/10 transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-purple-500/15 py-4 space-y-2">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                                        ? 'text-purple-100 bg-purple-500/20'
                                        : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-500/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Mobile Search */}
                        <button className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300/70 hover:bg-purple-500/15 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search quests...</span>
                        </button>

                        {/* Mobile Connect Wallet */}
                        <div className="pt-2">
                            <ConnectWalletButton
                                isConnected={isConnected}
                                isLoading={isConnecting}
                                address={address}
                                onClick={handleWalletClick}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </nav>
    );
}
