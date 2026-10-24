import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  ArrowLeft,
  Zap,
  ShieldAlert,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Strict server boundary authorization check
  if (!session || (session.role !== 'ADMIN' && session.role !== 'STAFF')) {
    redirect('/account/login?redirect=/admin');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories & Brands', href: '/admin/categories', icon: Layers },
    { label: 'Inventory Ledger', href: '/admin/inventory', icon: Boxes },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0f1d] border-r border-white/10 flex flex-col flex-shrink-0">
        {/* Admin Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white">
                VOLT<span className="text-blue-500">ADMIN</span>
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-cyan-400 font-bold -mt-0.5">
                Executive Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Admin User Info */}
        <div className="px-5 py-3 border-b border-white/5 bg-slate-900/40 text-xs">
          <p className="font-bold text-slate-200 truncate">{session.name}</p>
          <p className="text-[11px] text-slate-400 truncate">{session.email}</p>
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-400 font-bold text-[9px] border border-blue-500/30">
            {session.role}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold transition-colors"
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Storefront */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Customer Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10 space-y-8">
        {children}
      </main>
    </div>
  );
}
