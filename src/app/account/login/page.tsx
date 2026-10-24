'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      if (data.user?.role === 'ADMIN' || data.user?.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <Zap className="w-6 h-6 fill-cyan-400" />
        </div>
        <h1 className="text-2xl font-black text-white">Sign In to VoltEdge</h1>
        <p className="text-xs text-slate-400">Access your order history, tracking, and saved hardware lists</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.pk"
              required
              className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/account/register" className="text-cyan-400 hover:underline font-semibold">
              Create an Account
            </Link>
          </p>
        </div>
      </form>

      {/* Demo helper */}
      <div className="p-4 rounded-2xl bg-slate-900/30 border border-white/5 text-[11px] text-slate-400 space-y-1.5">
        <p className="font-bold text-slate-300">Quick Test Credentials:</p>
        <p>• Admin: <code className="text-cyan-400 font-mono">admin@voltedge.pk</code> / <code className="text-slate-300 font-mono">AdminVoltEdge2026!</code></p>
        <p>• Customer: <code className="text-cyan-400 font-mono">hammad.dev@example.pk</code> / <code className="text-slate-300 font-mono">CustomerPass123!</code></p>
      </div>
    </div>
  );
}
