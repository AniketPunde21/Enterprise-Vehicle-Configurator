/**
 * Deterministic Rule Engine
 * Evaluates INCLUDE/EXCLUDE rules to determine which options are
 * disabled or auto-included based on current selections.
 */

import type { Rule, Option, Selections, RuleViolation } from '@/types';

interface RuleEvaluationResult {
  disabledOptionIds: Set<string>;
  autoIncludedOptionIds: Set<string>;
  violations: RuleViolation[];
}

/**
 * Given a set of currently selected option IDs, evaluate all rules
 * and return the set of disabled options and auto-included options.
 */
export function evaluateRules(
  rules: Rule[],
  allOptions: Option[],
  selectedOptionIds: Set<string>
): RuleEvaluationResult {
  const disabledOptionIds = new Set<string>();
  const autoIncludedOptionIds = new Set<string>();
  const violations: RuleViolation[] = [];

  for (const rule of rules) {
    const sourceSelected = selectedOptionIds.has(rule.source_option_id);

    if (!sourceSelected) continue;

    switch (rule.rule_type) {
      case 'EXCLUDE':
        // If source is selected, target is DISABLED
        disabledOptionIds.add(rule.target_option_id);

        // If target is also currently selected, that's a violation
        if (selectedOptionIds.has(rule.target_option_id)) {
          violations.push({
            ruleId: rule.id,
            sourceOptionId: rule.source_option_id,
            targetOptionId: rule.target_option_id,
            ruleType: 'EXCLUDE',
            description: rule.description,
          });
        }
        break;

      case 'INCLUDE':
        // If source is selected, target is AUTO-INCLUDED
        autoIncludedOptionIds.add(rule.target_option_id);
        break;
    }
  }

  return { disabledOptionIds, autoIncludedOptionIds, violations };
}

/**
 * Check if selecting a specific option would cause any violations.
 * Returns the list of violations that would occur.
 */
export function wouldCauseViolations(
  rules: Rule[],
  selectedOptionIds: Set<string>,
  candidateOptionId: string
): RuleViolation[] {
  const hypothetical = new Set(selectedOptionIds);
  hypothetical.add(candidateOptionId);

  const violations: RuleViolation[] = [];

  for (const rule of rules) {
    if (!hypothetical.has(rule.source_option_id)) continue;

    if (rule.rule_type === 'EXCLUDE' && hypothetical.has(rule.target_option_id)) {
      violations.push({
        ruleId: rule.id,
        sourceOptionId: rule.source_option_id,
        targetOptionId: rule.target_option_id,
        ruleType: 'EXCLUDE',
        description: rule.description,
      });
    }
  }

  return violations;
}

/**
 * Given a violation due to exclusion rule, determine which option
 * should be auto-deselected. Strategy: the older selection (source)
 * stays, the new/conflicting option (target) gets deselected.
 */
export function resolveConflict(
  selections: Selections,
  violation: RuleViolation,
  allOptions: Option[]
): string | null {
  // Return the option ID that should be REMOVED (the target)
  return violation.targetOptionId;
}
