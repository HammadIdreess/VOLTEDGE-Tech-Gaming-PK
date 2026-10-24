import React from 'react';
import { prisma } from '@/lib/db';
import AdminCouponsClient from '@/components/admin/AdminCouponsClient';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <AdminCouponsClient initialCoupons={coupons} />
    </div>
  );
}
