'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import iconItems from '@/public/svg/items.svg';
import FormEdit from '@/components/form-edit';
import supabase from '@/services/supabase';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const [data, setData] = useState<any[] | null>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tinId = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('tin_dang').select('*').eq('tin_id', tinId);

      if (error) {
        console.error(error);
      }

      setData(data);
    };

    fetchData();
  }, [tinId]);

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Header */}
      <div className='bg-white w-full p-3 md:p-4 flex flex-wrap md:flex-nowrap justify-between items-center shadow-md'>
        <div className='flex items-center space-x-3 md:space-x-5 mb-2 md:mb-0 w-full md:w-auto'>
          <div className='bg-[rgb(240,243,245)] p-2 md:p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-6 md:w-[32px]' />
          </div>
          <h1 className='text-lg md:text-2xl text-[#343a40] font-semibold truncate'>Sửa tin đăng</h1>
        </div>
        <button onClick={() => router.back()} className='w-full md:w-auto h-fit bg-gray-200 text-gray-700 font-medium p-2 px-4 md:px-6 rounded-[5px] hover:bg-gray-300 transition-colors'>
          Quay lại
        </button>
      </div>

      {/* Content */}
      <div className='bg-white w-full shadow-sm overflow-hidden border-t border-gray-100 p-4 md:p-6'>
        <div className='max-w-5xl mx-auto'>
          <FormEdit />
        </div>
      </div>
    </div>
  );
};

export default Page;
