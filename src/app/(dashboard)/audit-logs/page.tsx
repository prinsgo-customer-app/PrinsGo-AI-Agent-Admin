'use client';

import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

interface AuditLog {
  _id: string;
  action: string;
  result: string;
  target?: string;
  tool?: string;
  userId: { name: string; email: string } | null;
  agentId?: { name: string } | null;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/audit-logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Shield className="text-gray-700" />
          Audit Logs
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Audit Events</h3>
            <p className="mt-1 text-sm text-gray-500">
              System actions and AI events will be recorded here.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {log.action}
                    {log.target && <span className="text-gray-500 font-normal ml-2">({log.target})</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {log.userId?.name || 'System'}
                    {log.agentId && <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">Via Agent: {log.agentId.name}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.result === 'SUCCESS' ? (
                      <span className="flex items-center text-emerald-600 gap-1"><ShieldCheck className="w-4 h-4"/> Success</span>
                    ) : log.result === 'FAILURE' ? (
                      <span className="flex items-center text-red-600 gap-1"><ShieldAlert className="w-4 h-4"/> Failure</span>
                    ) : (
                      <span className="text-amber-600">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <button className="text-emerald-600 hover:text-emerald-900">View</button>
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
