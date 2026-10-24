import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">VoltEdge Policies</span>
        <h1 className="text-3xl font-black text-white">Shipping &amp; Delivery Policy</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026 • Effective across Pakistan</p>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            1. Nationwide Courier Partners &amp; Transit Insurance
          </h2>
          <p>
            VoltEdge delivers throughout Pakistan in partnership with premier courier networks: TCS, Leopard Courier, and Trax Logistics. Every shipment containing sensitive electronic components (Graphics Cards, Processors, Monitors, Motherboards) is 100% transit-insured against damage or loss until delivered into the customer&apos;s hands.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            2. Delivery Timeframes
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Lahore Metropolitan Area:</strong> 24 Hours (Same-day dispatch for orders confirmed before 3:00 PM).</li>
            <li><strong>Karachi, Islamabad &amp; Rawalpindi:</strong> 24 to 48 Hours via air express.</li>
            <li><strong>Faisalabad, Multan, Peshawar, Sialkot, Gujranwala:</strong> 48 Hours.</li>
            <li><strong>Balochistan, Interior Sindh, AJK &amp; Remote Regions:</strong> 3 to 5 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            3. Shipping Rates &amp; Free Shipping Eligibility
          </h2>
          <p>
            We offer <strong>FREE Express Shipping nationwide</strong> on all orders with a subtotal of <strong>Rs. 50,000 or greater</strong>.
          </p>
          <p>
            For orders below Rs. 50,000, a standard flat shipping fee of <strong>Rs. 500</strong> applies to cover heavy anti-static foam packaging and insurance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            4. Package Inspection upon Cash on Delivery (COD)
          </h2>
          <p>
            Customers ordering via Cash on Delivery have the right to inspect the external security seal and tamper-evident courier flyer before releasing payment. If the flyer appears torn or tampered with, refuse receipt and notify VoltEdge support immediately at <strong>+92 300 1234567</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
