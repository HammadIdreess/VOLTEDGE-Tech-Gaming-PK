import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPKR } from '@/lib/format';
import {
  Zap,
  ShieldCheck,
  Truck,
  Cpu,
  Monitor,
  Mouse,
  Keyboard,
  Headphones,
  HardDrive,
  Flame,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default async function HomePage() {
  // Fetch real database records
  const [categories, featuredProducts, latestProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 8,
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 6,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-white/5 bg-gradient-to-b from-[#090e1a] via-[#070b14] to-[#080c14]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next-Gen PC Hardware &amp; Esports Peripherals</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Power Your Setup. <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Unleash Peak Performance.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover carefully selected graphics cards, processors, DDR5 memory, OLED displays, and competitive esports gear with official manufacturer warranty and express delivery across Pakistan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  Shop All Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=gaming-mice"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  Explore Gaming Gear
                </Link>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl font-extrabold text-white">100%</p>
                  <p className="text-[11px] text-slate-400">Genuine Sealed Units</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-cyan-400">24-48h</p>
                  <p className="text-[11px] text-slate-400">Express Delivery PK</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-blue-400">3-5 Yrs</p>
                  <p className="text-[11px] text-slate-400">Official Brand Warranty</p>
                </div>
              </div>
            </div>

            {/* Right Hero Product Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/30 via-white/5 to-cyan-500/20 shadow-2xl">
                <div className="rounded-[22px] bg-[#0c1322] p-6 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-blue-600/30 text-cyan-300 font-extrabold text-xs border border-blue-500/40">
                      FLAGSHIP SHOWCASE
                    </span>
                  </div>

                  <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950/70 border border-white/5 mb-5 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80"
                      alt="ASUS ROG Strix RTX 4080 Super"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                      <span>ASUS ROG</span>
                      <span>•</span>
                      <span>Graphics Cards</span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight">
                      ROG Strix GeForce RTX 4080 Super 16GB OC
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      Ada Lovelace architecture, 16GB GDDR6X, Axial-tech fans, metal exoskeleton. Built for 4K 144Hz+ gaming.
                    </p>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-2">Rs. 385,000</span>
                        <p className="text-xl font-black text-blue-400">{formatPKR(369999)}</p>
                      </div>
                      <Link
                        href="/products/asus-rog-strix-rtx-4080-super-16gb-oc"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-all flex items-center gap-1.5"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Zap className="w-4 h-4" />
              <span>Browse Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Engineered Hardware Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            Explore All 16 Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-white/5 hover:border-blue-500/40 card-hover transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-cyan-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-4 transition-all">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {cat.description || 'Premium components & accessories.'}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-blue-400 font-semibold">
                <span>{cat._count.products} Products</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hardware Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Staff Picks &amp; Best Sellers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Featured Flagship Hardware
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            View All Hardware →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const price = p.salePrice ?? p.basePrice;
            const hasSale = p.salePrice && p.salePrice < p.basePrice;
            const primaryImage = p.images[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={p.id}
                className="group rounded-2xl bg-slate-900/40 border border-white/10 hover:border-blue-500/40 p-4 flex flex-col justify-between card-hover transition-all"
              >
                <div>
                  {/* Badge & Image */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-950/60 border border-white/5 mb-4 flex items-center justify-center">
                    {hasSale && (
                      <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-rose-500/90 text-white font-extrabold text-[10px] tracking-wide shadow-md">
                        SALE
                      </span>
                    )}
                    <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-400 font-semibold text-[10px] border border-white/10">
                      {p.warrantyMonths}M Warranty
                    </span>
                    <img
                      src={primaryImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Brand & Category */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="text-cyan-400">{p.brand.name}</span>
                    <span>•</span>
                    <span>{p.category.name}</span>
                  </div>

                  {/* Product Title */}
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors mt-1.5 line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {p.shortDescription}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    {hasSale && (
                      <p className="text-[11px] text-slate-400 line-through">
                        {formatPKR(p.basePrice)}
                      </p>
                    )}
                    <p className="text-base font-extrabold text-blue-400">
                      {formatPKR(price)}
                    </p>
                  </div>
                  <Link
                    href={`/products/${p.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coupon Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 font-extrabold text-xs border border-cyan-400/20 uppercase tracking-widest">
              LIMITED TIME PROMO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Upgrade Your Battlestation with <br />
              <span className="text-cyan-400">Flat 10% Discount</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Apply coupon code <code className="px-2.5 py-1 rounded bg-black/60 font-mono text-cyan-300 font-bold border border-white/10">WELCOME10</code> at checkout on orders over Rs. 25,000. Nationwide fast delivery with full transit insurance.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                Claim Discount Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shop With VoltEdge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            The VoltEdge Guarantee
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Built for Pakistan&apos;s Enthusiasts &amp; Professionals
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            No grey market items, no refurbished parts sold as new. Every component is backed by transparent warranty and local support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">100% Genuine Sealed Stock</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We source directly from official regional distributors of ASUS, MSI, AMD, Intel, Corsair, and Logitech. You receive brand new, factory sealed boxes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Transit-Insured Fast Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every shipment is packed with anti-static packaging and heavy bubble wrap. Handled via TCS &amp; Leopard with live online tracking numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">COD &amp; Verified Bank Transfer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pay upon doorstep inspection via Cash on Delivery or transfer securely to our verified corporate bank account with instant verification.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
