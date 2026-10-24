import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">VoltEdge Legal</span>
        <h1 className="text-3xl font-black text-white">Terms and Conditions</h1>
        <p className="text-xs text-slate-400">Standard terms governing online purchases on VoltEdge</p>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            1. Pricing &amp; Currency (PKR)
          </h2>
          <p>
            All prices listed on VoltEdge are denominated in Pakistani Rupees (PKR) and include all applicable taxes unless expressly stated otherwise. Prices are subject to change without prior notice due to international foreign exchange rate adjustments; however, once an order is placed and confirmed, the quoted price is locked.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            2. Order Acceptance &amp; Verification
          </h2>
          <p>
            An order is considered binding upon generation of the official order confirmation number (e.g. VE-YYYYMMDD-XXXX). For high-value orders above Rs. 100,000, our support team may contact you via phone or WhatsApp to verify delivery address details before dispatching the insured package.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            3. Governing Law
          </h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan, subject to the jurisdiction of the competent courts in Lahore, Pakistan.
          </p>
        </section>
      </div>
    </div>
  );
}
