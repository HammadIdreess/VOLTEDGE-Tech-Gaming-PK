import React from 'react';
import { Lock, Shield, Eye } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">VoltEdge Policies</span>
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Your data privacy &amp; security commitments</p>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            1. Information We Collect
          </h2>
          <p>
            When placing an order or registering an account on VoltEdge, we collect your name, email address, Pakistani phone number, and delivery address solely for fulfilling courier deliveries and providing order tracking updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            2. Payment Security
          </h2>
          <p>
            VoltEdge does not store or process payment card numbers or CVV codes on our servers. All financial transactions are authenticated via tokenized bank gateways or direct inter-bank transfers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            3. No Data Selling
          </h2>
          <p>
            We strictly do not sell, rent, or trade your personal information with third-party advertising companies. Your details are shared only with our trusted courier logistics partners (TCS / Leopard) for the single purpose of package delivery.
          </p>
        </section>
      </div>
    </div>
  );
}
