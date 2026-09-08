'use client';

import React, { useEffect, useState } from 'react';
import { ListTodo, CheckCircle2, AlertTriangle, Clock, XCircle, Search } from 'lucide-react';

interface Task {
  _id: string;
  description: string;
  state: string;
  userId: { name: string; email: string } | null;
  workspaceId: { name: string } | null;
  agentId: { name: string } | null;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WAITING_FOR_APPROVAL': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <ListTodo className="text-blue-600" />
          Tasks & Approvals
        </h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Search tasks..."
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <ListTodo className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No AI Tasks Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tasks executed by agents will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStateIcon(task.state)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.description}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>Agent: {task.agentId?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span>User: {task.userId?.name || 'System'}</span>
                        <span>•</span>
                        <span>{new Date(task.createdAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.state === 'WAITING_FOR_APPROVAL' ? 'bg-amber-100 text-amber-800' :
                      task.state === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      task.state === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.state}
                    </span>
                    <button className="text-sm text-emerald-600 hover:text-emerald-900 font-medium">
                      View
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
