'use client';

import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#0d0618]">
            {/* Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[280px_1fr] gap-12">

                {/* Sidebar Navigation */}
                <aside className="hidden lg:block space-y-8">
                    <div className="sticky top-24 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-purple-100 uppercase tracking-wider">Contents</h3>
                            <nav className="space-y-1">
                                <a href="#for-users" className="block px-3 py-2 text-sm text-purple-200/70 hover:text-purple-400 hover:bg-purple-500/5 rounded-lg transition-colors">
                                    For Users
                                </a>
                                <a href="#for-partners" className="block px-3 py-2 text-sm text-purple-200/70 hover:text-purple-400 hover:bg-purple-500/5 rounded-lg transition-colors">
                                    For Partners & Builders
                                </a>
                                <a href="#technical" className="block px-3 py-2 text-sm text-purple-200/70 hover:text-purple-400 hover:bg-purple-500/5 rounded-lg transition-colors">
                                    Technical Overview
                                </a>
                                <a href="#verification" className="block px-3 py-2 text-sm text-purple-200/70 hover:text-purple-400 hover:bg-purple-500/5 rounded-lg transition-colors">
                                    Verification Process
                                </a>
                                <a href="#disclaimer" className="block px-3 py-2 text-sm text-purple-200/70 hover:text-purple-400 hover:bg-purple-500/5 rounded-lg transition-colors">
                                    Disclaimer
                                </a>
                            </nav>
                        </div>

                        {/* Mini CTA */}
                        <div className="p-4 rounded-xl bg-[#13091f] border border-[rgba(139,92,246,0.15)]">
                            <p className="text-xs text-purple-300/60 mb-3">Ready to start?</p>
                            <Link
                                href="/"
                                className="block w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold text-center rounded-lg transition-all duration-300"
                            >
                                Explore Quests →
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="space-y-16">
                    {/* Header */}
                    <div className="space-y-6 border-b border-[rgba(139,92,246,0.15)] pb-8">
                        <div className="flex items-center gap-2 text-sm text-purple-300/50 mb-4">
                            <Link href="/" className="hover:text-purple-300 transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-purple-100">Documentation</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-100 via-white to-purple-200 bg-clip-text">
                            Ink QuestHUB Documentation
                        </h1>
                        <p className="text-lg text-purple-200/70 leading-relaxed max-w-3xl">
                            A community-built quest platform for exploring dApps across Inkchain and the Superchain.
                            Independent project—not affiliated with Ink or Kraken.
                        </p>
                    </div>

                    {/* Mobile Table of Contents */}
                    <div className="lg:hidden bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-purple-100 mb-4">Table of Contents</h2>
                        <ul className="space-y-3 text-purple-200/70">
                            <li><a href="#for-users" className="hover:text-purple-400 transition-colors">For Users</a></li>
                            <li><a href="#for-partners" className="hover:text-purple-400 transition-colors">For Partners & Builders</a></li>
                            <li><a href="#technical" className="hover:text-purple-400 transition-colors">Technical Overview</a></li>
                            <li><a href="#verification" className="hover:text-purple-400 transition-colors">Verification Process</a></li>
                            <li><a href="#disclaimer" className="hover:text-purple-400 transition-colors">Disclaimer</a></li>
                        </ul>
                    </div>

                    {/* For Users */}
                    <section id="for-users" className="space-y-8 scroll-mt-24">
                        <h2 className="text-3xl font-bold text-purple-100 flex items-center gap-3">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                            For Users
                        </h2>

                        <div className="space-y-6">
                            {/* What are Quests */}
                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-purple-100 mb-4">What are Quests?</h3>
                                <p className="text-purple-200/70 leading-relaxed">
                                    Quests are curated onchain tasks that help you explore dApps in the Ink ecosystem.
                                    Each involves a specific action (bridging, swapping, minting, etc.) that can be verified onchain.
                                    Complete a quest, earn XP, and climb the leaderboard.
                                </p>
                            </div>

                            {/* XP, Seasons & Leaderboards */}
                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 space-y-6 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-purple-100">XP, Seasons & Leaderboards</h3>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-100">XP (Experience Points)</h4>
                                        <p className="text-sm text-purple-200/60">
                                            Each quest awards XP based on difficulty and time. XP is your score for the current season.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-100">Seasons</h4>
                                        <p className="text-sm text-purple-200/60">
                                            Time-limited periods (e.g., Season 1 runs until March 31, 2025). Seasonal XP resets each season.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-100">Leaderboards</h4>
                                        <p className="text-sm text-purple-200/60">
                                            Rankings by seasonal XP. View "This Season," "This Week," or "All Time" leaderboards.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Rewards */}
                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 space-y-4 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-purple-100">What Can You Earn?</h3>
                                <p className="text-purple-200/70">Earning XP unlocks seasonal milestones:</p>
                                <ul className="space-y-3 text-purple-200/70 ml-2">
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                        <span><strong className="text-purple-100">500 XP:</strong> Early Adopter badge + Discord role</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                        <span><strong className="text-purple-100">1,500 XP:</strong> Quest Master badge + raffle entry</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                        <span><strong className="text-purple-100">5,000 XP:</strong> Legend status + exclusive NFT drop</span>
                                    </li>
                                </ul>
                                <p className="text-sm text-purple-300/50 mt-4 pt-4 border-t border-purple-500/10">
                                    Future seasons may offer partner airdrops, early access, or governance participation.
                                    We do not promise or distribute tokens.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* For Partners & Builders */}
                    <section id="for-partners" className="space-y-8 scroll-mt-24">
                        <h2 className="text-3xl font-bold text-purple-100 flex items-center gap-3">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                            For Partners & Builders
                        </h2>

                        <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 space-y-6 hover:border-purple-500/30 transition-all duration-300">
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-purple-100">List Your Quest</h3>
                                <p className="text-purple-200/70">
                                    Grow your dApp's user base by submitting a quest to QuestHUB.
                                </p>
                            </div>

                            {/* 3-Step Process */}
                            <div className="grid md:grid-cols-3 gap-8 mt-6">
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-100 mb-2">Prepare Details</h4>
                                        <p className="text-sm text-purple-200/60">
                                            Define title, description, steps, minimum amounts, chains, contract addresses, and risk disclosures.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-100 mb-2">Submit Proposal</h4>
                                        <p className="text-sm text-purple-200/60 mb-4">
                                            Send your quest details including project name, logo, and contact info.
                                        </p>
                                        <a href="#" className="inline-block px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-all">
                                            Submit Proposal
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-100 mb-2">Review & Launch</h4>
                                        <p className="text-sm text-purple-200/60">
                                            We review submissions within 48-72 hours. Once approved, your quest goes live.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quest Design Guidelines */}
                        <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 space-y-6 hover:border-purple-500/30 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-purple-100">Quest Design Guidelines</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-purple-100 mb-3">Recommended XP Ranges</h4>
                                    <ul className="space-y-2 text-sm text-purple-200/70">
                                        <li className="flex items-center gap-2">
                                            <span className="text-purple-400">•</span>
                                            <span>Easy (5-10 min): 100-300 XP</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-purple-400">•</span>
                                            <span>Medium (10-20 min): 300-600 XP</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-purple-400">•</span>
                                            <span>Hard (20+ min): 600-1,000 XP</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-purple-100 mb-3">Safety & Transparency</h4>
                                    <p className="text-sm text-purple-200/70">
                                        All quests must use verified contracts and clearly disclose risks.
                                        We do not list unaudited or suspicious protocols.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Overview */}
                    <section id="technical" className="space-y-8 scroll-mt-24">
                        <h2 className="text-3xl font-bold text-purple-100 flex items-center gap-3">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                            Technical Overview
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="font-semibold text-purple-100 mb-2">Frontend</h3>
                                <p className="text-sm text-purple-200/60">
                                    Next.js 14, TypeScript, Tailwind CSS, and RainbowKit for wallet connection.
                                </p>
                            </div>

                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="font-semibold text-purple-100 mb-2">Wallet & Blockchain</h3>
                                <p className="text-sm text-purple-200/60">
                                    Powered by wagmi and viem. Supports all major wallets.
                                </p>
                            </div>

                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="font-semibold text-purple-100 mb-2">Verification Pipeline</h3>
                                <p className="text-sm text-purple-200/60">
                                    Queries blockchain logs for your wallet to verify specific events and validate criteria.
                                </p>
                            </div>

                            <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
                                <h3 className="font-semibold text-purple-100 mb-2">Data & Storage</h3>
                                <p className="text-sm text-purple-200/60">
                                    User progress stored in Prisma + PostgreSQL. Only your wallet address is tracked.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Verification & Troubleshooting */}
                    <section id="verification" className="space-y-8 scroll-mt-24">
                        <h2 className="text-3xl font-bold text-purple-100 flex items-center gap-3">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                            Verification Process
                        </h2>

                        <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-8 space-y-6 hover:border-purple-500/30 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-purple-100">How Verification Works</h3>
                            <p className="text-purple-200/70">
                                When you click "Verify," we query the blockchain for transactions from your wallet, checking:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-3 text-purple-200/70">
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">✓</span>
                                    <span>Transactions from your wallet</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">✓</span>
                                    <span>Contract interactions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">✓</span>
                                    <span>Event logs (Swap, Transfer)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">✓</span>
                                    <span>Amounts and timestamps</span>
                                </li>
                            </ul>
                        </div>


                    </section>

                    {/* Disclaimer */}
                    <section id="disclaimer" className="space-y-8 scroll-mt-24">
                        <h2 className="text-3xl font-bold text-purple-100 flex items-center gap-3">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                            Disclaimer
                        </h2>

                        <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-8 space-y-4">
                            <h3 className="text-yellow-500 font-semibold flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Legal & Risk Disclosure
                            </h3>
                            <div className="text-sm text-yellow-200/60 space-y-3 leading-relaxed">
                                <p>
                                    <strong className="text-yellow-500">Onchain Risk:</strong> Interacting with smart contracts carries risks including bugs,
                                    impermanent loss, volatility, and potential loss of funds. You are solely responsible for your assets.
                                    Never share your seed phrase.
                                </p>
                                <p>
                                    <strong className="text-yellow-500">No Financial Advice:</strong> Nothing on QuestHUB constitutes financial, investment, or legal advice.
                                    All content is educational only. Always DYOR.
                                </p>
                                <p>
                                    <strong className="text-yellow-500">Independence:</strong> Ink QuestHUB is a community project, not affiliated with or endorsed by Ink,
                                    Kraken, or any other entity.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Roadmap Note */}
                    <div className="bg-[#13091f] border border-[rgba(139,92,246,0.15)] rounded-xl p-6 text-center">
                        <p className="text-sm text-purple-200/60">
                            <strong className="text-purple-100">Ongoing Development:</strong> QuestHUB is actively maintained.
                            Check our <a href="#" className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30 underline-offset-2">Discord</a> for updates and roadmap.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
