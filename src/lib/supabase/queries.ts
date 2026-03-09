import { supabase } from './client';
import type { Model, Option, Rule } from '@/types';

export async function fetchModels(): Promise<Model[]> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchOptionsByModel(modelId: string): Promise<Option[]> {
  const { data, error } = await supabase
    .from('options')
    .select('*')
    .eq('model_id', modelId)
    .order('category')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchRulesByModel(modelId: string): Promise<Rule[]> {
  const { data, error } = await supabase
    .from('rules')
    .select('*')
    .eq('model_id', modelId);
  if (error) throw error;
  return data ?? [];
}

export async function saveConfiguration(
  modelId: string,
  totalPrice: number,
  optionIds: string[],
  status: 'QUOTE' | 'ORDER' = 'QUOTE'
) {
  // Insert configuration
  const { data: config, error: configError } = await supabase
    .from('configurations')
    .insert({ model_id: modelId, total_price: totalPrice, status })
    .select()
    .single();

  if (configError) throw configError;

  // Insert configuration options
  if (optionIds.length > 0) {
    const configOptions = optionIds.map((optionId) => ({
      configuration_id: config.id,
      option_id: optionId,
    }));

    const { error: optionsError } = await supabase
      .from('configuration_options')
      .insert(configOptions);

    if (optionsError) throw optionsError;
  }

  return config;
}
