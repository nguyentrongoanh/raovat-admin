import supabase from '@/services/supabase';

export async function getDetailById(id: string) {
  const { data, error } = await supabase
    .from('tin_dang')
    .select('*')
    .eq('tin_id', id);

  return data;
}
