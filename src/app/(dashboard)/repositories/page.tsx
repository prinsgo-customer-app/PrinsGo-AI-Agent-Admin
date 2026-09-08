'use client';

import React, { useEffect, useState } from 'react';
import { GitBranch, GitPullRequest, CheckCircle2, XCircle, Settings } from 'lucide-react';

interface Repository {
  _id: string;
  name: string;
  url: string;
  provider: string;
  status: string;
  workspaceId: { name: string } | null;
  healthStatus?: string;
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch('/api/repositories');
        if (res.ok) {
          const data = await res.json();
          setRepos(data.repos || []);
          setIsGithubConnected(data.isGithubConnected || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <GitBranch className="text-purple-600" />
          Repositories
        </h1>
        <a
          href="/api/github/connect"
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
            isGithubConnected
              ? 'bg-gray-100 text-gray-700 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          {isGithubConnected ? 'GitHub Connected' : 'Connect GitHub'}
        </a>
      </div>

      {!loading && !isGithubConnected && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700 font-medium">
                Configuration Required: GitHub integration is not yet connected.
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Please connect your GitHub account or configure the GitHub App in Settings to manage repositories and allow agents to interact with your codebase.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading repositories...</div>
        ) : repos.length === 0 ? (
          <div className="p-12 text-center">
            <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Repositories Connected</h3>
            <p className="mt-1 text-sm text-gray-500">
              No repositories have been imported yet.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workspace</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repos.map((repo) => (
                <tr key={repo._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {repo.provider === 'GITHUB' ? <GitPullRequest className="h-5 w-5 text-gray-400 mr-3" /> : <GitBranch className="h-5 w-5 text-gray-400 mr-3" />}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{repo.name}</div>
                        <div className="text-sm text-gray-500">{repo.url}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      repo.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {repo.status === 'CONNECTED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {repo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {repo.healthStatus || 'UNKNOWN'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repo.workspaceId?.name || 'Global'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
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
