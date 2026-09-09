'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Bot, GitBranch, ListTodo, Shield, Settings, Server, Cpu, Database, ShieldAlert, Network, Terminal } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users & Orgs', href: '/users', icon: Users },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Providers & Models', href: '/providers', icon: Cpu },
  { name: 'Hermes', href: '/hermes', icon: Terminal },
  { name: 'Integrations', href: '/integrations', icon: Network },
  { name: 'Repositories', href: '/repositories', icon: GitBranch },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Approvals', href: '/approvals', icon: ShieldAlert },
  { name: 'Memory', href: '/memory', icon: Database },
  { name: 'Audit Logs', href: '/audit-logs', icon: Shield },
  { name: 'System Health', href: '/system', icon: Server },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-emerald-900 border-r border-emerald-800 text-white shadow-lg">
      <div className="flex h-16 shrink-0 items-center px-6 bg-emerald-950 shadow-sm border-b border-emerald-800/50">
        <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-400" />
          PrinsGo AI Admin
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-emerald-300 group-hover:text-emerald-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
