'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import iconFiles from '@/public/svg/files.svg';
import iconNew from '@/public/svg/new.svg';

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const currentRoute = usePathname();

  const linkStyle =
    'flex mb-2 p-2 space-x-3 hover:bg-pink-300 hover:duration-200 hover:rounded-[5px] hover:cursor-pointer';
  const activeStyle = linkStyle + ' text-white bg-pink-300';
  const nonActiveStyle = linkStyle;

  return (
    <div className='w-[250px] h-[100vh] p-8 font-semibold bg-white fixed shadow-md'>
      {' '}
      <Link
        href={'/tu-vi-nam'}
        className={currentRoute === '/tu-vi-nam' ? activeStyle : nonActiveStyle}
      >
        <Image
          src={'/images/horoscope.png'}
          width={24}
          height={24}
          alt='icon'
        />
        <span>Tử Vi Năm</span>
      </Link>
      <Link
        href={'/tu-vi'}
        className={currentRoute === '/tu-vi' ? activeStyle : nonActiveStyle}
      >
        <Image
          src={'/images/horoscope.png'}
          width={24}
          height={24}
          alt='icon'
        />
        <span>Tử Vi Tuần</span>
      </Link>
      <Link
        href={'/tin-thuong'}
        className={
          currentRoute === '/tin-thuong' ? activeStyle : nonActiveStyle
        }
      >
        <Image src={iconFiles} width={24} alt='icon' />
        <span>Tin đăng thường</span>
      </Link>
      <Link
        href={'/tin-vip'}
        className={currentRoute === '/tin-vip' ? activeStyle : nonActiveStyle}
      >
        <Image src={iconFiles} width={24} alt='icon' />
        <span>Tin đăng VIP</span>
      </Link>
      <Link
        href={'/tin-cu'}
        className={currentRoute === '/tin-cu' ? activeStyle : nonActiveStyle}
      >
        <Image src={iconFiles} width={24} alt='icon' />
        <span>Tin đăng cũ</span>
      </Link>
      <Link
        href={'/create'}
        className={currentRoute === '/create' ? activeStyle : nonActiveStyle}
      >
        <Image src={iconNew} width={24} alt='icon' />
        <span>Tạo tin mới</span>
      </Link>
      <Link
        href={'/banner'}
        className={currentRoute === '/banner' ? activeStyle : nonActiveStyle}
      >
        <Image src={iconNew} width={24} alt='icon' />
        <span>Banner</span>
      </Link>
    </div>
  );
};

export default Sidebar;
