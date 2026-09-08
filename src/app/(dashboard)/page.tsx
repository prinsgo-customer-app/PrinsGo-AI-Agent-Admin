'use client';

import React, { useEffect, useState } from 'react';
import { Bot, GitBranch, Cpu, ListTodo, Zap, AlertTriangle, ShieldCheck, Users, Car } from 'lucide-react';

interface DashboardStats {
  activeTasks: number;
  pendingApprovals: number;
  activeAgents: number;
  connectedRepos: number;
  connectedProviders: number;
  activeAutomations: number;
  totalCustomers: number;
  activeRides: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          // If not authorized, redirect will be handled by middleware, or we can handle it here
          setError('Failed to load statistics');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Active AI Tasks', value: stats?.activeTasks, icon: ListTodo, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Pending Approvals', value: stats?.pendingApprovals, icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { name: 'Active Agents', value: stats?.activeAgents, icon: Bot, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { name: 'Connected Repos', value: stats?.connectedRepos, icon: GitBranch, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'AI Providers', value: stats?.connectedProviders, icon: Cpu, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { name: 'Active Automations', value: stats?.activeAutomations, icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  const businessCards = [
    { name: 'Total Customers', value: stats?.totalCustomers, icon: Users, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    { name: 'Active Rides', value: stats?.activeRides, icon: Car, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse h-24"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg transition hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-md ${item.bgColor}`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd>
                          <div className="text-2xl font-bold text-gray-900">
                            {item.value === undefined ? '-' : item.value === 0 ? '0' : item.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">Business Analytics</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businessCards.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg transition hover:shadow-md border-l-4 border-emerald-500">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-md ${item.bgColor}`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd>
                          <div className="text-2xl font-bold text-gray-900">
                            {item.value === undefined ? '-' : item.value === 0 ? '0' : item.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* System Health Section (Placeholder for actual real-time health) */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Health</h2>
        <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-gray-800">All Services Operational</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
             <div className="flex justify-between p-3 bg-gray-50 rounded">
               <span>AI Agent Backend</span>
               <span className="text-emerald-600 font-medium">Healthy</span>
             </div>
             <div className="flex justify-between p-3 bg-gray-50 rounded">
               <span>MongoDB Database</span>
               <span className="text-emerald-600 font-medium">Healthy</span>
             </div>
             <div className="flex justify-between p-3 bg-gray-50 rounded">
               <span>PrinsGo Existing API</span>
               <span className="text-emerald-600 font-medium">Healthy</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
