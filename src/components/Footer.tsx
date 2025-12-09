'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-transparent to-[#0d0618]/50">
            {/* Main Footer */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent inline-block">
                                Ink QuestHUB
                            </h3>
                            <div className="h-1 w-12 bg-purple-500 rounded-full mt-2" />
                        </div>
                        <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                            The community-built gateway to the Inkchain ecosystem.
                            Discover dApps, complete onchain quests, and earn reputation.
                        </p>

                        {/* Socials Row */}
                        <div className="flex items-center gap-3">
                            {['x', 'discord', 'telegram'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all group"
                                    aria-label={social}
                                >
                                    <Image
                                        src={`/social/${social}.png`}
                                        alt={social}
                                        width={20}
                                        height={20}
                                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-8">
                        {/* Platform */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <Link href="/quests" className="text-gray-400 hover:text-purple-400 transition-colors">
                                        Explore Quests
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/leaderboard" className="text-gray-400 hover:text-purple-400 transition-colors">
                                        Leaderboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs" className="text-gray-400 hover:text-purple-400 transition-colors">
                                        How it Works
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <Link href="/#faq" className="text-gray-400 hover:text-purple-400 transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs" className="text-gray-400 hover:text-purple-400 transition-colors">
                                        Developer Docs
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                                        Terms & Privacy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>
                        © 2025 Ink QuestHUB. Community project — not affiliated with Ink or Kraken.
                    </p>
                    <p>
                        Built with ❤️ for Inkchain
                    </p>
                </div>
            </section>
        </footer>
    );
}
