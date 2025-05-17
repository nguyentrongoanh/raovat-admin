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
      const id = row.getValue('id') as string;
      return (
        <div className='whitespace-nowrap font-mono text-xs md:text-sm' title={id}>
          {id}
        </div>
      );
    },
    size: 120,
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
          <div className='max-w-[400px] truncate text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors' title={`${title} (Nhấn để chỉnh sửa)`}>
            {displayTitle}
          </div>
        </Link>
      );
    },
    size: 400,
  },
  {
    accessorKey: 'ngay_dang',
    header: 'Ngày đăng',
    cell: ({ row }) => {
      const data = new Date(row.getValue('ngay_dang')).toLocaleString();
      return <div>{data}</div>;
    },
  },
  {
    accessorKey: 'active',
    header: 'Active',
  },
  {
    accessorKey: 'is_vip',
    header: 'Tin VIP',
  },
  {
    id: 'actions',
    header: '',
    enableHiding: false,
    size: 60,
    cell: ({ row }) => {
      const tinId = row.original.tin_id;

      return (
        <div className='text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-white'>
              <DropdownMenuItem className='cursor-pointer'>
                <Link href={`/edit?id=${tinId}`}>Sửa tin đăng</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  inactiveAd(tinId);
                }}
                className='cursor-pointer'
              >
                Ẩn tin đăng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
