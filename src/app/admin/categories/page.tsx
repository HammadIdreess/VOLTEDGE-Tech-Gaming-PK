import React from 'react';
import { prisma } from '@/lib/db';
import { Layers, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-white">Categories &amp; Brand Partners</h1>
        <p className="text-xs text-slate-400 mt-1">Manage catalog taxonomies, slugs, and manufacturer partner links</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Categories List */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/50 border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Product Categories ({categories.length})
            </h2>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {categories.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{c.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">slug: {c.slug} • sort: {c.sortOrder}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 font-semibold text-[11px]">
                    {c._count.products} Products
                  </span>
                  <Link
                    href={`/products?category=${c.slug}`}
                    target="_blank"
                    className="text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands List */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/50 border border-white/10 p-6 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Brand Manufacturers ({brands.length})
            </h2>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {brands.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{b.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{b.website || 'No website link'}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px]">
                  {b._count.products} Products
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
