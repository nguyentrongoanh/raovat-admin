import Sidebar from '@/components/sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { cookies } from 'next/headers';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['vietnamese'],
});

export const metadata: Metadata = {
  title: 'Rao vat admin',
  description: 'Admin for trang rao vat',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Check if the user is logged in
  const isLoggedIn = cookies().has('auth');

  // Check if the current path is the login page
  const pathname = cookies().get('currentPath')?.value || '';
  const isLoginPage = pathname === '/login';

  return (
    <html lang='en'>
      <body className={`${roboto.className} ${isLoginPage ? 'bg-gray-100' : 'bg-white'}`}>
        <div id='previewImageModal' />
        {isLoginPage ? (
          // Login page layout - no sidebar
          <div className='w-full min-h-screen'>{children}</div>
        ) : (
          // Dashboard layout with sidebar - always show sidebar for authenticated pages
          <div className='flex w-full min-h-screen'>
            <Sidebar />
            <div className='flex-1 overflow-x-auto'>{children}</div>
          </div>
        )}
      </body>
    </html>
  );
}
