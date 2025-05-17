'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { columns } from './columns';
import { DataTable } from './data-table';
import supabase from '@/services/supabase.js';

import iconItems from '@/public/svg/items.svg';
import { Button } from '@/components/ui/button';
import ReactPaginate from 'react-paginate';

import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export default function DemoPage() {
  const [data, setData] = useState<any[] | null>([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<'id' | 'ngay_dang'>('ngay_dang');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { count, error } = await supabase.from('tin_dang').select('*', { count: 'exact', head: true }).eq('active', true).eq('is_vip', false);

      if (error) {
        console.error(error);
      } else {
        setPages(Math.ceil(count! / itemsPerPage));
      }
    };

    fetchData();
  }, []);

  // Function to process data for display
  const processData = (data: any[]) => {
    if (!data || data.length === 0) return [];

    // Create a copy of the data to avoid mutating the original
    let processedData = [...data];

    // Sort the processed data based on the current sort field and order
    if (sortField === 'id') {
      // When sorting by ID (which is now date+time), we're actually sorting by date
      processedData.sort((a, b) => {
        const dateA = a.ngay_dang ? new Date(a.ngay_dang) : new Date();
        const dateB = b.ngay_dang ? new Date(b.ngay_dang) : new Date();

        // Sort by timestamp
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
    } else if (sortField === 'ngay_dang') {
      // When sorting by date, it's the same as sorting by ID now
      processedData.sort((a, b) => {
        const dateA = a.ngay_dang ? new Date(a.ngay_dang) : new Date();
        const dateB = b.ngay_dang ? new Date(b.ngay_dang) : new Date();

        // Sort by timestamp
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
    }

    return processedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, count, error } = await supabase
          .from('tin_dang')
          .select('*', { count: 'exact' })
          .eq('active', true)
          .eq('is_vip', false)
          .limit(1000)
          .range(currentPage * 10, currentPage * 10 + 9)
          .order(sortField, { ascending: sortOrder === 'asc' });

        if (error) {
          console.error(error);
        } else {
          // Process the data to add sequential IDs
          const processedData = processData(data);
          setData(processedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortField, sortOrder]);

  const handleClick = () => {
    router.push('/create');
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const toggleSortField = (field: 'id' | 'ngay_dang') => {
    if (sortField === field) {
      // If already sorting by this field, toggle the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If switching fields, default to ascending order
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Header */}
      <div className='bg-white w-full p-3 md:p-4 flex flex-wrap md:flex-nowrap justify-between items-center shadow-md'>
        <div className='flex items-center space-x-3 md:space-x-5 mb-2 md:mb-0 w-full md:w-auto'>
          <div className='bg-gray-100 p-2 md:p-3 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-6 md:w-[28px]' />
          </div>
          <h1 className='text-lg md:text-2xl text-[#343a40] font-semibold truncate'>Danh sách tin đăng</h1>
        </div>
        <Button className='w-full md:w-auto h-fit bg-green-700 text-white font-semibold p-2 px-4 md:px-6 rounded-[5px] shadow-sm shadow-green-700' onClick={handleClick}>
          Create
        </Button>
      </div>
      {/* Table */}
      <div className='bg-white w-full shadow-sm overflow-hidden border-t border-gray-100'>
        {/* Sorting Controls */}
        <div className='px-3 py-2 md:px-4 md:py-3 border-b border-gray-200'>
          <div className='flex items-center mb-2'>
            <div className='text-sm md:text-base font-medium text-gray-700 mr-2'>Sắp xếp theo:</div>
            <div className='text-xs text-gray-500 flex items-center'>
              <span className='font-medium text-indigo-600 mr-1'>{sortField === 'id' ? 'ID' : 'Ngày đăng'}</span>
              <span>({sortOrder === 'asc' ? 'Cũ nhất trước' : 'Mới nhất trước'})</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => toggleSortField('id')}
              className={`flex items-center justify-center space-x-1 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors border ${sortField === 'id' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:bg-gray-100 border-gray-200'}`}
            >
              <span>ID</span>
              {sortField === 'id' && (
                <svg xmlns='http://www.w3.org/2000/svg' className={`h-3 w-3 ml-1 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                </svg>
              )}
            </button>

            <button
              onClick={() => toggleSortField('ngay_dang')}
              className={`flex items-center justify-center space-x-1 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors border ${sortField === 'ngay_dang' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:bg-gray-100 border-gray-200'}`}
            >
              <span>Ngày đăng</span>
              {sortField === 'ngay_dang' && (
                <svg xmlns='http://www.w3.org/2000/svg' className={`h-3 w-3 ml-1 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                </svg>
              )}
            </button>

            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className='flex items-center justify-center space-x-1 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors border text-gray-600 hover:bg-gray-100 border-gray-200 ml-auto'>
              <span>{sortOrder === 'asc' ? 'Cũ nhất trước' : 'Mới nhất trước'}</span>
              <svg xmlns='http://www.w3.org/2000/svg' className={`h-3 w-3 ml-1 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
              </svg>
            </button>
          </div>
        </div>
        <div className='overflow-x-auto relative w-full'>
          {isLoading && (
            <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10'>
              <div className='flex flex-col items-center'>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-2'></div>
                <p className='text-sm text-gray-600'>Đang tải dữ liệu...</p>
              </div>
            </div>
          )}
          <div className='min-w-full'>
            <DataTable columns={columns} data={data || []} />
          </div>
        </div>
        <div className='flex justify-center py-3 px-2 border-t border-gray-100'>
          <ReactPaginate
            pageCount={pages}
            breakLabel={<span className='mx-1 text-gray-400'>•••</span>}
            nextLabel={
              <span className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md ml-1 text-gray-600'>
                <BsChevronRight />
              </span>
            }
            pageRangeDisplayed={1}
            marginPagesDisplayed={1}
            previousLabel={
              <span className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md mr-1 text-gray-600'>
                <BsChevronLeft />
              </span>
            }
            renderOnZeroPageCount={null}
            containerClassName='flex justify-center items-center text-xs md:text-sm'
            pageClassName='block border border-solid border-gray-200 hover:bg-gray-100 flex justify-center items-center w-7 h-7 md:w-8 md:h-8 rounded-md mx-0.5 transition-colors'
            activeClassName='bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
            disabledClassName='opacity-50 cursor-not-allowed'
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
