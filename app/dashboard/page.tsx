'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Image from 'next/image';
import iconItems from '@/public/svg/items.svg';

interface DailyAdCount {
  date: string;
  count: number;
}

export default function DashboardPage() {
  const [dailyData, setDailyData] = useState<DailyAdCount[]>([]);
  const [totalAds, setTotalAds] = useState<number>(0);
  const [activeAds, setActiveAds] = useState<number>(0);
  const [vipAds, setVipAds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('14days');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Define interface for ad items
  interface AdItem {
    id: number;
    tin_id?: string;
    title: string;
    date: string;
    category: string;
    status: string;
    isVip: boolean;
  }

  const [adsList, setAdsList] = useState<AdItem[]>([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch data from our mock API with sort order
      const response = await fetch(`/api/dashboard?sortOrder=${sortOrder}`);
      const data = await response.json();

      setTotalAds(data.totalAds);
      setActiveAds(data.activeAds);
      setVipAds(data.vipAds);
      setDailyData(data.dailyData);
      setAdsList(data.adsList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Fetch data when component mounts or sort order changes
  useEffect(() => {
    fetchDashboardData();
  }, [sortOrder]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Calculate percentage for active ads
  const activeAdsPercentage = totalAds > 0 ? Math.round((activeAds / totalAds) * 100) : 0;

  // Calculate percentage for VIP ads
  const vipAdsPercentage = totalAds > 0 ? Math.round((vipAds / totalAds) * 100) : 0;

  // Data for pie chart
  const pieData = [
    { name: 'Tin VIP', value: vipAds, color: '#eab308' },
    { name: 'Tin thường', value: activeAds - vipAds, color: '#3b82f6' },
    { name: 'Tin không hoạt động', value: totalAds - activeAds, color: '#9ca3af' },
  ];

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (selectedTimeRange === '7days') {
      return dailyData.slice(-7);
    } else if (selectedTimeRange === '30days') {
      return dailyData;
    } else {
      return dailyData;
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className='bg-gray-50 w-full min-h-screen'>
      {/* Header */}
      <div className='bg-white w-full p-6 flex justify-between items-center shadow-sm'>
        <div className='flex items-center space-x-4'>
          <div className='bg-indigo-100 p-3 rounded-full'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
            </svg>
          </div>
          <div>
            <h1 className='text-2xl text-gray-800 font-bold'>Dashboard</h1>
            <p className='text-gray-500 text-sm'>Thống kê tin đăng theo ngày</p>
          </div>
        </div>
        <div className='flex space-x-2'>
          <button onClick={() => setSelectedTimeRange('7days')} className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTimeRange === '7days' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            7 ngày
          </button>
          <button onClick={() => setSelectedTimeRange('14days')} className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTimeRange === '14days' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            14 ngày
          </button>
          <button onClick={() => setSelectedTimeRange('30days')} className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTimeRange === '30days' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            30 ngày
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className='p-6'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600'></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100'>
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-sm font-medium text-gray-500 mb-1'>Tổng số tin đăng</p>
                    <h3 className='text-3xl font-bold text-gray-800'>{totalAds}</h3>
                  </div>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                    </svg>
                  </div>
                </div>
                <div className='mt-4 flex items-center'>
                  <span className='text-sm text-gray-500'>Tất cả các tin đăng trong hệ thống</span>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100'>
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-sm font-medium text-gray-500 mb-1'>Tin đăng đang hoạt động</p>
                    <h3 className='text-3xl font-bold text-gray-800'>{activeAds}</h3>
                  </div>
                  <div className='bg-green-100 p-3 rounded-full'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='w-full bg-gray-200 rounded-full h-2.5'>
                    <div className='bg-green-600 h-2.5 rounded-full' style={{ width: `${activeAdsPercentage}%` }}></div>
                  </div>
                  <p className='text-sm text-gray-500 mt-2'>{activeAdsPercentage}% của tổng số tin</p>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100'>
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-sm font-medium text-gray-500 mb-1'>Tin đăng VIP</p>
                    <h3 className='text-3xl font-bold text-gray-800'>{vipAds}</h3>
                  </div>
                  <div className='bg-yellow-100 p-3 rounded-full'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-yellow-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='w-full bg-gray-200 rounded-full h-2.5'>
                    <div className='bg-yellow-500 h-2.5 rounded-full' style={{ width: `${vipAdsPercentage}%` }}></div>
                  </div>
                  <p className='text-sm text-gray-500 mt-2'>{vipAdsPercentage}% của tổng số tin</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
              {/* Bar Chart */}
              <div className='bg-white p-6 rounded-xl shadow-sm lg:col-span-2 border border-gray-100'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-lg font-semibold text-gray-800'>Số lượng tin đăng theo ngày</h2>
                  <div className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>{selectedTimeRange === '7days' ? '7 ngày gần đây' : selectedTimeRange === '14days' ? '14 ngày gần đây' : '30 ngày gần đây'}</div>
                </div>
                <div className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={20}>
                      <CartesianGrid strokeDasharray='3 3' vertical={false} />
                      <XAxis dataKey='date' tickFormatter={formatDate} axisLine={false} tickLine={false} dy={10} />
                      <YAxis axisLine={false} tickLine={false} width={30} />
                      <Tooltip formatter={value => [`${value} tin đăng`, 'Số lượng']} labelFormatter={label => `Ngày: ${formatDate(label)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Bar dataKey='count' name='Số tin đăng' fill='#4f46e5' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800 mb-6'>Phân loại tin đăng</h2>
                <div className='h-80 flex flex-col justify-center'>
                  <ResponsiveContainer width='100%' height='80%'>
                    <PieChart>
                      <Pie data={pieData} cx='50%' cy='50%' innerRadius={60} outerRadius={90} paddingAngle={5} dataKey='value' label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [`${value} tin đăng`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className='flex justify-center space-x-4 mt-4'>
                    {pieData.map((entry, index) => (
                      <div key={index} className='flex items-center'>
                        <div className='w-3 h-3 rounded-full mr-2' style={{ backgroundColor: entry.color }}></div>
                        <span className='text-xs text-gray-600'>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-800 mb-6'>Xu hướng tin đăng</h2>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='date' tickFormatter={formatDate} axisLine={false} tickLine={false} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={30} />
                    <Tooltip formatter={value => [`${value} tin đăng`, 'Số lượng']} labelFormatter={label => `Ngày: ${formatDate(label)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Line type='monotone' dataKey='count' name='Số tin đăng' stroke='#4f46e5' strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: 'white' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ads Table */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-lg font-semibold text-gray-800'>Danh sách tin đăng gần đây</h2>
                <button onClick={toggleSortOrder} className='flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors'>
                  <span>Sắp xếp theo Ngày đăng</span>
                  {sortOrder === 'desc' ? (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  ) : (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                    </svg>
                  )}
                </button>
              </div>

              <div className='overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                <div className='inline-block min-w-full align-middle'>
                  <div className='overflow-hidden border border-gray-200 sm:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th scope='col' className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6'>
                            ID
                          </th>
                          <th scope='col' className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6'>
                            Tiêu đề
                          </th>
                          <th scope='col' className='hidden px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell sm:px-6'>
                            Ngày đăng
                          </th>
                          <th scope='col' className='hidden px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:table-cell sm:px-6'>
                            Danh mục
                          </th>
                          <th scope='col' className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6'>
                            Trạng thái
                          </th>
                          <th scope='col' className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6'>
                            VIP
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {adsList.map(ad => (
                          <tr key={ad.id} className='hover:bg-gray-50'>
                            <td className='px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6'>{ad.id}</td>
                            <td className='px-3 py-4 text-sm text-gray-500 sm:px-6'>
                              <div className='max-w-[150px] sm:max-w-xs truncate'>
                                {ad.tin_id ? (
                                  <a href={`/edit?id=${ad.tin_id}`} className='text-indigo-600 hover:text-indigo-900'>
                                    {ad.title || `Tin đăng ${ad.id}`}
                                  </a>
                                ) : (
                                  ad.title || `Tin đăng ${ad.id}`
                                )}
                              </div>
                            </td>
                            <td className='hidden px-3 py-4 whitespace-nowrap text-sm text-gray-500 md:table-cell sm:px-6'>{new Date(ad.date).toLocaleDateString('vi-VN')}</td>
                            <td className='hidden px-3 py-4 whitespace-nowrap text-sm text-gray-500 lg:table-cell sm:px-6'>{ad.category}</td>
                            <td className='px-3 py-4 whitespace-nowrap sm:px-6'>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{ad.status === 'active' ? 'Hoạt động' : 'Không'}</span>
                            </td>
                            <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6'>
                              {ad.isVip ? (
                                <span className='text-yellow-500'>
                                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                  </svg>
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile Card View (visible on small screens) */}
              <div className='mt-4 grid grid-cols-1 gap-4 sm:hidden'>
                {adsList.map(ad => (
                  <div key={ad.id} className='bg-white overflow-hidden shadow rounded-lg border border-gray-200'>
                    <div className='px-4 py-5 sm:p-6'>
                      <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-gray-500'>ID: {ad.id}</div>
                        {ad.isVip && (
                          <span className='text-yellow-500'>
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className='mt-2 text-base font-semibold text-gray-900'>
                        {ad.tin_id ? (
                          <a href={`/edit?id=${ad.tin_id}`} className='text-indigo-600 hover:text-indigo-900'>
                            {ad.title || `Tin đăng ${ad.id}`}
                          </a>
                        ) : (
                          ad.title || `Tin đăng ${ad.id}`
                        )}
                      </div>
                      <div className='mt-3 flex justify-between'>
                        <div className='text-sm text-gray-500'>{new Date(ad.date).toLocaleDateString('vi-VN')}</div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{ad.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                      </div>
                      <div className='mt-1 text-sm text-gray-500'>{ad.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
