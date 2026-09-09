'use client';

import React, { useEffect, useState } from 'react';
import { Bot, Terminal, Activity, AlertTriangle } from 'lucide-react';

interface HermesStatus {
  status: string;
  message: string;
}

export default function HermesPage() {
  const [hermes, setHermes] = useState<HermesStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHermes() {
      try {
        const res = await fetch('/api/hermes');
        if (res.ok) {
          const data = await res.json();
          setHermes(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHermes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Terminal className="text-blue-600" />
          Hermes Control Panel
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Official Hermes Integration</h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    hermes?.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' :
                    hermes?.status === 'ERROR' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {hermes?.status || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>

            {hermes?.status !== 'CONNECTED' && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Configuration Required
                    </p>
                    <p className="text-sm text-amber-700 mt-2">
                      {hermes?.message || 'The Hermes Agent runtime must be explicitly deployed and configured with its actual supported interface before it can execute tasks. Please consult the documentation to set up the Hermes runtime environment.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
               <div className="border border-gray-200 rounded p-4">
                 <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-gray-500" />
                   Runtime Metrics
                 </h3>
                 <p className="text-sm text-gray-500">No active connection to retrieve metrics.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
