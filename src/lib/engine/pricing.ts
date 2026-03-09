/**
 * Pricing Engine
 * Calculates total price with full breakdown.
 * Ensures deterministic, ACID-like calculation.
 */

import type { Model, Option, PricingBreakdown } from '@/types';

/**
 * Calculate total price given a model and selected options.
 * Uses integer arithmetic internally to avoid floating point issues.
 */
export function calculatePricing(
  model: Model | null,
  allOptions: Option[],
  selectedOptionIds: Set<string>
): PricingBreakdown {
  if (!model) {
    return { basePrice: 0, optionsPrices: [], totalPrice: 0 };
  }

  const basePrice = Number(model.base_price);

  const optionsPrices = allOptions
    .filter((opt) => selectedOptionIds.has(opt.id))
    .map((opt) => ({
      optionId: opt.id,
      name: opt.name,
      price: Number(opt.price),
    }));

  // Use integer cents to avoid floating point
  const baseCents = Math.round(basePrice * 100);
  const optionsCents = optionsPrices.reduce(
    (sum, o) => sum + Math.round(o.price * 100),
    0
  );
  const totalCents = baseCents + optionsCents;

  return {
    basePrice,
    optionsPrices,
    totalPrice: totalCents / 100,
  };
}

/**
 * Format a price as currency string.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
