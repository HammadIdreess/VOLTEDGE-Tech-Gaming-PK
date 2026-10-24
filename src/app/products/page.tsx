import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPKR } from '@/lib/format';
import { Filter, SlidersHorizontal, ArrowUpDown, Check, Star, Cpu } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { category, brand, q, minPrice, maxPrice, inStock, sort } = params;

  // Build filter clauses
  const where: any = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (brand) {
    where.brand = { slug: brand };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { sku: { contains: q } },
      { shortDescription: { contains: q } },
      { brand: { name: { contains: q } } },
      { category: { name: { contains: q } } },
    ];
  }

  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) where.basePrice.gte = parseFloat(minPrice);
    if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
  }

  if (inStock === 'true') {
    where.stock = { gt: 0 };
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
  if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
  if (sort === 'featured') orderBy = { isFeatured: 'desc' };

  // Fetch products and filter categories & brands
  const [products, allCategories, allBrands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        variants: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const activeCategoryObj = allCategories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-cyan-400">Products</Link>
          {activeCategoryObj && (
            <>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
          {q && (
            <>
              <span>/</span>
              <span className="text-slate-200">Search: &quot;{q}&quot;</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {activeCategoryObj ? activeCategoryObj.name : q ? `Search Results for "${q}"` : 'All Computer Hardware & Peripherals'}
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Showing {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Filters
              </span>
              {(category || brand || q || minPrice || maxPrice || inStock || sort) && (
                <Link
                  href="/products"
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Clear All
                </Link>
              )}
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-400">Category</h3>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                <Link
                  href="/products"
                  className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    !category ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  All Categories
                </Link>
                {allCategories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}${brand ? `&brand=${brand}` : ''}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      category === c.slug ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold uppercase text-slate-400">Brand</h3>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                <Link
                  href={`/products${category ? `?category=${category}` : ''}`}
                  className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    !brand ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  All Brands
                </Link>
                {allBrands.map((b) => (
                  <Link
                    key={b.id}
                    href={`/products?${category ? `category=${category}&` : ''}brand=${b.slug}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      brand === b.slug ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="border-t border-white/5 pt-4">
              <Link
                href={`/products?${category ? `category=${category}&` : ''}${brand ? `brand=${brand}&` : ''}inStock=${inStock === 'true' ? 'false' : 'true'}`}
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    inStock === 'true' ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/20 bg-slate-800'
                  }`}
                >
                  {inStock === 'true' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>In-Stock Items Only</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Showing <strong className="text-slate-100">{products.length}</strong> available hardware items
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <div className="flex gap-1">
                <Link
                  href={`/products?${category ? `category=${category}&` : ''}${brand ? `brand=${brand}&` : ''}sort=newest`}
                  className={`px-2.5 py-1 rounded-lg ${
                    sort === 'newest' || !sort ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/products?${category ? `category=${category}&` : ''}${brand ? `brand=${brand}&` : ''}sort=price_asc`}
                  className={`px-2.5 py-1 rounded-lg ${
                    sort === 'price_asc' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/products?${category ? `category=${category}&` : ''}${brand ? `brand=${brand}&` : ''}sort=price_desc`}
                  className={`px-2.5 py-1 rounded-lg ${
                    sort === 'price_desc' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 space-y-3">
              <Cpu className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No products match your filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing selected categories or search terms to see all available inventory.
              </p>
              <Link
                href="/products"
                className="inline-block mt-3 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => {
                const price = p.salePrice ?? p.basePrice;
                const hasSale = p.salePrice && p.salePrice < p.basePrice;
                const primaryImage =
                  p.images[0]?.url ||
                  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={p.id}
                    className="group rounded-2xl bg-slate-900/40 border border-white/10 hover:border-blue-500/40 p-4 flex flex-col justify-between card-hover transition-all"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950/60 border border-white/5 mb-3 flex items-center justify-center">
                        {hasSale && (
                          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-[10px]">
                            SALE
                          </span>
                        )}
                        <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-400 font-semibold text-[10px] border border-white/10">
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                        </span>
                        <img
                          src={primaryImage}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Brand & Category */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="text-cyan-400 font-semibold">{p.brand.name}</span>
                        <span>•</span>
                        <span>{p.category.name}</span>
                      </div>

                      {/* Title */}
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors mt-1 line-clamp-2 leading-snug">
                          {p.title}
                        </h3>
                      </Link>

                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {p.shortDescription}
                      </p>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      <div>
                        {hasSale && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatPKR(p.basePrice)}
                          </p>
                        )}
                        <p className="text-sm font-black text-blue-400">
                          {formatPKR(price)}
                        </p>
                      </div>
                      <Link
                        href={`/products/${p.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
