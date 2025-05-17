import { NextResponse } from 'next/server';
import supabase from '@/services/supabase';

export async function GET(request: Request) {
  try {
    // Get sort order from query parameters
    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Fetch total ads count
    const { count: totalCount } = await supabase.from('tin_dang').select('*', { count: 'exact', head: true });

    // Fetch active ads count
    const { count: activeCount } = await supabase.from('tin_dang').select('*', { count: 'exact', head: true }).eq('active', true);

    // Fetch VIP ads count
    const { count: vipCount } = await supabase.from('tin_dang').select('*', { count: 'exact', head: true }).eq('is_vip', true);

    // Get the date 30 days ago for data aggregation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch ads created in the last 30 days
    const { data: recentAds } = await supabase.from('tin_dang').select('created_at, id').gte('created_at', thirtyDaysAgo.toISOString());

    // Process data to count ads by day
    const dailyCounts: Record<string, { date: string; count: number; id: number }> = {};

    // Initialize the last 30 days with 0 counts
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCounts[dateStr] = { date: dateStr, count: 0, id: 1000 - i };
    }

    // Count ads for each day
    if (recentAds) {
      recentAds.forEach(ad => {
        const dateStr = new Date(ad.created_at).toISOString().split('T')[0];
        if (dailyCounts[dateStr]) {
          dailyCounts[dateStr].count++;
        }
      });
    }

    // Convert to array and sort by date
    const dailyData = Object.values(dailyCounts);

    // Sort the data based on the sort order
    const sortedData = [...dailyData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    // Fetch ads for the table with sorting
    const { data: tableAds } = await supabase
      .from('tin_dang')
      .select('id, tin_id, tieu_de, created_at, danh_muc, active, is_vip')
      .order('id', { ascending: sortOrder === 'asc' })
      .limit(10);

    // Format the ads data for the table
    const adsList = tableAds
      ? tableAds.map(ad => ({
          id: ad.id,
          tin_id: ad.tin_id,
          title: ad.tieu_de,
          date: ad.created_at,
          category: ad.danh_muc || 'Không có danh mục',
          status: ad.active ? 'active' : 'inactive',
          isVip: ad.is_vip,
        }))
      : [];

    return NextResponse.json({
      dailyData: sortedData,
      totalAds: totalCount || 0,
      activeAds: activeCount || 0,
      vipAds: vipCount || 0,
      adsList,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
