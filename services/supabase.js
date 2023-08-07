import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://umdoztccetipomspexag.supabase.co';
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZG96dGNjZXRpcG9tc3BleGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkwODA3MjIsImV4cCI6MjAwNDY1NjcyMn0.upNmqR6nI3lAQ8baLuv_teXxU8a4KB6PoXpJrewo9HI';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default supabase;
