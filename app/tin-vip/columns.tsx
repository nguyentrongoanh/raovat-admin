'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import supabase from '@/services/supabase';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Tin = {
  id: string;
  noi_dung: string;
  tin_id: string;
};

const inactiveAd = async (id: string) => {
  const { data, error } = await supabase.from('tin_dang').update({ active: 'false' }).eq('tin_id', id).select();
};

export const columns: ColumnDef<Tin>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => {
      const date = row.getValue('ngay_dang') ? new Date(row.getValue('ngay_dang')) : new Date();

      // Format date as YYYYMMDD
      const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

      // Format time as HHMMSS
      const formattedTime = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;

      const idValue = `${formattedDate}-${formattedTime}`;

      return (
        <div className='text-xs md:text-sm font-mono whitespace-nowrap' title={idValue}>
          {idValue}
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: 'tieu_de',
    header: () => (
      <div className='flex items-center'>
        <span>Tiêu đề</span>
        <span className='ml-1 text-xs text-blue-500'>(Nhấn để sửa)</span>
      </div>
    ),
    cell: ({ row }) => {
      const title = row.getValue('tieu_de') as string;
      const tinId = row.original.tin_id;
      // Limit to 200 characters
      const displayTitle = title.length > 200 ? title.substring(0, 200) + '...' : title;
      return (
        <Link href={`/edit?id=${tinId}`}>
          <div className='max-w-[300px] truncate text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors' title={`${title} (Nhấn để chỉnh sửa)`}>
            {displayTitle}
          </div>
        </Link>
      );
    },
    size: 300,
  },
  {
    accessorKey: 'ngay_dang',
    header: 'Ngày đăng',
    cell: ({ row }) => {
      const data = new Date(row.getValue('ngay_dang')).toLocaleString();
      return <div className='whitespace-nowrap'>{data}</div>;
    },
    size: 120,
  },
  {
    accessorKey: 'active',
    header: 'Active',
    cell: ({ row }) => {
      const isActive = row.getValue('active');
      return (
        <div className='flex justify-center'>
          <span className={`px-2 py-1 rounded-full text-xs ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{isActive ? 'Hoạt động' : 'Không'}</span>
        </div>
      );
    },
    size: 90,
  },
  {
    accessorKey: 'is_vip',
    header: 'Tin VIP',
    cell: ({ row }) => {
      const isVip = row.getValue('is_vip');
      return (
        <div className='flex justify-center'>
          {isVip ? (
            <span className='text-yellow-500'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            </span>
          ) : (
            <span>-</span>
          )}
        </div>
      );
    },
    size: 80,
  },
  {
    id: 'actions',
    header: '',
    enableHiding: false,
    size: 70,
    cell: ({ row }) => {
      const tinId = row.original.tin_id;

      return (
        <div className='text-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0 rounded-full hover:bg-gray-100'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-white shadow-lg rounded-md border border-gray-200'>
              <DropdownMenuItem className='cursor-pointer hover:bg-gray-50'>
                <Link href={`/edit?id=${tinId}`} className='flex items-center w-full'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2 text-blue-500' viewBox='0 0 20 20' fill='currentColor'>
                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                  </svg>
                  Sửa tin đăng
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  inactiveAd(tinId);
                }}
                className='cursor-pointer hover:bg-gray-50 text-red-500'
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
                Ẩn tin đăng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
