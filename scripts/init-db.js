const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSchema() {
    const password = 'Aniket@130799';
    // Use the Supabase generic pooling format or direct connection string
    // Usually host is aws-0-ap-south-1.pooler.supabase.com or similar but we can try the direct db connection first.
    // The direct db connection might be db.upqhiwujwexodudilaoi.supabase.co
    const connStr = `postgres://postgres.upqhiwujwexodudilaoi:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
    
    // Fallback if transaction pooling URI fails
    const directConnStr = `postgres://postgres:${encodeURIComponent(password)}@db.upqhiwujwexodudilaoi.supabase.co:5432/postgres`;

    let client = new Client({ connectionString: connStr });
    try {
        await client.connect();
        console.log('Connected via pooler URL');
    } catch(e) {
        console.log('Pooler connection failed, trying direct connection...', e.message);
        client = new Client({ connectionString: directConnStr });
        await client.connect();
        console.log('Connected via direct URL');
    }

    try {
        // Just run an ALTER table since the table already exists from the user's manual run earlier
        const sql = `ALTER TABLE public.models ADD COLUMN IF NOT EXISTS model_url TEXT;`;
        await client.query(sql);
        console.log('Schema executed successfully. Added model_url');
    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await client.end();
    }
}

runSchema();
