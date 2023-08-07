import { FC } from 'react';
import Image from 'next/image';

import iconItems from '@/public/svg/items.svg';

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <>
      <div className='bg-white w-[100%] p-4 flex justify-between items-center shadow-md'>
        <div className='flex items-center space-x-5 m-3'>
          <div className='bg-[rgb(240,243,245)] p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-[32px] ' />
          </div>
          <h1 className='text-2xl text-[#343a40] hover:cursor-pointer'>
            Tin đăng
          </h1>
        </div>
        <button
          className='w-fit h-fit bg-green-700 mr-3 text-white font-semibold p-2 rounded-[5px] shadow-sm shadow-green-700'
          // onClick={handleClick}
        >
          + Tạo Tin
        </button>
      </div>
    </>
  );
};

export default Header;
