import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatPKR, formatDateTime } from '@/lib/format';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '@/lib/constants';
import { CheckCircle2, Clock, Truck, ShieldCheck, MapPin, Building2, Package, ArrowLeft, Printer } from 'lucide-react';

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
      payments: true,
      shipments: true,
    },
  });

  if (!order) {
    notFound();
  }

  const orderStatusInfo = ORDER_STATUS_MAP[order.status] || {
    label: order.status,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  };

  const paymentStatusInfo = PAYMENT_STATUS_MAP[order.paymentStatus] || {
    label: order.paymentStatus,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  };

  const isBankTransfer = order.paymentMethod === 'BANK_TRANSFER';

  // Bank details from store settings or default
  const bankDetails = {
    bankName: 'Habib Bank Limited (HBL)',
    accountTitle: 'VoltEdge Technologies (Pvt) Ltd',
    accountNumber: '10927901824103',
    iban: 'PK36HABB0010927901824103',
    branch: 'Y-Block DHA Phase 3, Lahore',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/30 text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your order has been recorded in our fulfillment queue. An automated confirmation has been generated for order{' '}
            <strong className="text-cyan-400 font-mono">{order.orderNumber}</strong>.
          </p>
        </div>
      </div>

      {/* Bank Transfer Instructions Box (If Bank Transfer) */}
      {isBankTransfer && order.paymentStatus !== 'PAID' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 to-slate-900/80 border border-blue-500/30 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Bank Transfer Instructions for Order #{order.orderNumber}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Please transfer the exact amount of <strong className="text-white font-bold">{formatPKR(order.totalAmount)}</strong> via online banking app or ATM transfer to our corporate account below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Bank:</span>
              <strong className="text-white">{bankDetails.bankName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Account Title:</span>
              <strong className="text-white">{bankDetails.accountTitle}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Account Number:</span>
              <strong className="text-cyan-400 font-mono">{bankDetails.accountNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">IBAN:</span>
              <strong className="text-cyan-400 font-mono">{bankDetails.iban}</strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            * Please include your order number <strong className="text-cyan-400 font-mono">{order.orderNumber}</strong> in the transfer remarks or WhatsApp the receipt screenshot to <strong className="text-slate-200">+92 300 1234567</strong> for instant clearance.
          </p>
        </div>
      )}

      {/* Order Status & Tracking Timeline */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Order Status &amp; Timeline</h2>
            <p className="text-xs text-slate-400 mt-0.5">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${orderStatusInfo.bg} ${orderStatusInfo.color}`}>
              {orderStatusInfo.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${paymentStatusInfo.bg} ${paymentStatusInfo.color}`}>
              {paymentStatusInfo.label}
            </span>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="space-y-4 pt-2">
          {order.statusHistory.map((step, idx) => (
            <div key={step.id} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-cyan-400 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                {idx < order.statusHistory.length - 1 && (
                  <div className="w-0.5 h-8 bg-white/10 my-1" />
                )}
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-slate-100">{step.status.replace(/_/g, ' ')}</p>
                {step.notes && <p className="text-slate-400">{step.notes}</p>}
                <p className="text-[10px] text-slate-500">{formatDateTime(step.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items & Address Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items Snapshot */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Purchased Hardware ({order.items.length})
          </h2>

          <div className="divide-y divide-white/5">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-slate-100 truncate">{item.productTitle}</p>
                  {item.variantName && (
                    <p className="text-[11px] text-cyan-400">Variant: {item.variantName}</p>
                  )}
                  <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku} • Qty: {item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-200">{formatPKR(item.totalPrice)}</p>
                  <p className="text-[10px] text-slate-400">{formatPKR(item.unitPrice)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
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

        {/* Right: Delivery & Customer Info */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Shipping Destination
          </h2>

          <div className="space-y-1 text-slate-300">
            <p className="font-bold text-slate-100 text-sm">{order.customerName}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingArea}, {order.shippingCity}</p>
            <p>{order.shippingProvince} {order.shippingPostalCode ? `- ${order.shippingPostalCode}` : ''}</p>
            <p className="pt-1 text-cyan-400 font-mono">{order.customerPhone}</p>
            <p className="text-slate-400">{order.customerEmail}</p>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1 text-slate-400">
            <p><strong className="text-slate-200">Payment:</strong> {order.paymentMethod.replace(/_/g, ' ')}</p>
            {order.deliveryNotes && (
              <p><strong className="text-slate-200">Notes:</strong> {order.deliveryNotes}</p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/products"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
