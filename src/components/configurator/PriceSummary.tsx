'use client';

import type { PricingBreakdown } from '@/types';
import { formatPrice } from '@/lib/engine/pricing';

interface PriceSummaryProps {
    pricing: PricingBreakdown;
    modelName: string;
}

export default function PriceSummary({ pricing, modelName }: PriceSummaryProps) {
    return (
        <div className="glass-card p-6 sticky top-8">
            {/* Header */}
            <div className="mb-6">
                <p className="text-maserati-accent text-xs tracking-[0.3em] uppercase mb-1">Your Configuration</p>
                <h2 className="font-display text-2xl text-white">{modelName}</h2>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

            {/* Base Price */}
            <div className="flex justify-between items-center py-2">
                <span className="text-white/50 text-sm">Base Price</span>
                <span className="text-white text-sm font-medium">{formatPrice(pricing.basePrice)}</span>
            </div>

            {/* Options */}
            <div className="space-y-1.5">
                {pricing.optionsPrices
                    .filter((o) => o.price !== 0)
                    .map((opt) => (
                        <div key={opt.optionId} className="flex justify-between items-center py-1.5">
                            <span className="text-white/40 text-sm truncate mr-4">{opt.name}</span>
                            <span className={`text-sm font-medium whitespace-nowrap ${opt.price < 0 ? 'text-green-400' : 'text-white/70'}`}>
                                {opt.price > 0 ? '+' : ''}{formatPrice(opt.price)}
                            </span>
                        </div>
                    ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-maserati-accent/30 to-transparent my-4" />

            {/* Total */}
            <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm font-medium tracking-wide uppercase">Total</span>
                <span className="text-gradient text-2xl font-display font-bold">
                    {formatPrice(pricing.totalPrice)}
                </span>
            </div>

            {/* Monthly estimate */}
            <p className="text-white/30 text-xs text-right mt-1">
                Est. {formatPrice(Math.round(pricing.totalPrice / 60))}/mo for 60 months
            </p>
        </div>
    );
}
