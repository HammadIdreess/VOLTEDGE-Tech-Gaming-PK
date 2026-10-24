'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPKR } from '@/lib/format';
import AdminProductForm from './AdminProductForm';
import { Plus, Search, Star, ExternalLink, Package, Check, X, Filter } from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice: number | null;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category: { name: string };
  brand: { name: string };
  images: { url: string }[];
}

interface CategoryOption {
  id: string;
  name: string;
}

interface BrandOption {
  id: string;
  name: string;
}

interface AdminProductsClientProps {
  initialProducts: any[];
  categories: CategoryOption[];
  brands: BrandOption[];
}

export default function AdminProductsClient({
  initialProducts,
  categories,
  brands,
}: AdminProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category.name === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const toggleFeatured = async (product: ProductItem) => {
    setLoadingId(product.id);
    const newVal = !product.isFeatured;
    try {
      const res = await fetch('/api/v1/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, isFeatured: newVal }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isFeatured: newVal } : p))
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  const toggleActive = async (product: ProductItem) => {
    setLoadingId(product.id);
    const newVal = !product.isActive;
    try {
      const res = await fetch('/api/v1/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, isActive: newVal }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: newVal } : p))
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Hardware Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage components, prices, variants, specifications, and store visibility
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-1 max-w-md items-center gap-2 bg-slate-800/80 border border-white/10 rounded-xl px-3 py-1.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, brand..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <span className="text-slate-400 font-semibold">{filteredProducts.length} Products</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/5 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category &amp; Brand</th>
                <th className="py-3 px-4">Price (PKR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=100&q=80'}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-white truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-cyan-400">{p.brand.name}</p>
                    <p className="text-[10px] text-slate-400">{p.category.name}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-400">
                    {formatPKR(p.salePrice || p.basePrice)}
                    {p.salePrice && p.salePrice < p.basePrice && (
                      <span className="block text-[10px] text-slate-400 line-through">
                        {formatPKR(p.basePrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock <= 5
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(p)}
                      disabled={loadingId === p.id}
                      className={`p-1.5 rounded-lg border transition-all ${
                        p.isFeatured
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 border-white/5 hover:text-slate-300'
                      }`}
                      title="Toggle Featured on Homepage"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(p)}
                      disabled={loadingId === p.id}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                        p.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-white/10'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 font-semibold"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Creation Modal */}
      <AdminProductForm
        categories={categories}
        brands={brands}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
