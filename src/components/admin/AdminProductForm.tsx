'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

interface BrandOption {
  id: string;
  name: string;
}

interface AdminProductFormProps {
  categories: CategoryOption[];
  brands: BrandOption[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminProductForm({
  categories,
  brands,
  isOpen,
  onClose,
}: AdminProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brandId: brands[0]?.id || '',
    categoryId: categories[0]?.id || '',
    basePrice: '',
    salePrice: '',
    sku: '',
    stock: '10',
    warrantyMonths: '36',
    isFeatured: false,
    imageUrl: '',
    shortDescription: '',
    description: '',
  });

  const [specList, setSpecList] = useState<{ groupName: string; specKey: string; specValue: string }[]>([
    { groupName: 'General', specKey: 'Chipset', specValue: '' },
    { groupName: 'General', specKey: 'Memory', specValue: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData((prev) => ({ ...prev, title: val, slug: autoSlug }));
  };

  const addSpec = () => {
    setSpecList((prev) => [...prev, { groupName: 'General', specKey: '', specValue: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: string, value: string) => {
    setSpecList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        specifications: specList.filter((s) => s.specKey.trim() && s.specValue.trim()),
      };

      const res = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Failed to create product');
        return;
      }

      setSuccess('Product successfully added to VoltEdge catalog!');
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1000);
    } catch {
      setLoading(false);
      setError('An error occurred while creating the product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0c1220] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-black text-white">Add New Hardware Product</h2>
            <p className="text-slate-400 text-xs">Publish a new component to the customer storefront</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-300">Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Product SKU *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. GPU-ROG-4070TIS"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Brand *</label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Base Price (PKR) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="e.g. 285000"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none font-bold text-blue-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Sale Price (PKR, Optional)</label>
              <input
                type="number"
                min="0"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                placeholder="e.g. 269999"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Initial Stock Units *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Official Warranty (Months)</label>
              <input
                type="number"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                placeholder="36"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-300">High-Res Product Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... or hosted web link"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-300">Short Summary</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Key selling points for cards & listing summaries"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-300">Detailed Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Full technical overview and architecture details"
                className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Specifications Builder */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Hardware Specifications Matrix
              </label>
              <button
                type="button"
                onClick={addSpec}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Attribute
              </button>
            </div>
            <div className="space-y-2">
              {specList.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={spec.groupName}
                    onChange={(e) => updateSpec(idx, 'groupName', e.target.value)}
                    placeholder="Group (e.g. GPU, Power)"
                    className="w-28 bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  />
                  <input
                    type="text"
                    value={spec.specKey}
                    onChange={(e) => updateSpec(idx, 'specKey', e.target.value)}
                    placeholder="Key (e.g. VRAM, Boost Clock)"
                    className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  />
                  <input
                    type="text"
                    value={spec.specValue}
                    onChange={(e) => updateSpec(idx, 'specValue', e.target.value)}
                    placeholder="Value (e.g. 16GB GDDR6X)"
                    className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span className="font-semibold text-slate-200">Feature this product on Homepage</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Creating...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
