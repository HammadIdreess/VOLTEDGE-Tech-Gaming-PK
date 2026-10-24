import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Cpu, Award, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 font-bold text-xs uppercase tracking-wider border border-blue-500/20">
          About VoltEdge
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Powering Pakistan&apos;s Digital Hardware Frontier
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          VoltEdge was founded to solve a critical challenge facing Pakistan&apos;s PC gamers, developers, and hardware builders: accessing 100% authentic, sealed computer components with verified local warranties and fair PKR pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Authorized Distribution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every NVIDIA RTX card, AMD Ryzen chip, Intel processor, and Samsung NVMe drive comes strictly through official regional channels.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Enthusiast-Driven Staff</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our team consists of passionate hardware builders who understand VRM phases, memory timings, cooling loops, and esports sensor latency.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Transparent Warranties</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Clear 1 to 5 year manufacturer warranties documented with verified serial numbers and hassle-free local claim handling.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white">Our Head Office &amp; Fulfillment Hub</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Located in Lahore, Pakistan, our centralized fulfillment facility maintains an anti-static climate-controlled warehouse to ensure components are kept in factory condition before dispatch via express insured courier nationwide.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
          >
            Contact Customer Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
