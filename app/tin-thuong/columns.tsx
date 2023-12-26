'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import supabase from '@/services/supabase';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Tin = {
  id: string;
  noi_dung: string;
  tin_id: string;
};

const inactiveAd = async (id: string) => {
  const { data, error } = await supabase
    .from('tin_dang')
    .update({ active: 'false' })
    .eq('tin_id', id)
    .select();
};

export const columns: ColumnDef<Tin>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'tieu_de',
    header: 'Tiêu đề',
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
    cell: ({ row }) => {
      const tinId = row.original.tin_id;

      return (
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
      );
    },
  },
];
