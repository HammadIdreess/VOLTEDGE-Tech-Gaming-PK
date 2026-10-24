import React from 'react';
import { RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">VoltEdge Policies</span>
        <h1 className="text-3xl font-black text-white">Return &amp; Warranty Policy</h1>
        <p className="text-xs text-slate-400">7-Day Check Warranty &amp; Official Brand Warranty Claim Procedure</p>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            1. 7-Day Replacement / Checking Window
          </h2>
          <p>
            All products purchased from VoltEdge include an initial <strong>7-Day Checking Window</strong> starting from the day of confirmed delivery. If any component arrives dead-on-arrival (DOA), defective out-of-the-box, or suffers from hardware malfunction, VoltEdge will replace the unit or issue a full refund at no extra cost.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            2. Official Brand Warranty (1 to 5 Years)
          </h2>
          <p>
            Beyond the 7-day checking period, components are backed by the manufacturer&apos;s official warranty:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Graphics Cards (ASUS, MSI):</strong> 3 Years local distributor warranty.</li>
            <li><strong>Processors (AMD, Intel):</strong> 3 Years limited warranty (boxed units).</li>
            <li><strong>RAM &amp; Storage (Corsair, Samsung):</strong> 3 to 5 Years limited warranty.</li>
            <li><strong>Power Supplies (Seasonic):</strong> Up to 10 Years manufacturer warranty.</li>
            <li><strong>Peripherals (Razer, Logitech):</strong> 1 to 2 Years replacement warranty.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            3. Warranty Exclusions
          </h2>
          <p>
            Warranty does not cover physical burns caused by external electrical short-circuits, unauthorized soldering or tampering, bent CPU pins caused by improper user installation, or liquid damage.
          </p>
        </section>
      </div>
    </div>
  );
}
