'use client';

import type { Option, OptionCategory } from '@/types';
import { formatPrice } from '@/lib/engine/pricing';

interface OptionCardProps {
    option: Option;
    isSelected: boolean;
    isDisabled: boolean;
    isPackage: boolean;
    onSelect: (category: OptionCategory, optionId: string) => void;
}

// Color swatches for exterior/interior
const COLOR_MAP: Record<string, string> = {
    'Bianco Alpi (White)': 'bg-white',
    'Nero Ribelle (Black)': 'bg-gray-900',
    'Rosso Magma (Red)': 'bg-red-700',
    'Nero Premium Leather': 'bg-gray-900',
    'Rosso Corallo Leather': 'bg-red-600',
};

export default function OptionCard({
    option,
    isSelected,
    isDisabled,
    isPackage,
    onSelect,
}: OptionCardProps) {
    const hasSwatch = COLOR_MAP[option.name];
    const priceDiff = Number(option.price);

    return (
        <button
            onClick={() => !isDisabled && onSelect(option.category, option.id)}
            disabled={isDisabled}
            className={`
        option-card text-left w-full
        ${isSelected ? 'selected' : ''}
        ${isDisabled ? 'disabled' : ''}
        animate-fade-in
      `}
        >
            {/* Selection indicator */}
            <div className="absolute top-4 right-4">
                {isPackage ? (
                    <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-300
            ${isSelected
                            ? 'border-maserati-accent bg-maserati-accent'
                            : 'border-white/30'}
          `}>
                        {isSelected && (
                            <svg className="w-3 h-3 text-maserati-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                ) : (
                    <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-300
            ${isSelected
                            ? 'border-maserati-accent'
                            : 'border-white/30'}
          `}>
                        {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-maserati-accent" />
                        )}
                    </div>
                )}
            </div>

            {/* Color swatch (for colors) */}
            {hasSwatch && (
                <div className={`
          w-12 h-12 rounded-full mb-4 ring-2 
          ${isSelected ? 'ring-maserati-accent' : 'ring-white/20'}
          ${COLOR_MAP[option.name]}
          transition-all duration-300
        `} />
            )}

            {/* Content */}
            <div className="pr-8">
                <h3 className={`
          font-semibold text-base mb-1
          ${isSelected ? 'text-white dark:text-white light:text-maserati-navy' : 'text-white/80 dark:text-white/80 light:text-black/70'}
          ${isDisabled ? 'line-through' : ''}
          transition-colors duration-300
        `}>
                    {option.name}
                </h3>

                {option.description && (
                    <p className="text-white/40 dark:text-white/40 light:text-black/50 text-sm leading-relaxed mb-3 line-clamp-2">
                        {option.description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    {priceDiff === 0 ? (
                        <span className="text-white/40 dark:text-white/40 light:text-black/50 text-sm">Included</span>
                    ) : (
                        <span className={`price-tag text-sm ${priceDiff < 0 ? 'text-green-400 dark:text-green-400 light:text-green-600' : ''}`}>
                            {priceDiff > 0 ? '+' : ''}{formatPrice(priceDiff)}
                        </span>
                    )}
                </div>
            </div>

            {/* Disabled badge */}
            {isDisabled && (
                <div className="absolute inset-0 rounded-xl flex items-end justify-center pb-3">
                    <span className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/30">
                        Not Available
                    </span>
                </div>
            )}
        </button>
    );
}
