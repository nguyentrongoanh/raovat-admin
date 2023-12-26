import { FC } from 'react';
import Image from 'next/image';

import iconItems from '@/public/svg/items.svg';
import FormCreate from '@/components/form';
import FormDangTin from '@/components/form-create';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <div className='bg-[#F0F3F5] w-[100%] ml-[250px]'>
      {/* <p>{JSON.stringify(data)}</p> */}
      <div className='bg-white p-4 shadow-md'>
        <div className='flex items-center space-x-5 m-3'>
          <div className='bg-[rgb(240,243,245)] p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-[32px] ' />
          </div>
          <h1 className='text-2xl text-[#343a40] hover:cursor-pointer'>
            Tạo tin
          </h1>
        </div>
      </div>
      <div className='bg-white m-12 p-8 rounded-[5px] shadow-lg'>
        {/* <FormCreate /> */}
        <FormDangTin />
      </div>
    </div>
  );
};

export default Page;
