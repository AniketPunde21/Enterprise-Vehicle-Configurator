-- ==========================================
-- Enterprise Car Configuration Platform POC
-- Supabase Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Models Table
CREATE TABLE public.models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Options Table
-- Categories: engine, transmission, trim, exterior, interior, wheels, package
CREATE TABLE public.options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Rules Table
-- condition_type: 'INCLUDE', 'EXCLUDE', 'REQUIRE'
-- For example: IF option A is selected, MUST INCLUDE option B (target)
CREATE TABLE public.rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
    source_option_id UUID REFERENCES public.options(id) ON DELETE CASCADE,
    target_option_id UUID REFERENCES public.options(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- 'EXCLUDE', 'INCLUDE'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Configurations (Saved user quotes/orders)
CREATE TABLE public.configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES public.models(id),
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'QUOTE', -- 'QUOTE', 'ORDER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Configuration Options (Join table)
CREATE TABLE public.configuration_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    configuration_id UUID REFERENCES public.configurations(id) ON DELETE CASCADE,
    option_id UUID REFERENCES public.options(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- Insert Mock Data (Maserati Inspired)
-- ==========================================

-- Insert a Mock Model
INSERT INTO public.models (id, name, description, base_price, image_url)
VALUES (
    'm0000000-0000-0000-0000-000000000001',
    'Ghibli Trofeo',
    'The ultimate expression of Maserati performance and luxury.',
    125000.00,
    '/images/models/ghibli.webp'
) ON CONFLICT {id} DO NOTHING;

-- Insert Options for the Model
-- ENGINES
INSERT INTO public.options (id, model_id, category, name, price, is_default)
VALUES 
    ('e0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'engine', 'V8 Twin Turbo 580hp', 0.00, TRUE),
    ('e0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'engine', 'V6 Hybrid 330hp', -15000.00, FALSE);

-- TRIMS
INSERT INTO public.options (id, model_id, category, name, price, is_default)
VALUES 
    ('t0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'trim', 'GT', 0.00, TRUE),
    ('t0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'trim', 'Modena', 12000.00, FALSE),
    ('t0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000001', 'trim', 'Trofeo', 25000.00, FALSE);

-- EXTERIOR
INSERT INTO public.options (id, model_id, category, name, price, is_default)
VALUES 
    ('x0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'exterior', 'Bianco Alpi (White)', 0.00, TRUE),
    ('x0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'exterior', 'Nero Ribelle (Black)', 1200.00, FALSE),
    ('x0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000001', 'exterior', 'Rosso Magma (Red)', 3500.00, FALSE);

-- INTERIOR
INSERT INTO public.options (id, model_id, category, name, price, is_default)
VALUES 
    ('i0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'interior', 'Nero Premium Leather', 0.00, TRUE),
    ('i0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'interior', 'Rosso Corallo Leather', 2500.00, FALSE);

-- WHEELS
INSERT INTO public.options (id, model_id, category, name, price, is_default)
VALUES 
    ('w0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'wheels', '20" Teseo Wheels', 0.00, TRUE),
    ('w0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'wheels', '21" Orione Forged Wheels', 3500.00, FALSE);

-- PACKAGES
INSERT INTO public.options (id, model_id, category, name, price, is_default)
VALUES 
    ('p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'package', 'Carbon Fiber Exterior Package', 4500.00, FALSE),
    ('p0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'package', 'Cold Weather Package', 1500.00, FALSE);


-- Insert Rules
-- 1. Trofeo Trim (t...03) REQUIRES V8 Engine (e...01), basically EXCLUDES V6 (e...02)
INSERT INTO public.rules (model_id, source_option_id, target_option_id, rule_type, description)
VALUES 
    ('m0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'EXCLUDE', 'Trofeo trim is not compatible with V6 Hybrid engine.');

-- 2. Carbon Fiber Exterior Package (p...01) EXCLUDES GT Trim (t...01)
INSERT INTO public.rules (model_id, source_option_id, target_option_id, rule_type, description)
VALUES 
    ('m0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'EXCLUDE', 'Carbon Fiber Package requires Modena or Trofeo trim.');

-- 3. Rosso Corallo Leather (i...02) EXCLUDES Rosso Magma (Red) Exterior (x...03) to prevent color clash
INSERT INTO public.rules (model_id, source_option_id, target_option_id, rule_type, description)
VALUES 
    ('m0000000-0000-0000-0000-000000000001', 'i0000000-0000-0000-0000-000000000002', 'x0000000-0000-0000-0000-000000000003', 'EXCLUDE', 'Red interior cannot be combined with Red exterior.');
