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

  const router = useRouter();

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { count, error } = await supabase.from('tin_dang').select('*', { count: 'exact', head: true }).eq('active', true).eq('is_vip', true);

      if (error) {
        console.error(error);
      } else {
        setPages(Math.ceil(count! / itemsPerPage));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, count, error } = await supabase
        .from('tin_dang')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .eq('is_vip', true)
        .limit(1000)
        .range(currentPage * 10, currentPage * 10 + 9)
        .order('id', { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleClick = () => {
    router.push('/create');
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Header */}
      <div className='bg-white w-full p-3 md:p-4 flex flex-wrap md:flex-nowrap justify-between items-center shadow-md'>
        <div className='flex items-center space-x-3 md:space-x-5 mb-2 md:mb-0 w-full md:w-auto'>
          <div className='bg-[rgb(240,243,245)] p-2 md:p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-6 md:w-[32px]' />
          </div>
          <h1 className='text-lg md:text-2xl text-[#343a40] font-semibold truncate'>Danh sách tin đăng</h1>
        </div>
        <Button className='w-full md:w-auto h-fit bg-green-700 text-white font-semibold p-2 px-4 md:px-6 rounded-[5px] shadow-sm shadow-green-700' onClick={handleClick}>
          Create
        </Button>
      </div>
      {/* Table */}
      <div className='bg-white w-full shadow-sm overflow-hidden border-t border-gray-100'>
        <div className='overflow-x-auto relative w-full'>
          <div className='min-w-full'>
            <DataTable columns={columns} data={data || []} />
          </div>
        </div>
        <div className='flex justify-center overflow-x-auto py-2 px-4'>
          <ReactPaginate
            pageCount={pages}
            breakLabel={<span className='mx-1'>...</span>}
            nextLabel={
              <span className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-200 rounded-md ml-2 md:ml-4'>
                <BsChevronRight />
              </span>
            }
            pageRangeDisplayed={3}
            previousLabel={
              <span className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-200 rounded-md mr-2 md:mr-4'>
                <BsChevronLeft />
              </span>
            }
            renderOnZeroPageCount={null}
            containerClassName='flex justify-center items-center mt-4 md:mt-8 mb-4 text-xs md:text-sm'
            pageClassName='block border border-solid border-gray-200 hover:bg-gray-200 flex justify-center items-center w-8 h-8 md:w-10 md:h-10 rounded-md mx-1'
            activeClassName='bg-indigo-600 text-white border-indigo-600'
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
