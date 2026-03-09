'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Model, Option, Rule, Selections, PricingBreakdown, RuleViolation, OptionCategory } from '@/types';
import { STEPS } from '@/types';
import { evaluateRules } from '@/lib/engine/rules';
import { calculatePricing } from '@/lib/engine/pricing';
import { supabase } from '@/lib/supabase/client';

export function useConfigurator() {
  const [model, setModel] = useState<Model | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [packageSelections, setPackageSelections] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<string[]>([]);

  const [isInitializing, setIsInitializing] = useState(true);

  // Global state holding everything from the DB
  const [dbModels, setDbModels] = useState<Model[]>([]);
  const [dbOptions, setDbOptions] = useState<Option[]>([]);

  // Fetch all foundation data on mount
  useEffect(() => {
    async function fetchDatabase() {
      try {
        const [modelsRes, optionsRes, rulesRes] = await Promise.all([
          supabase.from('models').select('*'),
          supabase.from('options').select('*'),
          supabase.from('rules').select('*')
        ]);

        if (modelsRes.data) setDbModels(modelsRes.data);
        if (optionsRes.data) setDbOptions(optionsRes.data);
        if (rulesRes.data) setRules(rulesRes.data);
      } catch (err) {
        console.error('Failed to fetch configurator data from Supabase:', err);
      } finally {
        setIsInitializing(false);
      }
    }

    fetchDatabase();
  }, []);

  const selectModel = useCallback((modelId: string) => {
    const selectedModel = dbModels.find((m: Model) => m.id === modelId);
    if (!selectedModel) return;

    setModel(selectedModel);
    
    // Filter options for this model
    const modelOptions = dbOptions.filter((o: Option) => o.model_id === modelId);
    setOptions(modelOptions);

    // Reset step
    setCurrentStep(0);
    setPackageSelections(new Set());
    setNotifications([]);

    // Auto-select defaults for this model
    const defaults: Selections = {};
    modelOptions.forEach((opt) => {
      if (opt.is_default && opt.category !== 'package') {
        defaults[opt.category] = opt.id;
      }
    });
    setSelections(defaults);
  }, [dbModels, dbOptions]);

  const clearModel = useCallback(() => {
    setModel(null);
    setOptions([]);
    setCurrentStep(0);
    setSelections({});
    setPackageSelections(new Set());
    setNotifications([]);
  }, []);

  // Get all selected option IDs (single-select + multi-select packages)
  const selectedOptionIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(selections).forEach((id) => {
      if (id) ids.add(id);
    });
    packageSelections.forEach((id) => ids.add(id));
    return ids;
  }, [selections, packageSelections]);

  // Evaluate rules
  const ruleResult = useMemo(() => {
    return evaluateRules(rules, options, selectedOptionIds);
  }, [rules, options, selectedOptionIds]);

  // Calculate pricing
  const pricing: PricingBreakdown = useMemo(() => {
    return calculatePricing(model, options, selectedOptionIds);
  }, [model, options, selectedOptionIds]);

  // Select an option (single-select per category, except packages)
  const selectOption = useCallback(
    (category: OptionCategory, optionId: string) => {
      if (ruleResult.disabledOptionIds.has(optionId)) return;

      if (category === 'package') {
        setPackageSelections((prev) => {
          const next = new Set(prev);
          if (next.has(optionId)) {
            next.delete(optionId);
          } else {
            next.add(optionId);
          }
          return next;
        });
      } else {
        setSelections((prev) => {
          const next = { ...prev, [category]: optionId };

          // After selecting, check if current selections cause violations
          // and auto-deselect conflicting options
          const newIds = new Set<string>();
          Object.values(next).forEach((id) => { if (id) newIds.add(id); });
          packageSelections.forEach((id) => newIds.add(id));

          const result = evaluateRules(rules, options, newIds);

          const removedNotifications: string[] = [];

          // Auto-deselect violated options
          result.violations.forEach((v) => {
            const targetOpt = options.find((o) => o.id === v.targetOptionId);
            const targetCat = targetOpt?.category;
            if (targetCat && targetCat !== category) {
              // Remove from the appropriate selection
              if (targetCat === 'package') {
                setPackageSelections((ps) => {
                  const ns = new Set(ps);
                  ns.delete(v.targetOptionId);
                  return ns;
                });
              } else {
                // Find default for that category
                const defaultOpt = options.find(
                  (o) => o.category === targetCat && o.is_default && !result.disabledOptionIds.has(o.id)
                );
                if (defaultOpt) {
                  next[targetCat] = defaultOpt.id;
                } else {
                  delete next[targetCat];
                }
              }
              removedNotifications.push(
                `${targetOpt?.name} was removed: ${v.description}`
              );
            }
          });

          if (removedNotifications.length > 0) {
            setNotifications(removedNotifications);
            setTimeout(() => setNotifications([]), 5000);
          }

          return next;
        });
      }
    },
    [ruleResult, rules, options, packageSelections]
  );

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Options for the current step
  const currentCategory = currentStep < STEPS.length ? STEPS[currentStep].category : null;
  const currentOptions = useMemo(() => {
    if (!currentCategory) return [];
    return options.filter((o) => o.category === currentCategory);
  }, [options, currentCategory]);

  return {
    model,
    options,
    rules,
    currentStep,
    selections,
    packageSelections,
    selectedOptionIds,
    disabledOptionIds: ruleResult.disabledOptionIds,
    autoIncludedOptionIds: ruleResult.autoIncludedOptionIds,
    violations: ruleResult.violations,
    pricing,
    currentCategory,
    currentOptions,
    notifications,
    isInitializing,
    dbModels,
    selectModel,
    clearModel,
    selectOption,
    goToStep,
    nextStep,
    prevStep,
  };
}
