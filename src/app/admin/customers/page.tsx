import React from 'react';
import { prisma } from '@/lib/db';
import { formatPKR, formatDate } from '@/lib/format';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
        },
      },
      addresses: {
        take: 1,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-white">Registered Customer Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Review customer profiles, contact phone numbers, and aggregate order spend</p>
      </div>

      <div className="rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="p-4 bg-slate-800/40 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Total Customers: {customers.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/5 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4">Primary City</th>
                <th className="py-3 px-4">Registered On</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {customers.map((c) => {
                const totalSpent = c.orders
                  .filter((o) => o.status !== 'CANCELLED')
                  .reduce((acc, o) => acc + o.totalAmount, 0);

                return (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{c.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-300">{c.email}</p>
                      <p className="text-[10px] text-cyan-400 font-mono">{c.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {c.addresses[0]?.city || 'Punjab'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {c.orders.length} orders
                    </td>
                    <td className="py-3 px-4 font-extrabold text-blue-400 text-right">
                      {formatPKR(totalSpent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
