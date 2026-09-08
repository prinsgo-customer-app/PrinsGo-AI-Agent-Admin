'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'secret' | 'otp'>('secret');

  const [secret, setSecret] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = loginMethod === 'secret'
      ? { secret }
      : { phone, code };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || data.error || 'Failed to login');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <Bot className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            PrinsGo AI Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Control Plane Authentication
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setLoginMethod('secret')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              loginMethod === 'secret' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Admin Secret
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('otp')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              loginMethod === 'otp' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Phone & OTP
          </button>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            {loginMethod === 'secret' ? (
              <div>
                <input
                  id="secret"
                  name="secret"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Secret Key"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number (e.g., 9876543210)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="OTP Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loginMethod === 'secret' ? (
                  <Lock className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Phone className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" aria-hidden="true" />
                )}
              </span>
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
