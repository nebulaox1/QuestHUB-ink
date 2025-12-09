'use client';

import { QuestStep } from '@/data/quests';
import { useState } from 'react';

interface QuestStepsProps {
    steps: QuestStep[];
    completedSteps: number[]; // Indices of completed steps
    onStepComplete: (index: number) => void;
    onVerifyStep: (index: number) => Promise<{ success: boolean; error?: string }>;
    partnerName?: string;
    externalUrl?: string;
    brandColor?: string;
    brandGradient?: string;
}

export default function QuestSteps({
    steps,
    completedSteps,
    onStepComplete,
    onVerifyStep,
    partnerName = 'Partner',
    externalUrl,
    brandColor = '#a855f7', // Default purple
    brandGradient
}: QuestStepsProps) {
    const [verifyingStep, setVerifyingStep] = useState<number | null>(null);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleVerify = async (index: number) => {
        setVerifyingStep(index);
        setErrorIndex(null);
        setErrorMessage(null);

        try {
            const result = await onVerifyStep(index);
            if (!result.success && result.error) {
                setErrorIndex(index);
                setErrorMessage(result.error);
            }
        } catch (e) {
            console.error(e);
            setErrorIndex(index);
            setErrorMessage('An unexpected error occurred');
        } finally {
            setVerifyingStep(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(index);
                    const isActive = !isCompleted;

                    return (
                        <div
                            key={index}
                            className={`group relative flex gap-6 p-6 rounded-2xl border transition-all duration-500 mb-4 z-10 overflow-hidden`}
                            style={{
                                '--brand-color': brandColor,
                                borderColor: isActive ? `${brandColor}40` : 'transparent',
                                boxShadow: isActive ? `0 0 0 1px ${brandColor}20, 0 10px 40px -10px ${brandColor}20` : 'none',
                                opacity: isActive ? 1 : 0.6,
                                background: '#13091f'
                            } as React.CSSProperties}
                        >
                            {/* Brand Background - Gradient Overlay */}
                            {isActive && (
                                <div
                                    className="absolute inset-0 opacity-[0.25] pointer-events-none transition-opacity duration-500"
                                    style={{ background: brandGradient || brandColor }}
                                />
                            )}

                            {/* Step Indicator */}
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold border shrink-0 transition-all duration-500 z-10 relative`}
                                style={{
                                    background: isCompleted ? 'rgba(34, 197, 94, 0.1)' : isActive ? `${brandColor}10` : 'rgba(255, 255, 255, 0.05)',
                                    borderColor: isCompleted ? 'rgba(34, 197, 94, 0.3)' : isActive ? `${brandColor}40` : 'rgba(255, 255, 255, 0.1)',
                                    color: isCompleted ? '#4ade80' : isActive ? brandColor : '#6b7280',
                                    boxShadow: isActive && !isCompleted ? `0 0 20px ${brandColor}20` : 'none'
                                }}
                            >
                                {isCompleted ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>

                            <div className="flex-1 pt-1 space-y-3 relative z-10">
                                <div className="flex items-center justify-between">
                                    <h3
                                        className={`font-bold text-xl transition-colors duration-300`}
                                        style={{ color: isActive ? '#fff' : '#9ca3af' }}
                                    >
                                        {step.title}
                                    </h3>
                                    {isActive && (
                                        <span
                                            className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-sm"
                                            style={{
                                                color: brandColor,
                                                borderColor: `${brandColor}30`,
                                                backgroundColor: `${brandColor}10`,
                                                boxShadow: `0 0 10px ${brandColor}10`
                                            }}
                                        >
                                            Active
                                        </span>
                                    )}
                                </div>

                                <p className="text-purple-200/60 leading-relaxed text-base font-medium">
                                    {step.description}
                                </p>

                                {isActive && (
                                    <div className="pt-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
                                        {step.helperText && (
                                            <div className="flex items-start gap-3 text-sm text-yellow-500/90 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                                                <span className="shrink-0 text-lg">💡</span>
                                                <span className="leading-relaxed">{step.helperText}</span>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3">
                                            {/* Start Task Button */}
                                            {step.startUrl && (
                                                <a
                                                    href={step.startUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/btn inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                                    style={{
                                                        // Using style for dynamic hover border color
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = `${brandColor}50`;
                                                        e.currentTarget.style.boxShadow = `0 4px 20px ${brandColor}10`;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <span>Start Here</span>
                                                    <svg className="w-4 h-4 text-white/50 group-hover/btn:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            )}

                                            {/* Action/Verify Button */}
                                            {index === 0 && externalUrl && !step.verification && !step.startUrl ? (
                                                <a
                                                    href={externalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => onStepComplete(index)}
                                                    className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:brightness-110"
                                                    style={{
                                                        background: brandColor,
                                                        boxShadow: `0 4px 20px ${brandColor}30`
                                                    }}
                                                >
                                                    Open {partnerName}
                                                </a>
                                            ) : step.verification ? (
                                                <button
                                                    onClick={() => handleVerify(index)}
                                                    disabled={verifyingStep === index}
                                                    className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait shadow-lg hover:shadow-xl hover:brightness-110"
                                                    style={{
                                                        background: brandColor,
                                                        boxShadow: `0 4px 20px ${brandColor}30`
                                                    }}
                                                >
                                                    {verifyingStep === index ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Verifying...
                                                        </>
                                                    ) : (
                                                        'Verify Action'
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onStepComplete(index)}
                                                    className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:brightness-110"
                                                    style={{
                                                        background: brandColor,
                                                        boxShadow: `0 4px 20px ${brandColor}30`
                                                    }}
                                                >
                                                    {step.actionLabel || 'Verify Action'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Inline Error Message */}
                                        {errorIndex === index && errorMessage && (
                                            <div className="animate-in fade-in slide-in-from-top-1 mt-3">
                                                <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl">
                                                    <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    {errorMessage}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
