'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Redirect to dashboard on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();

        if (!data.authenticated) {
          router.push('/login');
        } else {
          // If authenticated, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className='w-full h-[100vh] flex flex-col items-center justify-center p-8'>
      <div className='mb-8 text-center'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>Rao Vặt Admin</h1>
        <p className='text-gray-600'>Quản lý tin đăng và nội dung của bạn</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-4xl'>
        <a href='/dashboard' className='bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors shadow-md'>
          Dashboard
        </a>
        <a href='/create' className='bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors shadow-md'>
          Tạo tin mới
        </a>
        <a href='/tin-thuong' className='bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors shadow-md'>
          Tin Thường
        </a>
        <a href='/tin-vip' className='bg-yellow-600 text-white p-4 rounded-lg text-center hover:bg-yellow-700 transition-colors shadow-md'>
          Tin VIP
        </a>
        <a href='/tin-cu' className='bg-gray-600 text-white p-4 rounded-lg text-center hover:bg-gray-700 transition-colors shadow-md'>
          Tin Cũ
        </a>
        <a href='/tu-vi' className='bg-indigo-600 text-white p-4 rounded-lg text-center hover:bg-indigo-700 transition-colors shadow-md'>
          Tử Vi Tuần
        </a>
        <a href='/tu-vi-nam' className='bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors shadow-md'>
          Tử Vi Năm
        </a>
      </div>

      <iframe className='rounded-lg shadow-lg' src='https://giphy.com/embed/3o85xDWOG8Sbl9yQzm' width='480' height='305' style={{ border: 'none' }} allowFullScreen />
    </main>
  );
}
