'use client';

import type { Option, Selections, PricingBreakdown } from '@/types';
import { STEPS } from '@/types';
import { formatPrice } from '@/lib/engine/pricing';

interface ReviewPanelProps {
    modelName: string;
    selections: Selections;
    packageSelections: Set<string>;
    options: Option[];
    pricing: PricingBreakdown;
    onGoToStep: (step: number) => void;
    onSaveQuote: () => void;
    onPlaceOrder: () => void;
}

export default function ReviewPanel({
    modelName,
    selections,
    packageSelections,
    options,
    pricing,
    onGoToStep,
    onSaveQuote,
    onPlaceOrder,
}: ReviewPanelProps) {
    const getOptionName = (id: string | undefined) => {
        if (!id) return '—';
        return options.find((o) => o.id === id)?.name ?? '—';
    };

    const selectedPackages = options.filter((o) => packageSelections.has(o.id));

    return (
        <div className="animate-fade-in space-y-8">
            {/* Hero */}
            <div className="text-center mb-8">
                <p className="text-maserati-accent text-xs tracking-[0.3em] uppercase mb-2">Configuration Complete</p>
                <h1 className="font-display text-4xl md:text-5xl text-white mb-2">{modelName}</h1>
                <p className="text-gradient text-3xl font-display font-bold">{formatPrice(pricing.totalPrice)}</p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STEPS.filter((s) => s.category !== 'package').map((step, idx) => {
                    const selectedId = selections[step.category];
                    const selectedOption = options.find((o) => o.id === selectedId);

                    return (
                        <div
                            key={step.category}
                            className="glass-card p-5 group hover:border-maserati-accent/30 transition-all duration-300 cursor-pointer"
                            onClick={() => onGoToStep(idx)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-maserati-accent/60 dark:text-maserati-accent/60 light:text-maserati-navy/60 text-xs tracking-wider uppercase mb-1">{step.label}</p>
                                    <p className="text-white dark:text-white light:text-maserati-navy font-medium">{getOptionName(selectedId)}</p>
                                    {selectedOption && Number(selectedOption.price) !== 0 && (
                                        <p className={`text-sm mt-1 ${Number(selectedOption.price) < 0 ? 'text-green-400 dark:text-green-400 light:text-green-600' : 'text-white/40 dark:text-white/40 light:text-black/50'}`}>
                                            {Number(selectedOption.price) > 0 ? '+' : ''}{formatPrice(Number(selectedOption.price))}
                                        </p>
                                    )}
                                </div>
                                <span className="text-white/20 dark:text-white/20 light:text-black/20 group-hover:text-maserati-accent/60 transition-colors text-lg">
                                    ✎
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Packages */}
            {selectedPackages.length > 0 && (
                <div
                    className="glass-card p-5 cursor-pointer group hover:border-maserati-accent/30 transition-all duration-300"
                    onClick={() => onGoToStep(STEPS.length - 1)}
                >
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-maserati-accent/60 text-xs tracking-wider uppercase">Packages</p>
                        <span className="text-white/20 group-hover:text-maserati-accent/60 transition-colors text-lg">✎</span>
                    </div>
                    <div className="space-y-2">
                        {selectedPackages.map((pkg) => (
                            <div key={pkg.id} className="flex justify-between">
                                <span className="text-white/80 text-sm">{pkg.name}</span>
                                <span className="text-white/40 text-sm">+{formatPrice(Number(pkg.price))}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pricing Breakdown */}
            <div className="glass-card p-6">
                <p className="text-maserati-accent/60 text-xs tracking-wider uppercase mb-4">Price Breakdown</p>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Base Price</span>
                        <span className="text-white text-sm">{formatPrice(pricing.basePrice)}</span>
                    </div>
                    {pricing.optionsPrices
                        .filter((o) => o.price !== 0)
                        .map((opt) => (
                            <div key={opt.optionId} className="flex justify-between">
                                <span className="text-white/40 text-sm">{opt.name}</span>
                                <span className={`text-sm ${opt.price < 0 ? 'text-green-400' : 'text-white/60'}`}>
                                    {opt.price > 0 ? '+' : ''}{formatPrice(opt.price)}
                                </span>
                            </div>
                        ))}
                    <div className="h-px bg-white/10 my-3" />
                    <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Total</span>
                        <span className="text-gradient text-2xl font-display font-bold">{formatPrice(pricing.totalPrice)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button onClick={onSaveQuote} className="btn-outline">
                    Save as Quote
                </button>
                <button onClick={onPlaceOrder} className="btn-accent">
                    Place Order
                </button>
            </div>
        </div>
    );
}
