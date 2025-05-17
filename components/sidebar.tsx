'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutDashboard, FileText, Star, Archive, PlusCircle, LogOut, Menu, ChevronRight } from 'lucide-react';

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const currentRoute = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const baseIconStyle = 'flex-shrink-0 transition-all duration-200';
  const baseTextStyle = `ml-3 transition-all duration-200 font-semibold ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`;

  const linkStyle = `flex items-center py-3 px-4 rounded-lg transition-all duration-300 my-1 group relative ${collapsed ? 'justify-center' : ''}`;
  const activeStyle = `${linkStyle} bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm`;
  const nonActiveStyle = `${linkStyle} text-gray-700 hover:bg-gray-100 hover:text-indigo-600`;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Set the currentPath cookie to /login before redirecting
        document.cookie = 'currentPath=/login; path=/; sameSite=strict;';

        // Force a hard refresh to ensure the page reloads completely
        // This will trigger the middleware to redirect to login
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Tooltip component for collapsed mode
  const Tooltip = ({ text }: { text: string }) => (
    <div className={`absolute left-full ml-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50 shadow-md ${collapsed ? 'block' : 'hidden'}`}>{text}</div>
  );

  return (
    <div className={`h-screen bg-white shadow-md flex flex-col z-10 transition-all duration-300 sticky top-0 ${collapsed ? 'w-[70px]' : 'w-[240px]'} font-sans`}>
      {/* Header with toggle button */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white`}>
        {!collapsed && <h2 className='text-lg font-bold'>Rao Vặt Admin</h2>}
        <button onClick={toggleSidebar} className='p-1.5 rounded-full hover:bg-white/20 text-white transition-colors'>
          {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className='flex-grow p-3 overflow-y-auto'>
        <Link
          href={'/dashboard'}
          className={`${currentRoute === '/dashboard' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}
            flex items-center py-3 px-4 rounded-lg transition-all duration-300 my-3 group relative font-medium ${collapsed ? 'justify-center' : ''} shadow-sm`}
        >
          <LayoutDashboard className={`${baseIconStyle} ${currentRoute === '/dashboard' ? 'text-white' : 'text-indigo-600'}`} size={22} />
          <span className={`${baseTextStyle} ${currentRoute === '/dashboard' ? 'text-white' : 'text-indigo-700'}`}>Dashboard</span>
          <Tooltip text='Dashboard' />
        </Link>

        <Link href={'/'} className={currentRoute === '/' ? activeStyle : nonActiveStyle}>
          <Home className={baseIconStyle} size={20} />
          <span className={baseTextStyle}>Trang chủ</span>
          <Tooltip text='Trang chủ' />
        </Link>

        {/* Tin Đăng Section - Moved to top */}
        <div className={`mt-6 mb-2 ${collapsed ? 'px-0' : 'px-4'}`}>
          {!collapsed && <p className='text-xs font-bold text-indigo-600 uppercase tracking-wider'>Tin Đăng</p>}
          {collapsed && <div className='h-px bg-indigo-100 w-full my-2'></div>}
        </div>

        {/* Create New Link - Enhanced for better visibility */}
        <Link
          href={'/create'}
          className={`${currentRoute === '/create' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-50 text-green-700 hover:bg-green-100'}
            flex items-center py-3 px-4 rounded-lg transition-all duration-300 my-3 group relative font-medium ${collapsed ? 'justify-center' : ''} shadow-sm`}
        >
          <PlusCircle className={`${baseIconStyle} ${currentRoute === '/create' ? '' : 'text-green-600'}`} size={22} />
          <span className={`${baseTextStyle} ${currentRoute === '/create' ? '' : 'text-green-700'}`}>Tạo tin mới</span>
          <Tooltip text='Tạo tin mới' />
        </Link>

        <Link href={'/tin-thuong'} className={currentRoute === '/tin-thuong' ? activeStyle : nonActiveStyle}>
          <FileText className={baseIconStyle} size={20} />
          <span className={baseTextStyle}>Tin thường</span>
          <Tooltip text='Tin thường' />
        </Link>

        <Link href={'/tin-vip'} className={currentRoute === '/tin-vip' ? activeStyle : nonActiveStyle}>
          <Star className={baseIconStyle} size={20} />
          <span className={baseTextStyle}>Tin VIP</span>
          <Tooltip text='Tin VIP' />
        </Link>

        <Link href={'/tin-cu'} className={currentRoute === '/tin-cu' ? activeStyle : nonActiveStyle}>
          <Archive className={baseIconStyle} size={20} />
          <span className={baseTextStyle}>Tin cũ</span>
          <Tooltip text='Tin cũ' />
        </Link>

        {/* Tử Vi Section - Moved below Tin Đăng */}
        <div className={`mt-6 mb-2 ${collapsed ? 'px-0' : 'px-4'}`}>
          {!collapsed && <p className='text-xs font-bold text-indigo-600 uppercase tracking-wider'>Tử Vi</p>}
          {collapsed && <div className='h-px bg-indigo-100 w-full my-2'></div>}
        </div>

        <Link href={'/tu-vi-nam'} className={currentRoute === '/tu-vi-nam' ? activeStyle : nonActiveStyle}>
          <Star className={baseIconStyle} size={20} />
          <span className={baseTextStyle}>Tử Vi Năm</span>
          <Tooltip text='Tử Vi Năm' />
        </Link>

        <Link href={'/tu-vi'} className={currentRoute === '/tu-vi' ? activeStyle : nonActiveStyle}>
          <Star className={baseIconStyle} size={20} />
          <span className={baseTextStyle}>Tử Vi Tuần</span>
          <Tooltip text='Tử Vi Tuần' />
        </Link>
      </div>

      {/* Logout button */}
      <div className='p-3 border-t border-gray-200'>
        <button onClick={handleLogout} className={`${linkStyle} text-red-600 hover:bg-red-50 w-full font-semibold`}>
          <LogOut className={`${baseIconStyle} text-red-500`} size={20} />
          <span className={baseTextStyle}>Đăng xuất</span>
          <Tooltip text='Đăng xuất' />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
