'use client';

import { STEPS } from '@/types';

interface StepNavigatorProps {
    currentStep: number;
    onGoToStep: (step: number) => void;
}

export default function StepNavigator({ currentStep, onGoToStep }: StepNavigatorProps) {
    const isReview = currentStep >= STEPS.length;

    return (
        <nav className="w-full">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between px-4">
                {STEPS.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;

                    return (
                        <button
                            key={step.category}
                            onClick={() => onGoToStep(idx)}
                            className={`
                group flex flex-col items-center gap-2 px-4 py-3 rounded-xl
                transition-all duration-300 ease-out relative
                ${isActive
                                    ? 'text-maserati-accent'
                                    : isCompleted
                                        ? 'text-white/70 hover:text-white'
                                        : 'text-white/30 hover:text-white/50'}
              `}
                        >
                            {/* Connector line */}
                            {idx > 0 && (
                                <div className={`
                  absolute -left-full top-1/2 h-[1px] w-full -translate-y-1/2
                  ${isCompleted ? 'bg-maserati-accent/40' : 'bg-white/10'}
                  transition-colors duration-500
                `} />
                            )}

                            <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center text-lg
                border transition-all duration-300
                ${isActive
                                    ? 'border-maserati-accent bg-maserati-accent/10 shadow-lg shadow-maserati-accent/20'
                                    : isCompleted
                                        ? 'border-maserati-accent/40 bg-maserati-accent/5'
                                        : 'border-white/10 bg-white/5'}
              `}>
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span>{step.icon}</span>
                                )}
                            </div>

                            <span className={`
                text-xs font-medium tracking-wider uppercase
                transition-all duration-300
                ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}
              `}>
                                {step.label}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute -bottom-1 w-8 h-0.5 bg-maserati-accent rounded-full" />
                            )}
                        </button>
                    );
                })}

                {/* Review Step */}
                <button
                    onClick={() => onGoToStep(STEPS.length)}
                    className={`
            group flex flex-col items-center gap-2 px-4 py-3 rounded-xl
            transition-all duration-300 ease-out
            ${isReview ? 'text-maserati-accent' : 'text-white/30 hover:text-white/50'}
          `}
                >
                    <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-lg
            border transition-all duration-300
            ${isReview
                            ? 'border-maserati-accent bg-maserati-accent/10 shadow-lg shadow-maserati-accent/20'
                            : 'border-white/10 bg-white/5'}
          `}>
                        ✓
                    </div>
                    <span className="text-xs font-medium tracking-wider uppercase">Review</span>
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2 px-4 overflow-x-auto pb-2">
                {STEPS.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;

                    return (
                        <button
                            key={step.category}
                            onClick={() => onGoToStep(idx)}
                            className={`
                step-dot
                ${isActive ? 'active' : isCompleted ? 'completed' : 'pending'}
              `}
                            title={step.label}
                        />
                    );
                })}
                <button
                    onClick={() => onGoToStep(STEPS.length)}
                    className={`step-dot ${isReview ? 'active' : 'pending'}`}
                    title="Review"
                />
            </div>
        </nav>
    );
}
