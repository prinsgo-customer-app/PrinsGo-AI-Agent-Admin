'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Search } from 'lucide-react';

interface Task {
  _id: string;
  description: string;
  state: string;
  userId: { name: string; email: string } | null;
  workspaceId: { name: string } | null;
  agentId: { name: string } | null;
  createdAt: string;
}

export default function ApprovalsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproval = async (taskId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action })
      });
      if (res.ok) {
        fetchApprovals();
      } else {
        alert('Failed to process approval');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="text-amber-600" />
          Approval Center
        </h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Search pending approvals..."
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading pending approvals...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">All Caught Up</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no pending actions requiring your approval.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">{task.description}</h4>
                    <div className="text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-2 mt-3 max-w-2xl">
                      <div><span className="font-medium text-gray-700">Requester:</span> {task.userId?.name || 'Unknown'}</div>
                      <div><span className="font-medium text-gray-700">Agent:</span> {task.agentId?.name || 'Unknown'}</div>
                      <div><span className="font-medium text-gray-700">Workspace:</span> {task.workspaceId?.name || 'Unknown'}</div>
                      <div><span className="font-medium text-gray-700">Requested:</span> {new Date(task.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleApproval(task._id, 'APPROVE')}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(task._id, 'REJECT')}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:text-red-600 hover:border-red-300">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
