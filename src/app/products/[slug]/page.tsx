import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatPKR, formatDate } from '@/lib/format';
import ProductPurchaseBox from '@/components/products/ProductPurchaseBox';
import { ShieldCheck, Truck, RotateCcw, Cpu, Star, CheckCircle, ArrowRight } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { createdAt: 'asc' } },
      specifications: { orderBy: { sortOrder: 'asc' } },
      brand: true,
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      brand: true,
      category: true,
    },
  });

  // Group specs by groupName
  const groupedSpecs = product.specifications.reduce((acc, spec) => {
    const group = spec.groupName || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {} as Record<string, typeof product.specifications>);

  const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';

  const avgRating =
    product.reviews.length > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-cyan-400">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-cyan-400">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video lg:aspect-square w-full rounded-3xl overflow-hidden bg-slate-900/60 border border-white/10 flex items-center justify-center p-6">
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-contain max-h-[500px]"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border cursor-pointer flex-shrink-0 ${
                    idx === 0 ? 'border-blue-500' : 'border-white/10'
                  }`}
                >
                  <img src={img.url} alt={img.altText || product.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 text-center">
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-200">100% Genuine</p>
              <p className="text-[10px] text-slate-400">Sealed box guaranteed</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1">
              <Truck className="w-5 h-5 text-blue-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-200">Insured Courier</p>
              <p className="text-[10px] text-slate-400">TCS / Leopard Express</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1">
              <RotateCcw className="w-5 h-5 text-emerald-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-200">Official Warranty</p>
              <p className="text-[10px] text-slate-400">{product.warrantyMonths} Months local</p>
            </div>
          </div>
        </div>

        {/* Right: Product Info & Purchase Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link
                href={`/products?brand=${product.brand.slug}`}
                className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-cyan-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-500/20"
              >
                {product.brand.name}
              </Link>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{avgRating} ({product.reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.title}
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Interactive Purchase Box Component */}
          <ProductPurchaseBox product={product} />

          {/* Quick Specifications Highlights */}
          {product.specifications.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Key Technical Highlights
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specifications.slice(0, 6).map((s) => (
                  <div key={s.id} className="p-2 rounded-xl bg-slate-800/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">{s.specKey}</span>
                    <span className="font-semibold text-slate-200">{s.specValue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Technical Specifications Matrix */}
      <section className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-400">
          <Cpu className="w-4 h-4" />
          <span>Full Technical Specification Matrix</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Architectural &amp; Hardware Specifications
        </h2>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
          {Object.entries(groupedSpecs).map(([group, specs], gIdx) => (
            <div key={group} className={gIdx > 0 ? 'border-t border-white/10' : ''}>
              <div className="bg-slate-800/60 px-5 py-2.5 text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                {group}
              </div>
              <div className="divide-y divide-white/5">
                {specs.map((s) => (
                  <div key={s.id} className="grid grid-cols-1 sm:grid-cols-3 px-5 py-3 text-xs gap-2">
                    <span className="text-slate-400 font-medium">{s.specKey}</span>
                    <span className="sm:col-span-2 text-slate-200 font-semibold">{s.specValue}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews & Verification */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Customer Reviews ({product.reviews.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified purchases from tech builders and gamers across Pakistan
            </p>
          </div>
        </div>

        {product.reviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-white/5">
            <p className="text-xs text-slate-400">No reviews yet for this model. Be the first to review after ordering!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">{formatDate(r.createdAt)}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{r.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{r.comment}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Purchase • {r.user.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Related Hardware in {product.category.name}
            </h2>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs font-bold text-blue-400 hover:text-cyan-400"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rp) => (
              <div
                key={rp.id}
                className="group p-4 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-blue-500/40 card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-950/60 border border-white/5 mb-3 flex items-center justify-center">
                    <img
                      src={rp.images[0]?.url || primaryImage}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-[10px] text-cyan-400 font-bold">{rp.brand.name}</p>
                  <Link href={`/products/${rp.slug}`}>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 line-clamp-2 mt-1">
                      {rp.title}
                    </h4>
                  </Link>
                </div>
                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs font-black text-blue-400">
                    {formatPKR(rp.salePrice || rp.basePrice)}
                  </p>
                  <Link
                    href={`/products/${rp.slug}`}
                    className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-[11px] font-semibold"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
