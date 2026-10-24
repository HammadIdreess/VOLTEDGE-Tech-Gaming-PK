'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPKR, formatDateTime } from '@/lib/format';
import { Boxes, Plus, Minus, AlertTriangle, CheckCircle2, History, X } from 'lucide-react';

interface ProductInventoryItem {
  id: string;
  title: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  basePrice: number;
  category: { name: string };
  brand: { name: string };
}

interface MovementItem {
  id: string;
  productId: string | null;
  quantityDelta: number;
  resultingStock: number;
  movementType: string;
  reason: string;
  createdAt: string | Date;
}

interface AdminInventoryClientProps {
  products: ProductInventoryItem[];
  movements: MovementItem[];
}

export default function AdminInventoryClient({
  products,
  movements,
}: AdminInventoryClientProps) {
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<ProductInventoryItem | null>(null);
  const [delta, setDelta] = useState<number>(5);
  const [reason, setReason] = useState<string>('Stock shipment received from distributor');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/v1/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantityDelta: delta,
          reason,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Failed to adjust stock' });
        return;
      }

      setFeedback({ type: 'success', message: `Stock for "${selectedProduct.title}" updated successfully!` });
      setTimeout(() => {
        setSelectedProduct(null);
        router.refresh();
      }, 1000);
    } catch {
      setSubmitting(false);
      setFeedback({ type: 'error', message: 'Network error performing stock adjustment' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Inventory Ledger &amp; Stock Control</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track warehouse quantities, low-stock thresholds, and auditable stock movement transactions
          </p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="p-4 bg-slate-800/40 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Current Stock on Hand ({products.length} Products)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/5 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Hardware Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Brand / Category</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {products.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {p.brand.name} • {p.category.name}
                    </td>
                    <td className="py-3 px-4 font-bold text-sm text-slate-100">
                      {p.stock} units
                    </td>
                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20 w-fit block">
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setDelta(5);
                          setFeedback(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-cyan-400 hover:text-white font-semibold text-xs transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Audit History */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <History className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Stock Movement Audit Ledger
          </h2>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          {movements.length === 0 ? (
            <p className="text-slate-400 py-4">No inventory movements recorded yet.</p>
          ) : (
            movements.map((m) => (
              <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        m.quantityDelta > 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                    </span>
                    <span className="font-bold text-slate-200">{m.movementType.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{m.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-300 font-semibold">Resulting: {m.resultingStock} units</p>
                  <p className="text-[10px] text-slate-500">{formatDateTime(m.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0c1220] border border-white/10 p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Manual Stock Adjustment</h3>
                <p className="text-slate-400 text-xs truncate max-w-xs">{selectedProduct.title}</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleAdjust} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[11px]">Current Stock on Hand:</span>
                <span className="text-xl font-black text-blue-400">{selectedProduct.stock} units</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Adjustment Delta (Positive to add, Negative to remove)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDelta((d) => d - 1)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={delta}
                    onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
                    className="flex-1 text-center font-bold text-base bg-slate-800 border border-white/10 rounded-xl text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setDelta((d) => d + 1)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-cyan-400">
                  Resulting Stock will be: {Math.max(0, selectedProduct.stock + delta)} units
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Audit Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                >
                  <option value="Stock shipment received from distributor">Stock shipment received from distributor</option>
                  <option value="Physical stock count reconciliation">Physical stock count reconciliation</option>
                  <option value="Damaged / RMA warranty replacement removed">Damaged / RMA warranty replacement removed</option>
                  <option value="Direct showroom sale adjustment">Direct showroom sale adjustment</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || delta === 0}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {submitting ? 'Updating...' : 'Commit Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
