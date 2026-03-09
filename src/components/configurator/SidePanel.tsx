'use client';

import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { STEPS } from '@/types';

interface SidePanelProps {
    currentStep: number;
    onGoToStep: (step: number) => void;
    totalSteps: number;
    clearModel: () => void;
}

export default function SidePanel({ currentStep, onGoToStep, totalSteps, clearModel }: SidePanelProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isReview = currentStep >= STEPS.length;

    return (
        <>
            {/* Toggle Button (visible when collapsed or on mobile) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center
          transition-all duration-300
          ${isOpen ? 'lg:hidden' : ''}
          bg-white/50 dark:bg-white/10
          backdrop-blur-lg border border-black/10 dark:border-white/10
          hover:bg-black/5 dark:hover:bg-white/20
          text-maserati-navy dark:text-white
        `}
                aria-label="Toggle navigation"
            >
                {isOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Backdrop (mobile only) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Side Panel */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          w-[280px] transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white/95 dark:bg-maserati-dark/95
          backdrop-blur-xl border-r border-black/5 dark:border-white/5
        `}
            >
                {/* Logo Section */}
                <div className="p-6 pb-4 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 40 40" className="w-9 h-9 flex-shrink-0" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" className="text-maserati-accent/40" />
                            <path d="M20 8 L26 20 L20 32 L14 20 Z" fill="currentColor" className="text-maserati-accent" />
                        </svg>
                        <div>
                            <h1 className="text-maserati-navy dark:text-white font-display text-base tracking-[0.2em]">AUTONOVA</h1>
                            <p className="text-maserati-accent/60 text-[9px] tracking-[0.35em] uppercase">Configurator</p>
                        </div>
                    </div>

                    {/* Back to Models Navigation */}
                    <button
                        onClick={() => {
                            clearModel();
                            if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 mb-2 rounded-lg
                       bg-maserati-accent/10 hover:bg-maserati-accent/20 transition-all duration-300
                       text-maserati-accent text-sm font-medium"
                    >
                        <span>&larr;</span>
                        <span>Back to Models</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                       bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300
                       text-maserati-navy/60 dark:text-white/60 hover:text-maserati-navy dark:hover:text-white text-sm"
                    >
                        <div className="flex items-center gap-2.5">
                            {theme === 'dark' ? (
                                <svg className="w-4 h-4 text-maserati-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-maserati-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <div className={`
              w-9 h-5 rounded-full relative transition-colors duration-300
              ${theme === 'dark' ? 'bg-maserati-accent/30' : 'bg-maserati-accent'}
            `}>
                            <div className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white
                transition-transform duration-300
                ${theme === 'dark' ? 'left-0.5' : 'left-[18px]'}
              `} />
                        </div>
                    </button>
                </div>

                {/* Navigation Steps */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <p className="text-maserati-navy/40 dark:text-white/30 text-[10px] tracking-[0.2em] uppercase px-3 mb-3">Configuration Steps</p>

                    <div className="space-y-1">
                        {STEPS.map((step, idx) => {
                            const isActive = idx === currentStep;
                            const isCompleted = idx < currentStep;

                            return (
                                <button
                                    key={step.category}
                                    onClick={() => {
                                        onGoToStep(idx);
                                        if (window.innerWidth < 1024) setIsOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-300 group
                    ${isActive
                                            ? 'bg-maserati-accent/10 text-maserati-accent'
                                            : isCompleted
                                                ? 'text-maserati-navy/60 dark:text-white/60 hover:text-maserati-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                                                : 'text-maserati-navy/40 dark:text-white/30 hover:text-maserati-navy/60 dark:hover:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}
                  `}
                                >
                                    <div className={`
                    w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0
                    transition-all duration-300
                    ${isActive
                                            ? 'bg-maserati-accent/20 text-maserati-accent'
                                            : isCompleted
                                                ? 'bg-black/5 dark:bg-white/5 text-maserati-navy/60 dark:text-white/60'
                                                : 'bg-black/5 dark:bg-white/5 text-maserati-navy/30 dark:text-white/20'}
                  `}>
                                        {isCompleted ? (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span>{step.icon}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{step.label}</p>
                                        <p className="text-[10px] opacity-50">Step {idx + 1}</p>
                                    </div>
                                    {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-maserati-accent animate-pulse-soft" />
                                    )}
                                </button>
                            );
                        })}

                        {/* Review Step */}
                        <button
                            onClick={() => {
                                onGoToStep(STEPS.length);
                                if (window.innerWidth < 1024) setIsOpen(false);
                            }}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                transition-all duration-300
                ${isReview
                                    ? 'bg-maserati-accent/10 text-maserati-accent'
                                    : 'text-maserati-navy/40 dark:text-white/30 hover:text-maserati-navy/60 dark:hover:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}
              `}
                        >
                            <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0
                ${isReview ? 'bg-maserati-accent/20 text-maserati-accent' : 'bg-black/5 dark:bg-white/5 text-maserati-navy/30 dark:text-white/20'}
              `}>
                                ✓
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Review & Save</p>
                                <p className="text-[10px] opacity-50">Final step</p>
                            </div>
                        </button>
                    </div>
                </nav>

                {/* Help Section */}
                <div className="border-t border-black/5 dark:border-white/5 p-3">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                       text-maserati-navy/50 dark:text-white/40 hover:text-maserati-navy/70 dark:hover:text-white/60 hover:bg-black/5 dark:hover:bg-white/5
                       transition-all duration-300 text-sm"
                    >
                        <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Help & Guide</span>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${showHelp ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showHelp && (
                        <div className="px-3 py-3 text-white/40 text-xs leading-relaxed space-y-2 animate-fade-in">
                            <p>🔹 Navigate through each step to build your configuration.</p>
                            <p>🔹 Some options may be disabled based on your previous selections (rule engine).</p>
                            <p>🔹 Prices update in real-time as you make changes.</p>
                            <p>🔹 Drag to rotate the 3D model. Scroll to zoom.</p>
                            <p>🔹 Click &quot;Review&quot; to see your complete configuration and save as a quote or place an order.</p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
