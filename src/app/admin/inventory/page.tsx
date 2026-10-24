import React from 'react';
import { prisma } from '@/lib/db';
import AdminInventoryClient from '@/components/admin/AdminInventoryClient';

export default async function AdminInventoryPage() {
  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        title: true,
        sku: true,
        stock: true,
        lowStockThreshold: true,
        basePrice: true,
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    }),
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminInventoryClient products={products} movements={movements} />
    </div>
  );
}
