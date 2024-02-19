import Image from 'next/image';
import supabase from '@/services/supabase.js';

import iconItems from '@/public/svg/items.svg';
import { Button } from '@/components/ui/button';

import FormHoroscope from './formHoroscope';
import FormWeek from './formTuan';

export default function Page() {
  return (
    <div className='bg-[rgb(240,243,245)] w-[100%] ml-[250px]'>
      {/* Header */}
      <div className='bg-white w-[100%] p-4 flex justify-between items-center shadow-md'>
        <div className='flex items-center space-x-5 m-3'>
          <div className='bg-[rgb(240,243,245)] p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-[32px] ' />
          </div>
          <h1 className='text-2xl text-[#343a40] hover:cursor-pointer font-semibold'>
            Tử vi năm
          </h1>
        </div>
        <Button
          className='w-fit h-fit bg-green-700 mr-3 text-white font-semibold p-2 px-6 rounded-[5px] shadow-sm shadow-green-700'
          //   onClick={handleClick}
        >
          Create
        </Button>
      </div>
      {/* Table */}
      <div className='bg-white m-12 rounded-[5px] shadow-lg'>
        {/* <FormWeek /> */}
        {/* <hr /> */}
        <FormHoroscope />
      </div>
    </div>
  );
}
