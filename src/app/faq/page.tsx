import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Are all products on VoltEdge 100% brand new and genuine?',
      a: 'Yes, absolutely. We strictly sell brand-new, factory-sealed hardware sourced directly through official regional distribution channels (ASUS, MSI, AMD, Intel, Corsair, Logitech, Samsung). We do not deal in refurbished or used components.',
    },
    {
      q: 'How does Cash on Delivery (COD) work for hardware orders?',
      a: 'You can place orders up to Rs. 100,000 via Cash on Delivery. When the courier rider from TCS or Leopard arrives at your doorstep, you inspect the external tamper-proof seal and pay in cash.',
    },
    {
      q: 'How do I pay via Direct Bank Transfer?',
      a: 'Select "Direct Bank Transfer" during checkout. You will immediately receive our official Habib Bank Limited (HBL) corporate account title, account number, and IBAN on the confirmation screen. Transfer via your mobile banking app (HBL, Meezan, Alfalah, Standard Chartered, or Raast) and send the receipt screenshot for instant clearance.',
    },
    {
      q: 'How long will delivery take to Karachi or Islamabad?',
      a: 'Deliveries to Karachi, Islamabad, and Rawalpindi take 24 to 48 hours via express air courier. Lahore orders are often delivered within 24 hours.',
    },
    {
      q: 'How do I claim warranty if a component malfunctions?',
      a: 'Contact our support team at warranty@voltedge.pk with your order number. We will guide you through diagnosing the issue and facilitate the warranty claim with the brand authorized service center.',
    },
    {
      q: 'Can you help me verify compatibility before purchasing my PC build?',
      a: 'Yes! Our technical team is available via WhatsApp (+92 300 1234567) or the Contact page to verify CPU sockets, motherboard chipsets, RAM clearances, GPU length against your case, and power supply wattage requirements.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Help Center</span>
        <h1 className="text-3xl font-black text-white">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-400">Answers to common questions regarding hardware orders, shipping, and warranty</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-start gap-2">
              <span className="text-blue-400 font-extrabold">Q:</span>
              <span>{f.q}</span>
            </h3>
            <p className="text-xs text-slate-300 pl-5 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
