import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are defined with fallbacks or assertions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if environment variables are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing. Authentication and database features may not work properly.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default supabase;
