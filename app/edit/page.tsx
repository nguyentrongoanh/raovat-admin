'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import iconItems from '@/public/svg/items.svg';
import FormEdit from '@/components/formEdit';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const searchParams = useSearchParams();

  const tinId = searchParams.get('id');

  return (
    <div className='bg-[#F0F3F5] w-[100%] ml-[250px]'>
      {/* <p>{JSON.stringify(data)}</p> */}
      <div className='bg-white p-4 flex justify-between items-center shadow-md'>
        <div className='flex items-center space-x-5 m-3'>
          <div className='bg-[rgb(240,243,245)] p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-[32px] ' />
          </div>
          <h1 className='text-2xl text-[#343a40] hover:cursor-pointer'>
            Sửa tin
          </h1>
        </div>
      </div>
      <div className='bg-white m-12 p-8 rounded-[5px] shadow-lg'>
        <FormEdit tinId={tinId} />
      </div>
    </div>
  );
};

export default Page;
