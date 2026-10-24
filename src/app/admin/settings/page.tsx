import React from 'react';
import { prisma } from '@/lib/db';
import { Settings, ShieldCheck, Building2, Truck, CreditCard, Save } from 'lucide-react';

export default async function AdminSettingsPage() {
  const settingsRows = await prisma.storeSetting.findMany();
  const settingsMap: Record<string, any> = {};

  for (const s of settingsRows) {
    try {
      settingsMap[s.key] = JSON.parse(s.value);
    } catch {
      settingsMap[s.key] = s.value;
    }
  }

  const bank = settingsMap['BANK_DETAILS'] || {
    bankName: 'Habib Bank Limited (HBL)',
    accountTitle: 'VoltEdge Technologies (Pvt) Ltd',
    accountNumber: '10927901824103',
    iban: 'PK36HABB0010927901824103',
    branch: 'Y-Block DHA Lahore',
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-white">Store Configuration &amp; Payment Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure logistics rules, bank transfer accounts, and store defaults</p>
      </div>

      <div className="space-y-6">
        {/* Regional & Currency Info */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider border-b border-white/10 pb-3">
            <Settings className="w-4 h-4" />
            <span>Store Identity &amp; Regional Currency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block text-[11px]">Store Name</span>
              <p className="font-bold text-white text-sm">{settingsMap['STORE_NAME'] || 'VoltEdge'}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Currency</span>
              <p className="font-bold text-cyan-400 text-sm">{settingsMap['STORE_CURRENCY'] || 'PKR (Pakistani Rupee)'}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Operating Country</span>
              <p className="font-semibold text-slate-200">Pakistan</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Sales Tax Rate</span>
              <p className="font-semibold text-slate-200">{settingsMap['TAX_RATE_PERCENT'] || 0}% (Inclusive)</p>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider border-b border-white/10 pb-3">
            <Truck className="w-4 h-4" />
            <span>Shipping &amp; Logistics Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Standard Flat Courier Rate:</span>
              <p className="text-lg font-black text-white">Rs. {settingsMap['FLAT_SHIPPING_FEE'] || 500}</p>
              <p className="text-[10px] text-slate-500">Applies to orders below the free threshold</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Free Shipping Threshold:</span>
              <p className="text-lg font-black text-emerald-400">Rs. {settingsMap['FREE_SHIPPING_THRESHOLD'] || 50000}</p>
              <p className="text-[10px] text-slate-500">Orders above this qualify for free express shipping</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Credentials */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider border-b border-white/10 pb-3">
            <Building2 className="w-4 h-4" />
            <span>Corporate Bank Transfer Destination (HBL)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Bank Name:</span>
              <p className="font-bold text-white">{bank.bankName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Account Title:</span>
              <p className="font-bold text-white">{bank.accountTitle}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Account Number:</span>
              <p className="font-mono font-bold text-cyan-400">{bank.accountNumber}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">IBAN:</span>
              <p className="font-mono font-bold text-cyan-400">{bank.iban}</p>
            </div>
            <div className="space-y-0.5 sm:col-span-2">
              <span className="text-slate-400 text-[11px]">Branch:</span>
              <p className="text-slate-300">{bank.branch}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
