import { FC } from 'react';
import Image from 'next/image';

import iconItems from '@/public/svg/items.svg';
import UploadBanner from './components/UploadBanner';

interface PageProps {}

const banners = {
  top_right: 'top_right_banner',
  top_left: 'top_left_banner',
  mid_right: 'mid_right_banner',
  mid_left: 'mid_left_banner',
};

const Page: FC<PageProps> = ({}) => {
  return (
    <div className='bg-[#F0F3F5] w-[100%] ml-[250px]'>
      {/* <p>{JSON.stringify(data)}</p> */}
      <div className='bg-white p-4 flex justify-between items-center shadow-md'>
        <div className='flex items-center space-x-5 m-3'>
          <div className='bg-[rgb(240,243,245)] p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-[32px] ' />
          </div>
          <h1 className='text-2xl text-[#343a40] hover:cursor-pointer'>
            Banners
          </h1>
        </div>
      </div>
      <div className='bg-white m-12 p-8 rounded-[5px] shadow-lg'>
        <div>
          <h2 className='text-xl font-bold'>Top right banner</h2>
          <UploadBanner name={banners.top_right} />
        </div>
        <div>
          <h2 className='text-xl font-bold'>Top left banner</h2>
          <UploadBanner name={banners.top_left} />
        </div>
        <div>
          <h2 className='text-xl font-bold'>Mid right banner</h2>
          <UploadBanner name={banners.mid_right} />
        </div>
        <div>
          <h2 className='text-xl font-bold'>Mid left banner</h2>
          <UploadBanner name={banners.mid_left} />
        </div>
      </div>
    </div>
  );
};

export default Page;
