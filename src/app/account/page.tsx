import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatPKR, formatDate } from '@/lib/format';
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '@/lib/constants';
import { User, Package, MapPin, Heart, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

interface AccountPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  const { tab = 'orders' } = await searchParams;

  const [user, orders, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) {
    redirect('/account/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header Profile */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{user.name}</h1>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400 font-bold text-[10px] border border-blue-500/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email} • {user.phone || 'No phone recorded'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
            >
              Go to Admin Panel →
            </Link>
          )}
          <form action="/api/v1/auth/logout" method="POST">
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10 gap-2">
        <Link
          href="/account?tab=orders"
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            tab === 'orders'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Order History ({orders.length})
        </Link>
        <Link
          href="/account?tab=addresses"
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            tab === 'addresses'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Saved Addresses ({addresses.length})
        </Link>
      </div>

      {/* Tab: Orders */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 space-y-3">
              <Package className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-200">No orders placed yet</h3>
              <p className="text-xs text-slate-400">Discover hardware components and start your setup build.</p>
              <Link
                href="/products"
                className="inline-block mt-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Browse Hardware Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
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
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400">{o.orderNumber}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Placed on {formatDate(o.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.bg} ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${payMeta.bg} ${payMeta.color}`}>
                          {payMeta.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {o.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-slate-300">
                          <span>
                            {item.quantity}x {item.productTitle}{' '}
                            {item.variantName && <span className="text-cyan-400">({item.variantName})</span>}
                          </span>
                          <span className="font-semibold text-slate-200">{formatPKR(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-slate-400">Total Amount: </span>
                        <strong className="text-blue-400 text-sm font-extrabold">{formatPKR(o.totalAmount)}</strong>
                        <span className="text-slate-400 text-[10px] ml-2">via {o.paymentMethod.replace(/_/g, ' ')}</span>
                      </div>

                      <Link
                        href={`/orders/${o.orderNumber}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
                      >
                        Track &amp; View Details
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Addresses */}
      {tab === 'addresses' && (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-white/5">
              <p className="text-xs text-slate-400">
                You haven&apos;t saved any delivery addresses yet. Addresses are automatically saved upon checkout.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{addr.recipientName}</span>
                    {addr.isDefaultShipping && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400 font-bold text-[10px]">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300">{addr.streetAddress}</p>
                  <p className="text-slate-400">{addr.area}, {addr.city}</p>
                  <p className="text-slate-400">{addr.province} {addr.postalCode ? `- ${addr.postalCode}` : ''}</p>
                  <p className="text-cyan-400 font-mono pt-1">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
