import fs from 'fs';
import path from 'path';

// Define the path to the JSON file database
// We use process.cwd() to get the root of the project
const DB_PATH = path.join(process.cwd(), 'db.json');

// Interface for our database structure
// Interface for our database structure
interface DatabaseSchema {
    completions: Record<string, boolean>; // key: questId-userAddress
    stepCompletions: Record<string, boolean>; // key: questId-step-stepIndex-userAddress
    xp: Record<string, number>; // key: userAddress -> totalXP
}

// Ensure the DB file exists
function ensureDbExists() {
    if (!fs.existsSync(DB_PATH)) {
        const initialData: DatabaseSchema = {
            completions: {},
            stepCompletions: {},
            xp: {}
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

// Helper to read the database
function readDb(): DatabaseSchema {
    ensureDbExists();
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        // Ensure defaults if missing (migration)
        if (!parsed.stepCompletions) parsed.stepCompletions = {};
        if (!parsed.completions) parsed.completions = {};
        if (!parsed.xp) parsed.xp = {};
        return parsed;
    } catch (error) {
        console.error("Failed to read DB:", error);
        return { completions: {}, stepCompletions: {}, xp: {} };
    }
}

// Helper to write to the database
function writeDb(data: DatabaseSchema) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Failed to write to DB:", error);
    }
}

// Exported standard DB interface
export const db = {
    getCompletion: (questId: string, address: string): boolean => {
        const data = readDb();
        const key = `${questId}-${address.toLowerCase()}`;
        return !!data.completions[key];
    },

    setCompletion: (questId: string, address: string) => {
        const data = readDb();
        const key = `${questId}-${address.toLowerCase()}`;
        data.completions[key] = true;
        writeDb(data);
    },

    getUserCompletions: (address: string): string[] => {
        const data = readDb();
        const normalizedAddress = address.toLowerCase();
        return Object.keys(data.completions)
            .filter(key => key.endsWith(`-${normalizedAddress}`))
            .map(key => key.split('-')[0]);
    },

    getStepCompletion: (questId: string, stepIndex: number, address: string): boolean => {
        const data = readDb();
        const key = `${questId}-step-${stepIndex}-${address.toLowerCase()}`;
        return !!data.stepCompletions[key];
    },

    setStepCompletion: (questId: string, stepIndex: number, address: string) => {
        const data = readDb();
        const key = `${questId}-step-${stepIndex}-${address.toLowerCase()}`;
        data.stepCompletions[key] = true;
        writeDb(data);
    },

    getUserStepCompletions: (questId: string, address: string): number[] => {
        const data = readDb();
        const normalizedAddress = address.toLowerCase();
        const prefix = `${questId}-step-`;
        const suffix = `-${normalizedAddress}`;

        return Object.keys(data.stepCompletions)
            .filter(key => key.startsWith(prefix) && key.endsWith(suffix))
            .map(key => {
                // key format: questId-step-INDEX-address
                // remove prefix and suffix
                const mid = key.slice(prefix.length, key.length - suffix.length);
                return parseInt(mid, 10);
            });
    },

    getAllUserStepCompletions: (address: string): Record<string, number[]> => {
        const data = readDb();
        const normalizedAddress = address.toLowerCase();
        const suffix = `-${normalizedAddress}`;
        const result: Record<string, number[]> = {};

        Object.keys(data.stepCompletions).forEach(key => {
            if (key.endsWith(suffix)) {
                // key format: QUESTID-step-INDEX-ADDRESS
                // Split by '-step-'
                const parts = key.split('-step-');
                if (parts.length === 2) {
                    const questId = parts[0];
                    const rest = parts[1]; // INDEX-ADDRESS
                    // Remove address from rest
                    const indexStr = rest.slice(0, rest.length - suffix.length);
                    const index = parseInt(indexStr, 10);

                    if (!result[questId]) {
                        result[questId] = [];
                    }
                    result[questId].push(index);
                }
            }
        });
        return result;
    },

    getUserXp: (address: string): number => {
        const data = readDb();
        const key = address.toLowerCase();
        return data.xp[key] || 0;
    },

    addXp: (address: string, amount: number) => {
        const data = readDb();
        const key = address.toLowerCase();
        const currentXp = data.xp[key] || 0;
        data.xp[key] = currentXp + amount;
        writeDb(data);
    }
};
