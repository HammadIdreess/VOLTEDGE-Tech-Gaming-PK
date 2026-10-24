'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Truck, AlertCircle, Save } from 'lucide-react';

interface AdminOrderStatusControlProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
  };
}

export default function AdminOrderStatusControl({ order }: AdminOrderStatusControlProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [courierName, setCourierName] = useState('TCS Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/v1/admin/orders/${order.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          notes: notes.trim(),
          courierName: courierName.trim(),
          trackingNumber: trackingNumber.trim(),
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Failed to update order' });
        return;
      }

      setFeedback({ type: 'success', message: 'Order status successfully updated in database!' });
      setNotes('');
      setTrackingNumber('');
      router.refresh();
    } catch {
      setSaving(false);
      setFeedback({ type: 'error', message: 'Network error updating order' });
    }
  };

  return (
    <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
        Fulfillment &amp; Status Controls
      </h2>

      {feedback && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Order Status Selector */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300">Order Fulfillment Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
        >
          <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing &amp; Packing</option>
          <option value="SHIPPED">Shipped with Courier</option>
          <option value="DELIVERED">Delivered to Customer</option>
          <option value="CANCELLED">Cancelled (Restock inventory)</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      {/* Payment Status Selector */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300">
          Payment Status (Method: {order.paymentMethod.replace(/_/g, ' ')})
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
        >
          <option value="PENDING">Pending Payment</option>
          <option value="AWAITING_VERIFICATION">Awaiting Bank Verification</option>
          <option value="PAID">Paid in Full</option>
          <option value="FAILED">Failed Payment</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Courier & Tracking (Enabled for Shipped or Confirmed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Courier Partner</label>
          <select
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
          >
            <option value="TCS Express">TCS Express</option>
            <option value="Leopard Courier">Leopard Courier</option>
            <option value="Trax Logistics">Trax Logistics</option>
            <option value="M&amp;P Express">M&amp;P Express</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Tracking Reference #</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. 7709218491"
            className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none font-mono"
          />
        </div>
      </div>

      {/* Admin Notes */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300">Internal Audit Notes</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Verified HBL bank transfer receipt. Dispatched package via TCS DHA hub."
          className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? 'Updating Database...' : 'Apply Status Update'}
      </button>
    </form>
  );
}
