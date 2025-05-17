'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

import ModernFormCreate from '@/components/modern-form-create';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const router = useRouter();

  return (
    <div className='bg-gray-50 w-full min-h-screen'>
      {/* Header */}
      <div className='bg-white w-full p-3 flex flex-wrap md:flex-nowrap justify-between items-center shadow-sm'>
        <div className='flex items-center space-x-3 mb-2 md:mb-0 w-full md:w-auto'>
          <div className='bg-indigo-50 p-2 rounded'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </div>
          <h1 className='text-lg md:text-xl text-gray-800 font-bold'>Tạo tin mới</h1>
        </div>
        <button onClick={() => router.back()} className='w-full md:w-auto flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 font-medium p-1.5 px-3 rounded hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
            <path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
          </svg>
          <span>Quay lại</span>
        </button>
      </div>

      {/* Content */}
      <div className='w-full p-2 md:p-4'>
        <div className='max-w-5xl mx-auto'>
          <ModernFormCreate />
        </div>
      </div>
    </div>
  );
};

export default Page;
