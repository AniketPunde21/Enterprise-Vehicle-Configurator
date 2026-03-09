// scripts/seed-supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We need to import our mock data from the source file
// Because we're running this in Node, we can't easily import TS files that use Next.js aliases
// We will simply paste the relevant data here so the script is self-contained.

export const MOCK_MODELS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Tata Estate',
    description: 'The classic Indian station wagon built for space and reliability.',
    base_price: 550000,
    image_url: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800&q=80',
    model_url: '/cars/glbimages/tata_2000g.c_model.glb',
    specs: { engine: '2.0L Diesel', horsepower: '90 hp', acceleration: '15.0s' }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Tata Safari',
    description: 'Reclaim your life with the iconic Indian SUV.',
    base_price: 1619000,
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    model_url: '/cars/glbimages/2021_tata_safari.glb',
    specs: { engine: 'Kryotec 2.0L Turbo Diesel', horsepower: '170 hp', acceleration: '11.2s' }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Tata Punch',
    description: 'Vibes with every drive. The no-compromise micro SUV.',
    base_price: 612000,
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    model_url: '/cars/glbimages/tata_punch_tropical_mist.glb',
    specs: { engine: '1.2L Revotron', horsepower: '86 hp', acceleration: '13.5s' }
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Tata Nano',
    description: 'The people\'s car. Compact, efficient, and iconic.',
    base_price: 250000,
    image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    model_url: '/cars/glbimages/tata_nano.glb',
    specs: { engine: '0.6L MPFi', horsepower: '38 hp', acceleration: '29.0s' }
  }
];

function generateOptionsForModel(modelId: string) {
  // We use stable UUIDs generated sequentially for ease, normally Supabase makes them.
  // Options need real UUIDs to satisfy the schema references.
  const sid = modelId.split('-')[0]; // e.g. '11111111'
  let ct = 1;
  const genId = () => `${sid}-0000-0000-0000-${String(ct++).padStart(12, '0')}`;

  return [
    { id: genId(), model_id: modelId, category: 'engine', name: 'Standard Powertrain', description: 'Base engine configuration.', price: 0, image_url: null, is_default: true },
    { id: genId(), model_id: modelId, category: 'engine', name: 'Performance Upgrade', description: 'Higher horsepower output.', price: 1500000, image_url: null, is_default: false },
    
    { id: genId(), model_id: modelId, category: 'trim', name: 'GT', description: 'Grand touring trim.', price: 0, image_url: null, is_default: true },
    { id: genId(), model_id: modelId, category: 'trim', name: 'Trofeo', description: 'Maximum performance aesthetics.', price: 2000000, image_url: null, is_default: false },

    { id: genId(), model_id: modelId, category: 'exterior', name: 'Bianco (White)', description: 'Solid white.', price: 0, image_url: null, is_default: true },
    { id: genId(), model_id: modelId, category: 'exterior', name: 'Nero (Black)', description: 'Solid black.', price: 50000, image_url: null, is_default: false },
    { id: genId(), model_id: modelId, category: 'exterior', name: 'Rosso (Red)', description: 'Metallic red.', price: 150000, image_url: null, is_default: false },
    { id: genId(), model_id: modelId, category: 'exterior', name: 'Blu (Blue)', description: 'Deep sea blue metallic.', price: 150000, image_url: null, is_default: false },
    { id: genId(), model_id: modelId, category: 'exterior', name: 'Grigio (Grey)', description: 'Gunmetal grey metallic.', price: 120000, image_url: null, is_default: false },

    { id: genId(), model_id: modelId, category: 'interior', name: 'Nero (Black)', description: 'Premium black leather.', price: 0, image_url: null, is_default: true },
    { id: genId(), model_id: modelId, category: 'interior', name: 'Rosso (Red)', description: 'Sport red leather.', price: 250000, image_url: null, is_default: false },
    { id: genId(), model_id: modelId, category: 'interior', name: 'Cuoio (Tan)', description: 'Classic tan leather.', price: 200000, image_url: null, is_default: false },

    { id: genId(), model_id: modelId, category: 'wheels', name: '20" Standard', description: '20-inch alloy wheels.', price: 0, image_url: null, is_default: true },
    { id: genId(), model_id: modelId, category: 'wheels', name: '21" Forged', description: '21-inch forged dark wheels.', price: 350000, image_url: null, is_default: false },

    { id: genId(), model_id: modelId, category: 'package', name: 'Carbon Fiber Pack', description: 'Interior and exterior carbon fiber accents.', price: 500000, image_url: null, is_default: false },
    { id: genId(), model_id: modelId, category: 'package', name: 'Driver Assistance', description: 'Adaptive cruise and lane keeping.', price: 250000, image_url: null, is_default: false },
  ];
}

async function seed() {
  console.log('Seeding Models...');
  
  // Clear existing to avoid conflicts
  console.log('Clearing existing data...');
  await supabase.from('rules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('options').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('models').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { error: modelsError } = await supabase.from('models').insert(MOCK_MODELS);
  if (modelsError) {
    console.error('Error seeding models:', modelsError);
    return;
  }
  
  console.log('Seeding Options...');
  let allOptions: any[] = [];
  MOCK_MODELS.forEach(m => {
    allOptions = allOptions.concat(generateOptionsForModel(m.id));
  });

  const { error: optionsError } = await supabase.from('options').insert(allOptions);
  if (optionsError) {
    console.error('Error seeding options:', optionsError);
    return;
  }

  // Generate some rules
  console.log('Seeding Rules...');
  const rules = [
    // Trofeo trim EXCLUDES Standard Powertrain for Ghibli
    {
      model_id: MOCK_MODELS[0].id,
      source_option_id: allOptions.find(o => o.model_id === MOCK_MODELS[0].id && o.name === 'Trofeo')?.id,
      target_option_id: allOptions.find(o => o.model_id === MOCK_MODELS[0].id && o.name === 'Standard Powertrain')?.id,
      rule_type: 'EXCLUDE',
      description: 'Trofeo trim is not compatible with Standard Powertrain.'
    },
    // Carbon Fiber EXCLUDES GT Trim
    {
      model_id: MOCK_MODELS[0].id,
      source_option_id: allOptions.find(o => o.model_id === MOCK_MODELS[0].id && o.name === 'Carbon Fiber Pack')?.id,
      target_option_id: allOptions.find(o => o.model_id === MOCK_MODELS[0].id && o.name === 'GT')?.id,
      rule_type: 'EXCLUDE',
      description: 'Carbon Fiber Package requires Trofeo trim.'
    }
  ];

  const { error: rulesError } = await supabase.from('rules').insert(rules);
  if (rulesError) {
      console.error('Error seeding rules:', rulesError);
      return;
  }

  console.log('Database seeded successfully!');
}

seed().catch(console.error);
