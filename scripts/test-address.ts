
import { getAddress, pad } from 'viem';

const USER = '0xd6335f7604f1e97fc47027feb0d9d718ce3ce9fa';
const ADDR = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';

try {
    console.log('Validating USER (forced lower)...');
    const u = getAddress(USER.toLowerCase());
    console.log('USER OK:', u);
    console.log('Padding USER...');
    const p = pad(u, { size: 32 });
    console.log('PAD OK:', p);

    console.log('Validating ADDR...');
    const a = getAddress(ADDR);
    console.log('ADDR OK:', a);

} catch (e: any) {
    console.error('FAIL:', e.message);
}
