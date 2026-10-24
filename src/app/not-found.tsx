import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-cyan-400">
        <Cpu className="w-10 h-10" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">404 Error</span>
        <h1 className="text-3xl font-black text-white">Component Not Found</h1>
        <p className="text-xs text-slate-400">
          The requested hardware product, category, or page does not exist or has been archived.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
