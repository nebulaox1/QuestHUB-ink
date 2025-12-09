# Ink Streak Smart Contract ⚡

This folder contains the `InkStreak` smart contract, which manages daily check-ins for users to maintain their activity streak on QuestHUB.

## 📄 Contract: `InkStreak.sol`

**Features:**
- **Daily Check-ins**: Users can check in once every 24 hours (UTC based).
- **Streak Tracking**: Automatically increments streaks for consecutive days.
- **Auto-Reset**: Resets streak to 1 if a day is missed.
- **Spam Prevention**: Requires a small fee (`0.0001 ETH`) to update streak.
- **Owner Withdrawal**: collected fees can be withdrawn by the contract owner.

---

## 🚀 Deployment Guide (Hardhat/Foundry)

### 1. Prerequisites
Ensure you have a wallet with Inkchain testnet/mainnet funds.

### 2. Deploy using Remix (Easiest)
1. Go to [Remix IDE](https://remix.ethereum.org).
2. Create a new file `InkStreak.sol` and paste the content from `contracts/InkStreak.sol`.
3. Compile the contract using the Solidity Compiler tab (0.8.20).
4. Go to the "Deploy & Run Transactions" tab.
5. Select "Injected Provider - MetaMask" as environment.
6. Connect your wallet (Inkchain network).
7. Click **Deploy**.
8. Confirm the transaction.

### 3. After Deployment

Once deployed, copy the **Contract Address**.

### 4. Connect to Frontend

Open `src/components/InkStreakButton.tsx` and update the `sendTransaction` call:

```typescript
// Replace this:
sendTransaction({
    to: address, // Currently sends to self
    value: parseEther(amount),
    chainId: 57073,
});

// With this (to use the contract):
/*
import { writeContract } from '@wagmi/core'
import { inkStreakABI } from '@/lib/abis/InkStreak' // You'll need the ABI

sendTransaction({
    to: "YOUR_DEPLOYED_CONTRACT_ADDRESS", 
    value: parseEther(amount),
    data: "0xe1fa7638" // Function selector for checkIn()
    chainId: 57073,
});
*/
```

*> **Note:** For full integration, you should generate the ABI and use `useWriteContract` from Wagmi instead of raw `sendTransaction`.*

---

## 🔧 Verified Contract
If you verify the contract on the Inkchain Explorer, users can interact with it directly there too!
