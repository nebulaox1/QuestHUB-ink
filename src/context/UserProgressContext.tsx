'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { QUESTS } from '@/data/quests';

interface UserProgressState {
    xp: number;
    level: number;
    completedQuests: string[]; // List of Quest IDs
    stepCompletions: Record<string, number[]>; // Map of questId -> list of completed step indices
    claimQuest: (questId: string, xpReward: number) => void;
    isQuestCompleted: (questId: string) => boolean;
    getQuestProgress: (questId: string) => number; // Returns number of completed steps
}

const UserProgressContext = createContext<UserProgressState | undefined>(undefined);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const [xp, setXp] = useState(0);
    const [completedQuests, setCompletedQuests] = useState<string[]>([]);
    const [stepCompletions, setStepCompletions] = useState<Record<string, number[]>>({});

    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from API and localStorage on mount or address change
    useEffect(() => {
        setIsLoaded(false); // Reset load state on address change

        if (!address) {
            setXp(0);
            setCompletedQuests([]);
            setStepCompletions({});
            return;
        }

        const fetchProgress = async () => {
            let localCompleted: string[] = [];
            let localSteps: Record<string, number[]> = {};

            // 1. Get Local Storage Data
            const storedData = localStorage.getItem(`ink_quest_progress_${address}`);
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData);
                    localCompleted = parsed.completedQuests || [];
                    localSteps = parsed.stepCompletions || {};
                } catch (e) {
                    console.error("Failed to parse local progress", e);
                }
            }

            // 2. Get Server Data
            try {
                const res = await fetch(`/api/user/${address}`);
                if (res.ok) {
                    const serverData = await res.json();
                    const serverCompleted = serverData.completedQuests || [];
                    const serverSteps: Record<string, number[]> = serverData.stepCompletions || {};

                    // Merge Step Completions first (needed for validation)
                    const mergedSteps: Record<string, number[]> = { ...localSteps };
                    Object.keys(serverSteps).forEach(qid => {
                        const existing = new Set(mergedSteps[qid] || []);
                        serverSteps[qid].forEach(idx => existing.add(idx));
                        mergedSteps[qid] = Array.from(existing);
                    });
                    setStepCompletions(mergedSteps);

                    // Merge raw completed IDs
                    const rawCompletedIds = Array.from(new Set([...localCompleted, ...serverCompleted]));

                    // CRITICAL VALIDATION with HYBRID LEGACY SUPPORT:
                    // 1. If a quest has NO recorded steps (and is in the list), we assume it's a legacy completion -> KEEP IT.
                    // 2. If a quest HAS recorded steps (partial progress), we strictly enforce (Steps Done >= Total Steps).
                    // This creates a safe path for old completions while strictly validating new ones.
                    const validCompletedQuests = rawCompletedIds.filter(questId => {
                        const quest = QUESTS[questId];
                        if (!quest) return false;

                        // If quest has no steps (auto-complete type), accept it
                        if (!quest.steps || quest.steps.length === 0) return true;

                        // Check if we have enough completion records
                        const completedIndices = mergedSteps[questId] || [];

                        // Hybrid Logic:
                        if (completedIndices.length > 0) {
                            // If we have started tracking steps, we MUST have all of them.
                            return completedIndices.length >= quest.steps.length;
                        }

                        // If 0 steps recorded but marked complete previously, trust it (Legacy)
                        return true;
                    });

                    setCompletedQuests(validCompletedQuests);

                    // Recalculate XP based on VALID completed quests only
                    // This ensures XP matches the displayed completion status
                    let calculatedXp = 0;
                    validCompletedQuests.forEach(questId => {
                        const quest = QUESTS[questId];
                        if (quest) {
                            calculatedXp += quest.xp;
                        }
                    });
                    setXp(calculatedXp);

                } else {
                    // Fallback to local if API fails
                    // Apply same validation to local data
                    const mergedSteps = localSteps;
                    setStepCompletions(mergedSteps);

                    const validCompletedQuests = localCompleted.filter(questId => {
                        const quest = QUESTS[questId];
                        if (!quest) return false;
                        if (!quest.steps || quest.steps.length === 0) return true;

                        const completedIndices = mergedSteps[questId] || [];
                        if (completedIndices.length > 0) {
                            return completedIndices.length >= quest.steps.length;
                        }
                        return true;
                    });
                    setCompletedQuests(validCompletedQuests);

                    let calculatedXp = 0;
                    validCompletedQuests.forEach(questId => {
                        const quest = QUESTS[questId];
                        if (quest) {
                            calculatedXp += quest.xp;
                        }
                    });
                    setXp(calculatedXp);
                }
            } catch (err) {
                console.error("Failed to sync with server", err);
                // Fallback logic
                setStepCompletions(localSteps);
                const validCompletedQuests = localCompleted.filter(questId => {
                    const quest = QUESTS[questId];
                    if (!quest) return false;
                    if (!quest.steps || quest.steps.length === 0) return true;

                    const completedIndices = localSteps[questId] || [];
                    if (completedIndices.length > 0) {
                        return completedIndices.length >= quest.steps.length;
                    }
                    return true;
                });
                setCompletedQuests(validCompletedQuests);

                let calculatedXp = 0;
                validCompletedQuests.forEach(questId => {
                    const quest = QUESTS[questId];
                    if (quest) {
                        calculatedXp += quest.xp;
                    }
                });
                setXp(calculatedXp);
            } finally {
                setIsLoaded(true); // Mark as loaded so we can start saving updates
            }
        };

        fetchProgress();

        // Trigger background sync
        const runSync = async () => {
            try {
                const res = await fetch(`/api/user/${address}/sync`, { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.newCompletions && data.newCompletions.length > 0) {
                        console.log("Sync found new completions:", data.newCompletions);
                        // Refresh state
                        fetchProgress();
                    }
                }
            } catch (e) {
                console.warn("Background sync failed", e);
            }
        };

        // Delay sync slightly to prioritize UI load
        const timer = setTimeout(runSync, 2000);
        return () => clearTimeout(timer);

    }, [address]);

    // Save progress whenever it changes, BUT ONLY if loaded
    useEffect(() => {
        if (address && isLoaded) {
            localStorage.setItem(`ink_quest_progress_${address}`, JSON.stringify({
                xp,
                completedQuests,
                stepCompletions
            }));
        }
    }, [xp, completedQuests, stepCompletions, address, isLoaded]);

    // Derived level (simple formula: 1 level per 1000 XP)
    const level = Math.floor(xp / 1000) + 1;

    const claimQuest = (questId: string, xpReward: number) => {
        if (!completedQuests.includes(questId)) {
            setCompletedQuests(prev => [...prev, questId]);
            setXp(prev => prev + xpReward);
        }
    };

    const isQuestCompleted = (questId: string) => {
        return completedQuests.includes(questId);
    };

    const getQuestProgress = (questId: string) => {
        return stepCompletions[questId]?.length || 0;
    };

    return (
        <UserProgressContext.Provider value={{
            xp,
            level,
            completedQuests,
            stepCompletions,
            claimQuest,
            isQuestCompleted,
            getQuestProgress
        }}>
            {children}
        </UserProgressContext.Provider>
    );
}

export function useUserProgress() {
    const context = useContext(UserProgressContext);
    if (context === undefined) {
        throw new Error('useUserProgress must be used within a UserProgressProvider');
    }
    return context;
}
