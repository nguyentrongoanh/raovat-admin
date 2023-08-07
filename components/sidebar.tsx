import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import iconFiles from '@/public/svg/files.svg';
import iconNew from '@/public/svg/new.svg';

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  return (
    <div className='w-[250px] h-[100vh] p-8 font-semibold bg-white fixed shadow-md'>
      <Link
        href={'/tin'}
        className='flex mb-2 p-2 space-x-3 hover:bg-pink-300 hover:duration-200 hover:rounded-[5px] hover:cursor-pointer'
      >
        <Image src={iconFiles} width={24} alt='icon' />
        <span>Tin đăng</span>
      </Link>
      <Link
        href={'/create'}
        className='flex mb-2 p-2 space-x-3 hover:bg-pink-300 hover:duration-200 hover:rounded-[5px] hover:cursor-pointer'
      >
        <Image src={iconNew} width={24} alt='icon' />
        <span>Tạo tin mới</span>
      </Link>
    </div>
  );
};

export default Sidebar;
