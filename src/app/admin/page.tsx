import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPKR, formatDate } from '@/lib/format';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '@/lib/constants';
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Package,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [
    orders,
    totalProducts,
    lowStockProducts,
    totalCustomers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.findMany({
      select: {
        totalAmount: true,
        status: true,
        paymentStatus: true,
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: 5 },
      },
      select: { id: true, title: true, sku: true, stock: true },
      take: 5,
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { stock: 'asc' },
      take: 5,
      include: {
        category: true,
        brand: true,
      },
    }),
  ]);

  // Aggregate metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  return (
    <div className="space-y-8">
      {/* Page Title & Fast Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Executive Store Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time sales, order fulfillment, and hardware inventory metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products?action=create"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition-colors"
          >
            Adjust Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2 card-hover">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Sales (PKR)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatPKR(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">Real database financial records</p>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2 card-hover">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalOrdersCount}</p>
          <p className="text-[11px] text-amber-400 font-semibold">
            {pendingOrdersCount} awaiting confirmation
          </p>
        </div>

        {/* Average Order Value */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2 card-hover">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatPKR(avgOrderValue)}</p>
          <p className="text-[11px] text-slate-400">Per customer checkout</p>
        </div>

        {/* Low-Stock Alerts */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2 card-hover">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Low-Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400">{lowStockProducts.length}</p>
          <p className="text-[11px] text-slate-400">Items at or below 5 units</p>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders Queue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest customer checkout transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-400 hover:text-cyan-400 flex items-center gap-1"
            >
              All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Order Status</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentOrders.map((o) => {
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
                      <td className="py-3 font-mono font-bold text-cyan-400">
                        {o.orderNumber}
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-white">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400">{o.shippingCity}</p>
                      </td>
                      <td className="py-3 font-bold text-slate-100">
                        {formatPKR(o.totalAmount)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.bg} ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${payMeta.bg} ${payMeta.color}`}>
                          {payMeta.label}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-cyan-400 hover:bg-blue-600 hover:text-white font-semibold text-[11px] transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low-Stock Inventory Alerts */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Low Stock Warnings
            </h2>
            <Link href="/admin/inventory" className="text-xs text-blue-400 hover:text-cyan-400 font-semibold">
              Ledger →
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 py-4">
              <CheckCircle2 className="w-4 h-4" /> All hardware items are well-stocked!
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-slate-800/40 border border-rose-500/20 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-100 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex-shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/admin/inventory"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold text-center block transition-colors"
            >
              Perform Stock Restock / Adjustment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
