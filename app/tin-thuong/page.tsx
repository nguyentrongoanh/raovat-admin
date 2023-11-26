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
      const { count, error } = await supabase
        .from('tin_dang')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
        .eq('is_vip', false);

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
        .eq('is_vip', false)
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
    <div className='bg-[rgb(240,243,245)] w-[100%] ml-[250px]'>
      {/* Header */}
      <div className='bg-white w-[100%] p-4 flex justify-between items-center shadow-md'>
        <div className='flex items-center space-x-5 m-3'>
          <div className='bg-[rgb(240,243,245)] p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-[32px] ' />
          </div>
          <h1 className='text-2xl text-[#343a40] hover:cursor-pointer font-semibold'>
            Danh sách tin đăng
          </h1>
        </div>
        <Button
          className='w-fit h-fit bg-green-700 mr-3 text-white font-semibold p-2 px-6 rounded-[5px] shadow-sm shadow-green-700'
          onClick={handleClick}
        >
          Create
        </Button>
      </div>
      {/* Table */}
      <div className='bg-white m-12 rounded-[5px] shadow-lg'>
        <DataTable columns={columns} data={data!} />
        <div className='flex justify-center'>
          <ReactPaginate
            pageCount={pages}
            breakLabel={<span className='mx-1'>...</span>}
            nextLabel={
              <span className='w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md ml-4'>
                <BsChevronRight />
              </span>
            }
            pageRangeDisplayed={3}
            previousLabel={
              <span className='w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md mr-4'>
                <BsChevronLeft />
              </span>
            }
            renderOnZeroPageCount={null}
            containerClassName='flex justify-center items-center mt-8 mb-4 text-sm'
            pageClassName='block border border-solid border-gray-200 hover:bg-gray-200 flex justify-center items-center w-10 h-10 rounded-md mx-1'
            activeClassName='bg-violet-500 text-white'
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
