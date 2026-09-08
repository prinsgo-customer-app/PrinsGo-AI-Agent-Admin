'use client';

import React, { useEffect, useState } from 'react';
import { Bot, Plus, Settings } from 'lucide-react';

interface Agent {
  _id: string;
  name: string;
  description: string;
  status: string;
  allowedTools: string[];
  workspaceId: { name: string } | null;
  preferredModel: { providerName: string; modelName: string } | null;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/agents');
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Bot className="text-emerald-600" />
          AI Agents
        </h1>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow border border-gray-200 h-48 animate-pulse"></div>
          ))
        ) : agents.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-lg border border-gray-200 shadow-sm">
            <Bot className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Agents Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create an AI Agent to start orchestrating workflows.
            </p>
          </div>
        ) : (
          agents.map((agent) => (
            <div key={agent._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{agent.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    agent.status === 'ENABLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{agent.description}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {agent.allowedTools.slice(0, 3).map((tool) => (
                    <span key={tool} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {tool}
                    </span>
                  ))}
                  {agent.allowedTools.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                      +{agent.allowedTools.length - 3} more
                    </span>
                  )}
                </div>
                <div className="mt-4 text-xs text-gray-500 flex justify-between items-center border-t border-gray-100 pt-3">
                  <span>Model: {agent.preferredModel ? agent.preferredModel.providerName : 'Not Set'}</span>
                  <button className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                    <Settings className="w-3 h-3" /> Manage
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
