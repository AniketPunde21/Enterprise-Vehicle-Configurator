// ===== Database Types (mirror Supabase schema) =====

export interface Model {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  model_url?: string | null;
  specs?: {
    engine: string;
    horsepower: string;
    acceleration: string;
  };
  created_at: string;
}

export interface Option {
  id: string;
  model_id: string;
  category: OptionCategory;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Rule {
  id: string;
  model_id: string;
  source_option_id: string;
  target_option_id: string;
  rule_type: 'EXCLUDE' | 'INCLUDE';
  description: string | null;
  created_at: string;
}

export interface Configuration {
  id: string;
  model_id: string;
  total_price: number;
  status: 'QUOTE' | 'ORDER';
  created_at: string;
}

export interface ConfigurationOption {
  id: string;
  configuration_id: string;
  option_id: string;
  created_at: string;
}

// ===== Application Types =====

export type OptionCategory =
  | 'engine'
  | 'transmission'
  | 'trim'
  | 'exterior'
  | 'interior'
  | 'wheels'
  | 'package';

export const STEP_ORDER: OptionCategory[] = [
  'engine',
  'trim',
  'exterior',
  'interior',
  'wheels',
  'package',
];

export interface StepInfo {
  category: OptionCategory;
  label: string;
  icon: string;
}

export const STEPS: StepInfo[] = [
  { category: 'engine', label: 'Powertrain', icon: '⚡' },
  { category: 'trim', label: 'Trim', icon: '✦' },
  { category: 'exterior', label: 'Exterior', icon: '🎨' },
  { category: 'interior', label: 'Interior', icon: '💎' },
  { category: 'wheels', label: 'Wheels', icon: '⊚' },
  { category: 'package', label: 'Packages', icon: '📦' },
];

// Selections keyed by category
export type Selections = Partial<Record<OptionCategory, string>>;

// Packages multi-select
export type PackageSelections = Set<string>;

export interface RuleViolation {
  ruleId: string;
  sourceOptionId: string;
  targetOptionId: string;
  ruleType: 'EXCLUDE' | 'INCLUDE';
  description: string | null;
}

export interface PricingBreakdown {
  basePrice: number;
  optionsPrices: { optionId: string; name: string; price: number }[];
  totalPrice: number;
}

export interface ConfiguratorState {
  model: Model | null;
  options: Option[];
  rules: Rule[];
  currentStep: number;
  selections: Selections;
  packageSelections: PackageSelections;
  disabledOptionIds: Set<string>;
  autoIncludedOptionIds: Set<string>;
  pricing: PricingBreakdown;
  violations: RuleViolation[];
  selectModel: (modelId: string) => void;
  clearModel: () => void;
}
