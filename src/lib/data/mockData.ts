import type { Model, Option, Rule } from '@/types';

export const MOCK_MODELS: Model[] = [
  {
    id: 'm-ghibli',
    name: 'Ghibli Trofeo',
    description: 'The ultimate expression of performance and luxury.',
    base_price: 10000000,
    image_url: '/cars/ghibli/exterior/white/01.svg',
    specs: { engine: 'V8 Twin Turbo', horsepower: '580 hp', acceleration: '4.0s' },
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-levante',
    name: 'Levante',
    description: 'The SUV with sports car performance.',
    base_price: 12500000,
    image_url: '/cars/levante/exterior/white/01.svg',
    specs: { engine: 'V6 Twin Turbo', horsepower: '430 hp', acceleration: '5.2s' },
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-grecale',
    name: 'Grecale',
    description: 'Everyday exceptional. The new mid-size SUV.',
    base_price: 8500000,
    image_url: '/cars/grecale/exterior/white/01.svg',
    specs: { engine: 'L4 Mild Hybrid', horsepower: '330 hp', acceleration: '5.6s' },
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-mc20',
    name: 'MC20',
    description: 'The first of its kind. The super sports car that pushes the boundaries of time.',
    base_price: 25000000,
    image_url: '/cars/mc20/exterior/white/01.svg',
    specs: { engine: 'V6 Nettuno', horsepower: '630 hp', acceleration: '2.9s' },
    created_at: new Date().toISOString(),
  }
];

// Helper to generate generic options for any model to save space
function generateOptionsForModel(modelId: string): Option[] {
  return [
    { id: `e1-${modelId}`, model_id: modelId, category: 'engine', name: 'Standard Powertrain', description: 'Base engine configuration.', price: 0, image_url: null, is_default: true, created_at: new Date().toISOString() },
    { id: `e2-${modelId}`, model_id: modelId, category: 'engine', name: 'Performance Upgrade', description: 'Higher horsepower output.', price: 1500000, image_url: null, is_default: false, created_at: new Date().toISOString() },
    
    { id: `t1-${modelId}`, model_id: modelId, category: 'trim', name: 'GT', description: 'Grand touring trim.', price: 0, image_url: null, is_default: true, created_at: new Date().toISOString() },
    { id: `t2-${modelId}`, model_id: modelId, category: 'trim', name: 'Trofeo', description: 'Maximum performance aesthetics.', price: 2000000, image_url: null, is_default: false, created_at: new Date().toISOString() },

    { id: `x1-${modelId}`, model_id: modelId, category: 'exterior', name: 'Bianco (White)', description: 'Solid white.', price: 0, image_url: null, is_default: true, created_at: new Date().toISOString() },
    { id: `x2-${modelId}`, model_id: modelId, category: 'exterior', name: 'Nero (Black)', description: 'Solid black.', price: 50000, image_url: null, is_default: false, created_at: new Date().toISOString() },
    { id: `x3-${modelId}`, model_id: modelId, category: 'exterior', name: 'Rosso (Red)', description: 'Metallic red.', price: 150000, image_url: null, is_default: false, created_at: new Date().toISOString() },
    { id: `x4-${modelId}`, model_id: modelId, category: 'exterior', name: 'Blu (Blue)', description: 'Deep sea blue metallic.', price: 150000, image_url: null, is_default: false, created_at: new Date().toISOString() },
    { id: `x5-${modelId}`, model_id: modelId, category: 'exterior', name: 'Grigio (Grey)', description: 'Gunmetal grey metallic.', price: 120000, image_url: null, is_default: false, created_at: new Date().toISOString() },

    { id: `i1-${modelId}`, model_id: modelId, category: 'interior', name: 'Nero (Black)', description: 'Premium black leather.', price: 0, image_url: null, is_default: true, created_at: new Date().toISOString() },
    { id: `i2-${modelId}`, model_id: modelId, category: 'interior', name: 'Rosso (Red)', description: 'Sport red leather.', price: 250000, image_url: null, is_default: false, created_at: new Date().toISOString() },
    { id: `i3-${modelId}`, model_id: modelId, category: 'interior', name: 'Cuoio (Tan)', description: 'Classic tan leather.', price: 200000, image_url: null, is_default: false, created_at: new Date().toISOString() },

    { id: `w1-${modelId}`, model_id: modelId, category: 'wheels', name: '20" Standard', description: '20-inch alloy wheels.', price: 0, image_url: null, is_default: true, created_at: new Date().toISOString() },
    { id: `w2-${modelId}`, model_id: modelId, category: 'wheels', name: '21" Forged', description: '21-inch forged dark wheels.', price: 350000, image_url: null, is_default: false, created_at: new Date().toISOString() },

    { id: `p1-${modelId}`, model_id: modelId, category: 'package', name: 'Carbon Fiber Pack', description: 'Interior and exterior carbon fiber accents.', price: 500000, image_url: null, is_default: false, created_at: new Date().toISOString() },
    { id: `p2-${modelId}`, model_id: modelId, category: 'package', name: 'Driver Assistance', description: 'Adaptive cruise and lane keeping.', price: 250000, image_url: null, is_default: false, created_at: new Date().toISOString() },
  ];
}

export const MOCK_OPTIONS: Option[] = [
    ...generateOptionsForModel('m-ghibli'),
    ...generateOptionsForModel('m-levante'),
    ...generateOptionsForModel('m-grecale'),
    ...generateOptionsForModel('m-mc20'),
];

export const MOCK_RULES: Rule[] = [];
