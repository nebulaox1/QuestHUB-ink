import { QUESTS } from '@/data/quests';
import Link from 'next/link';
import QuestPageContent from '@/components/quest/QuestPageContent';

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params in Server Component (Next.js 15+)
    const { id } = await params;
    const quest = QUESTS[id];

    if (!quest) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-white">Quest not found</h1>
                <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                    ← Back to Quests
                </Link>
            </div>
        );
    }

    return <QuestPageContent quest={quest} />;
}
