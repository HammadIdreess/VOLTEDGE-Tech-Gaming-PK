'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import {
  Zap,
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Cpu,
  Monitor,
  Mouse,
  Keyboard,
  Headphones,
  HardDrive,
  LogOut,
  LayoutDashboard,
  Truck,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: { url: string }[];
  category: { name: string };
}

export default function Navbar() {
  const router = useRouter();
  const { totalCount, subtotal, setIsCartOpen, wishlist } = useCart();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auth state
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Fetch categories for navbar
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    // Check user auth
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (Array.isArray(data.products)) {
          setSearchResults(data.products.slice(0, 5));
          setShowSearchDropdown(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
        setIsCategoryMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d18]/95 backdrop-blur-md border-b border-white/10 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-blue-950/70 border-b border-white/5 py-1.5 px-4 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-400 font-bold border border-blue-500/30 uppercase tracking-widest text-[9px]">
              Pakistan
            </span>
            <span>⚡ FREE Express Shipping nationwide on orders over Rs. 50,000</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 hover:text-slate-200 cursor-pointer">
              <Truck className="w-3.5 h-3.5 text-blue-400" /> Track Order
            </span>
            <span className="text-white/20">|</span>
            <span className="hover:text-slate-200">Official 1-3 Yr Warranty</span>
            <span className="text-white/20">|</span>
            <span className="text-cyan-400 font-medium">PKR Store</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:to-cyan-400 transition-colors">
                VOLT<span className="text-blue-500">EDGE</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 -mt-1 font-semibold">
                Tech & Gaming PK
              </span>
            </div>
          </Link>

          {/* Categories Button */}
          <div className="relative hidden lg:block" ref={searchContainerRef}>
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-blue-500/30 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              Categories
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl glass-dropdown p-2 shadow-2xl z-50">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-white/5">
                  Browse Catalog
                </div>
                <div className="max-h-96 overflow-y-auto py-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-600/10 hover:text-cyan-400 text-xs text-slate-300 transition-colors"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-white/5 mt-1 pt-1">
                    <Link
                      href="/products"
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                placeholder="Search RTX 4080, Ryzen 7800X3D, DDR5 RAM, gaming mice..."
                className="w-full bg-slate-900/80 border border-white/10 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 transition-all outline-none"
              />
              {isSearching && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </form>

            {/* Instant Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl glass-dropdown p-2 shadow-2xl z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  Matching Products
                </div>
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <img
                      src={item.images[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80'}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-800 border border-white/5 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                      <p className="text-[10px] text-cyan-400">{item.category?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-blue-400">{formatPKR(item.salePrice || item.basePrice)}</p>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-white/5 mt-1 pt-1 px-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-1.5 text-xs text-blue-400 hover:text-cyan-400 font-semibold"
                  >
                    See all results for &quot;{searchQuery}&quot; →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                aria-label="Account menu"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400">
                  <User className="w-4 h-4" />
                </div>
                {user && (
                  <span className="text-xs font-semibold text-slate-200 hidden xl:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 shadow-2xl z-50">
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/5">
                        <p className="text-xs font-bold text-slate-100">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                          {user.role}
                        </span>
                      </div>
                      {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Orders & Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-white/5 text-xs text-slate-400">
                        Welcome to VoltEdge
                      </div>
                      <Link
                        href="/account/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-blue-400 hover:bg-white/5 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/account/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Create an Account
                      </Link>
                      <div className="border-t border-white/5 my-1" />
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-[11px] text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                      >
                        Administrator Login
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all group"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {subtotal > 0 ? formatPKR(subtotal) : 'Cart'}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-300 hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components & peripherals..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 outline-none"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#080d18] px-4 py-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-slate-300 hover:text-cyan-400"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-white/5 flex gap-2">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2 text-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold"
            >
              All Products
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2 text-center rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
