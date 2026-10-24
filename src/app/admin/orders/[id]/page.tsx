import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatPKR, formatDateTime } from '@/lib/format';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '@/lib/constants';
import AdminOrderStatusControl from '@/components/admin/AdminOrderStatusControl';
import { ArrowLeft, MapPin, Building2, Package, CheckCircle2, Clock } from 'lucide-react';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
      payments: true,
      shipments: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusMeta = ORDER_STATUS_MAP[order.status] || {
    label: order.status,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  };

  const payMeta = PAYMENT_STATUS_MAP[order.paymentStatus] || {
    label: order.paymentStatus,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Order {order.orderNumber}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg} ${statusMeta.color}`}>
              {statusMeta.label}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${payMeta.bg} ${payMeta.color}`}>
              {payMeta.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items Snapshot & Financials */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Order Items ({order.items.length})
            </h2>

            <div className="divide-y divide-white/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-slate-100 truncate">{item.productTitle}</p>
                    {item.variantName && (
                      <p className="text-[11px] text-cyan-400">Variant: {item.variantName}</p>
                    )}
                    <p className="text-[10px] text-slate-400 font-mono">
                      SKU: {item.sku} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-200">{formatPKR(item.totalPrice)}</p>
                    <p className="text-[10px] text-slate-400">{formatPKR(item.unitPrice)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">{formatPKR(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount ({order.couponCode || 'Promo'})</span>
                  <span>-{formatPKR(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPKR(order.shippingFee)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-sm">
                <span className="font-bold text-white">Grand Total</span>
                <span className="font-black text-blue-400">{formatPKR(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Customer &amp; Shipping Destination
            </h2>

            <div className="space-y-1 text-slate-300">
              <p className="font-bold text-white text-sm">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingArea}, {order.shippingCity}</p>
              <p>{order.shippingProvince} {order.shippingPostalCode ? `- ${order.shippingPostalCode}` : ''}</p>
              <p className="pt-1 text-cyan-400 font-mono font-bold">{order.customerPhone}</p>
              <p className="text-slate-400">{order.customerEmail}</p>
            </div>

            {order.deliveryNotes && (
              <div className="pt-2 border-t border-white/5 text-slate-400">
                <span className="font-bold text-slate-300">Customer Delivery Notes: </span>
                <span>{order.deliveryNotes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Status Control & Fulfillment Action */}
        <div className="lg:col-span-5 space-y-6">
          <AdminOrderStatusControl order={order} />

          {/* Shipment Details if any */}
          {order.shipments.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-cyan-400" />
                Courier Tracking References
              </h2>
              {order.shipments.map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1">
                  <p className="font-bold text-slate-200">{s.courierName || 'Courier'}</p>
                  <p className="font-mono text-cyan-400 font-bold">{s.trackingNumber}</p>
                  <p className="text-[10px] text-slate-500">Dispatched: {formatDateTime(s.shippedAt)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Status Change Audit Log */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              Order Status History Log
            </h2>
            <div className="space-y-3">
              {order.statusHistory.map((h) => (
                <div key={h.id} className="p-2.5 rounded-xl bg-slate-800/30 border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{h.status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-500">{formatDateTime(h.createdAt)}</span>
                  </div>
                  {h.notes && <p className="text-slate-400 text-[11px]">{h.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
