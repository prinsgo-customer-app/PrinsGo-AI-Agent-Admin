'use client';

import React from 'react';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    // In a real app we'd call a /api/auth/logout endpoint or clear cookie
    // For now we just redirect (middleware handles if cookie cleared, but here we simulate)
    document.cookie = 'admin_token=; Max-Age=0; path=/';
    router.push('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          <div className="flex items-center gap-x-4">
            <span className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="hidden lg:flex">Admin User</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold leading-6 text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
