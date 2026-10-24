'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPKR } from '@/lib/format';
import { Tag, Plus, Check, X, AlertCircle } from 'lucide-react';

interface CouponItem {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  timesUsed: number;
  isActive: boolean;
}

interface AdminCouponsClientProps {
  initialCoupons: CouponItem[];
}

export default function AdminCouponsClient({ initialCoupons }: AdminCouponsClientProps) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '10',
    minOrderAmount: '25000',
    maxDiscountAmount: '15000',
    usageLimit: '100',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleCoupon = async (c: CouponItem) => {
    const newVal = !c.isActive;
    try {
      const res = await fetch('/api/v1/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: c.id, isActive: newVal }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((item) => (item.id === c.id ? { ...item, isActive: newVal } : item))
        );
      }
    } catch {}
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/v1/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setError(data.error || 'Failed to create coupon');
        return;
      }

      setCoupons((prev) => [data.coupon, ...prev]);
      setIsFormOpen(false);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '10',
        minOrderAmount: '25000',
        maxDiscountAmount: '15000',
        usageLimit: '100',
      });
      router.refresh();
    } catch {
      setSubmitting(false);
      setError('Network error creating coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Promotions &amp; Coupons Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create percentage or fixed-amount promotional discount codes for Pakistani tech shoppers
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Promo Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/5 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Type &amp; Value</th>
                <th className="py-3 px-4">Min Order (PKR)</th>
                <th className="py-3 px-4">Usage Limit</th>
                <th className="py-3 px-4">Redeemed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : formatPKR(c.discountValue)}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {c.minOrderAmount ? formatPKR(c.minOrderAmount) : 'None'}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {c.usageLimit ? `${c.usageLimit} times` : 'Unlimited'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-400">
                    {c.timesUsed} used
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleCoupon(c)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        c.isActive
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {c.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0c1220] border border-white/10 p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Create Promotional Coupon</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FLASH20"
                  className="w-full uppercase font-mono font-bold bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Min Order Amount (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="25000"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Total Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {submitting ? 'Creating...' : 'Publish Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
