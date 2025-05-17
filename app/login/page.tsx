'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  // Use empty initial values to avoid hydration mismatch
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Use useEffect to mark when component is mounted on the client
  useEffect(() => {
    setMounted(true);

    // Clear any auth cookies that might be present
    document.cookie = 'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        // Set the currentPath cookie to /dashboard before redirecting
        document.cookie = 'currentPath=/dashboard; path=/; sameSite=strict;';

        // Use window.location for a full page reload to the dashboard
        window.location.href = '/dashboard';
      } else {
        // Failed login
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50'>
      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-50'>
        <div className='absolute top-10 left-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute top-[40%] right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute bottom-10 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative z-10 bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-md border border-white/50'>
        <div className='flex justify-center mb-8'>
          <div className='text-center'>
            <div className='inline-block p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-4'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>Rao Vặt Admin</h1>
            <p className='text-gray-600'>Đăng nhập để tiếp tục</p>
          </div>
        </div>

        {/* Only show error on client-side to avoid hydration mismatch */}
        {mounted && error && (
          <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fadeIn'>
            <div className='flex items-center'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2 text-red-500' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='username' className='block text-gray-700 text-sm font-medium'>
              Tên đăng nhập
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                </svg>
              </div>
              <input
                type='text'
                id='username'
                className='pl-10 w-full py-3 px-4 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder='Nhập tên đăng nhập'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='password' className='block text-gray-700 text-sm font-medium'>
              Mật khẩu
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </div>
              <input
                type='password'
                id='password'
                className='pl-10 w-full py-3 px-4 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Nhập mật khẩu'
                required
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className={`w-full py-3 px-4 flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] ${
                mounted && isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={mounted && isLoading}
            >
              {mounted && isLoading ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-500 bg-white/50 backdrop-blur-sm py-2 px-4 rounded-full inline-block shadow-sm'>Đây là trang quản trị dành cho admin</p>
        </div>
      </div>
    </div>
  );
}
