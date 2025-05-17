'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import supabase from '@/services/supabase.js';

import iconItems from '@/public/svg/items.svg';
import { Button } from '@/components/ui/button';

export default function TuViPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/create-tu-vi');
  };

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Header */}
      <div className='bg-white w-full p-3 md:p-4 flex flex-wrap md:flex-nowrap justify-between items-center shadow-md'>
        <div className='flex items-center space-x-3 md:space-x-5 mb-2 md:mb-0 w-full md:w-auto'>
          <div className='bg-[rgb(240,243,245)] p-2 md:p-4 rounded-[5px]'>
            <Image src={iconItems} alt='Icon Items' className='w-6 md:w-[32px]' />
          </div>
          <h1 className='text-lg md:text-2xl text-[#343a40] font-semibold truncate'>Tử vi tuần</h1>
        </div>
        <Button className='w-full md:w-auto h-fit bg-green-700 text-white font-semibold p-2 px-4 md:px-6 rounded-[5px] shadow-sm shadow-green-700' onClick={handleClick}>
          Create
        </Button>
      </div>

      {/* Content */}
      <div className='bg-white w-full shadow-sm overflow-hidden border-t border-gray-100 p-4 md:p-6'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Tử vi tuần</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Cung hoàng đạo</label>
                <select className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500'>
                  <option value=''>Chọn cung hoàng đạo</option>
                  <option value='bach_duong'>Bạch Dương (Aries)</option>
                  <option value='kim_nguu'>Kim Ngưu (Taurus)</option>
                  <option value='song_tu'>Song Tử (Gemini)</option>
                  <option value='cu_giai'>Cự Giải (Cancer)</option>
                  <option value='su_tu'>Sư Tử (Leo)</option>
                  <option value='xu_nu'>Xử Nữ (Virgo)</option>
                  <option value='thien_binh'>Thiên Bình (Libra)</option>
                  <option value='bo_cap'>Bọ Cạp (Scorpio)</option>
                  <option value='nhan_ma'>Nhân Mã (Sagittarius)</option>
                  <option value='ma_ket'>Ma Kết (Capricorn)</option>
                  <option value='bao_binh'>Bảo Bình (Aquarius)</option>
                  <option value='song_ngu'>Song Ngư (Pisces)</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tuần</label>
                <input type='week' className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500' />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Năm</label>
                <input type='number' className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500' placeholder='2023' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Trạng thái</label>
                <select className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500'>
                  <option value='active'>Hoạt động</option>
                  <option value='inactive'>Không hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Nội dung</label>
            <textarea rows={6} className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500' placeholder='Nhập nội dung tử vi...'></textarea>
          </div>

          <div className='flex justify-end space-x-3'>
            <button className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'>Hủy</button>
            <button className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}
