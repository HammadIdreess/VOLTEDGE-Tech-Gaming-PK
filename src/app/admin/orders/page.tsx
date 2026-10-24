import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPKR, formatDate } from '@/lib/format';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '@/lib/constants';
import { ShoppingCart, Filter, Eye, Search } from 'lucide-react';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    payment?: string;
    q?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const { status, payment, q } = params;

  const where: any = {};
  if (status) where.status = status;
  if (payment) where.paymentStatus = payment;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { customerName: { contains: q } },
      { customerEmail: { contains: q } },
      { customerPhone: { contains: q } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Orders Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review, confirm, fulfill, and track Pakistani hardware shipments</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <Link
            href="/admin/orders"
            className={`px-3 py-1 rounded-lg ${!status ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'}`}
          >
            All
          </Link>
          <Link
            href="/admin/orders?status=PENDING_CONFIRMATION"
            className={`px-3 py-1 rounded-lg ${status === 'PENDING_CONFIRMATION' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Pending
          </Link>
          <Link
            href="/admin/orders?status=CONFIRMED"
            className={`px-3 py-1 rounded-lg ${status === 'CONFIRMED' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Confirmed
          </Link>
          <Link
            href="/admin/orders?status=PROCESSING"
            className={`px-3 py-1 rounded-lg ${status === 'PROCESSING' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Processing
          </Link>
          <Link
            href="/admin/orders?status=SHIPPED"
            className={`px-3 py-1 rounded-lg ${status === 'SHIPPED' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Shipped
          </Link>
          <Link
            href="/admin/orders?status=DELIVERED"
            className={`px-3 py-1 rounded-lg ${status === 'DELIVERED' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Delivered
          </Link>
        </div>

        <span className="text-slate-400 font-semibold">{orders.length} Orders Found</span>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/5 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const statusMeta = ORDER_STATUS_MAP[o.status] || {
                    label: o.status,
                    color: 'text-blue-400',
                    bg: 'bg-blue-400/10 border-blue-400/20',
                  };
                  const payMeta = PAYMENT_STATUS_MAP[o.paymentStatus] || {
                    label: o.paymentStatus,
                    color: 'text-amber-400',
                    bg: 'bg-amber-400/10 border-amber-400/20',
                  };

                  return (
                    <tr key={o.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{formatDate(o.createdAt)}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400">{o.shippingCity}, {o.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-blue-400">
                        {formatPKR(o.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.bg} ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${payMeta.bg} ${payMeta.color}`}>
                          {payMeta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-cyan-400 hover:text-white font-semibold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
