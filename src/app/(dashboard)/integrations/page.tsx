'use client';

import React, { useEffect, useState } from 'react';
import { Network, Plus, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface Integration {
  _id: string;
  name: string;
  type: string;
  status: string;
  workspaceId: { name: string } | null;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const res = await fetch('/api/integrations');
        if (res.ok) {
          const data = await res.json();
          setIntegrations(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntegrations();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'ERROR': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'BLOCKED': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-emerald-100 text-emerald-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'BLOCKED': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Network className="text-blue-600" />
          Integrations
        </h1>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading integrations...</div>
        ) : integrations.length === 0 ? (
          <div className="p-12 text-center">
            <Network className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Integrations Configured</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect external services to empower your AI agents.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workspace</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {integrations.map((integration) => (
                <tr key={integration._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {integration.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{integration.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        {integration.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{integration.workspaceId?.name || 'Global'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900">Test</button>
                    <button className="text-emerald-600 hover:text-emerald-900">Configure</button>
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
