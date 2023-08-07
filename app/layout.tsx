import Sidebar from '@/components/sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['vietnamese'],
});

export const metadata: Metadata = {
  title: 'Rao vat admin',
  description: 'Admin for trang rao vat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={roboto.className}>
        <div className='flex'>
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
