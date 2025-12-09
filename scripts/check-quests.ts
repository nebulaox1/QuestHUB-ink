
import { QUESTS } from '../data/quests';

console.log('Checking Quests Integrity...');
try {
    const q12 = QUESTS['12'];
    if (q12) {
        console.log('Quest 12 found:', q12.title);
        console.log('Steps:', JSON.stringify(q12.steps, null, 2));
    } else {
        console.error('Quest 12 NOT found in QUESTS object!');
    }
} catch (e) {
    console.error('Error importing or accessing QUESTS:', e);
}
