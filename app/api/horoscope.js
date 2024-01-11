import supabase from '@/services/supabase.js';

const { data, error } = await supabase
  .from('tu_vi')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select();
