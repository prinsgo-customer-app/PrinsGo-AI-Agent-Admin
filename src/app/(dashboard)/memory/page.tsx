'use client';

import React, { useEffect, useState } from 'react';
import { Database, Search } from 'lucide-react';

interface Memory {
  _id: string;
  content: string;
  category: string;
  userId: { name: string; email: string } | null;
  workspaceId: { name: string } | null;
  createdAt: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemory() {
      try {
        const res = await fetch('/api/memory');
        if (res.ok) {
          const data = await res.json();
          setMemories(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMemory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Database className="text-emerald-600" />
          AI Memory Manager
        </h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Search knowledge..."
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading memory entries...</div>
        ) : memories.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Memory Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Agent interactions and learned context will appear here.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Snippet</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workspace</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {memories.map((mem) => (
                <tr key={mem._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{mem.category}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-xs" title={mem.content}>
                    {mem.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {mem.userId?.name || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {mem.workspaceId?.name || 'Global'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(mem.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
