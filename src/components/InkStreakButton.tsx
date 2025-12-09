'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSimulateContract, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { INK_STREAK_ADDRESS, INK_STREAK_ABI } from '@/data/contracts';

export default function InkStreakButton() {
    const { address, isConnected, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();
    const [initialStreak, setInitialStreak] = useState<number>(0);

    // Read Streak Data
    const { data: streakData } = useReadContract({
        address: INK_STREAK_ADDRESS,
        abi: INK_STREAK_ABI,
        functionName: 'getStreak',
        chainId: 57073, // Enforce Inkchain
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // Read Fee Data
    const { data: feeData } = useReadContract({
        address: INK_STREAK_ADDRESS,
        abi: INK_STREAK_ABI,
        functionName: 'CHECKIN_FEE',
        chainId: 57073, // Enforce Inkchain
    });

    const requiredFee = feeData ? feeData : parseEther('0.0001');

    // Simulation to check if user can check in
    const {
        data: simData,
        error: simError,
    } = useSimulateContract({
        address: INK_STREAK_ADDRESS,
        abi: INK_STREAK_ABI,
        functionName: 'checkIn',
        value: requiredFee,
        chainId: 57073, // Enforce Inkchain
        query: {
            enabled: isConnected,
            retry: false,
        }
    });

    // Write Contract (Check-in) 
    const { data: hash, writeContract, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    // Determine lock state based on simulation
    // If simulation fails AND it's likely the "Already checked in" error, we treat it as Success/Active
    const isAlreadyCheckedIn = simError?.message.includes("Already checked in") || simError?.message.includes("revert");

    // Sync streak data
    useEffect(() => {
        if (streakData) {
            setInitialStreak(Number(streakData));
        }
    }, [streakData]);

    // UI Logic
    const handleCheckIn = async () => {
        if (!isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        // 1. Auto-Switch Network if needed
        if (chainId !== 57073) {
            try {
                await switchChainAsync({ chainId: 57073 });
                // We proceed to direct write below immediately after switch success
            } catch (error) {
                console.error("Failed to switch network:", error);
                return; // Stop if user rejects switch
            }
        }

        // 2. Trigger Transaction
        // If we simData is ready (we were already on chain), use it.
        // If we just switched, simData is stale/undefined, so we force direct write.
        if (simData?.request && chainId === 57073) {
            writeContract(simData.request);
        } else if (isAlreadyCheckedIn && chainId === 57073) {
            console.log("Streak already active today.");
        } else {
            // Fallback / Just Switched Mode: Direct Write
            // This works because we are now on 57073 (or just switched to it)
            try {
                writeContract({
                    address: INK_STREAK_ADDRESS,
                    abi: INK_STREAK_ABI,
                    functionName: 'checkIn',
                    value: requiredFee,
                });
            } catch (e) {
                console.error("Direct write failed", e);
            }
        }
    };

    // Status text logic
    let buttonText = "Ink Streak"; // Cleaned text
    if (isPending) buttonText = "Confirming...";
    if (isConfirming) buttonText = "Updating...";
    if (isSuccess || (isAlreadyCheckedIn && chainId === 57073)) buttonText = "Streak Active";

    // Disable if: Not connected OR pending state
    // ENABLED even if on wrong network (to trigger switch)
    const isDisabled = isPending || isConfirming || !isConnected || (isAlreadyCheckedIn && chainId === 57073);

    return (
        <button
            onClick={handleCheckIn}
            disabled={isDisabled}
            className={`
                group relative hidden md:flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300
                border backdrop-blur-md shadow-lg
                ${(isSuccess || (isAlreadyCheckedIn && chainId === 57073))
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 cursor-default shadow-emerald-900/20"
                    : "bg-[#1a0b05]/80 border-orange-500/50 text-orange-400 hover:border-orange-400 hover:text-orange-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                }
            `}
        >
            {/* Animated Glow Background for 'Ready' state */}
            {!(isSuccess || (isAlreadyCheckedIn && chainId === 57073)) && !isDisabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            )}

            <span className={`text-lg transition-transform duration-300 ${isPending || isConfirming ? "animate-spin" : "group-hover:scale-110 group-hover:rotate-6"}`}>
                {(isSuccess || (isAlreadyCheckedIn && chainId === 57073)) ? "✅" : (isPending || isConfirming) ? "⏳" : "🔥"}
            </span>

            <span className="relative z-10 flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase opacity-70 font-medium mb-0.5 tracking-wider">
                    {(isSuccess || (isAlreadyCheckedIn && chainId === 57073)) ? "Completed" : "Daily Quest"}
                </span>
                <span>{buttonText}</span>
            </span>
        </button>
    );
}
