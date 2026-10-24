'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, X } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    appliedCoupon,
    discountAmount,
    totalAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');

    const res = await applyCoupon(couponInput);
    setIsApplying(false);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white">Your Cart is Currently Empty</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Explore our collection of next-gen graphics cards, processors, displays, and esports peripherals.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Your Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1">Review your hardware items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold self-start sm:self-auto"
        >
          Clear All Items
        </button>
      </div>

      {/* Free Shipping Alert Meter */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          {freeShippingRemaining > 0 ? (
            <span className="text-slate-300">
              Add <strong className="text-cyan-400">{formatPKR(freeShippingRemaining)}</strong> more to get <strong className="text-emerald-400">FREE Express Delivery</strong> nationwide!
            </span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              You qualify for FREE Nationwide Delivery!
            </span>
          )}
          <span className="text-slate-400 font-mono text-[11px]">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId || 'base'}`}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-800 border border-white/5 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1">{item.title}</h3>
                  {item.variantName && (
                    <p className="text-[11px] text-cyan-400 mt-0.5 font-medium">
                      Config: {item.variantName}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                  <p className="text-xs font-bold text-blue-400 mt-1 sm:hidden">
                    {formatPKR(item.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {/* Price Desktop */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Unit Price</p>
                  <p className="text-xs font-bold text-slate-200">{formatPKR(item.price)}</p>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center rounded-xl border border-white/10 bg-slate-800/80">
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-100">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[90px]">
                  <p className="text-xs text-slate-400 sm:hidden">Total</p>
                  <p className="text-sm font-black text-blue-400">
                    {formatPKR(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId, item.variantId)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/products"
              className="text-xs font-semibold text-blue-400 hover:text-cyan-400 flex items-center gap-1.5"
            >
              ← Continue Shopping for Hardware
            </Link>
          </div>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5">
            <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="text-slate-200 font-semibold">{formatPKR(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon ({appliedCoupon.code})
                  </span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Estimated Nationwide Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between text-base">
                <span className="font-bold text-white">Estimated Total</span>
                <span className="font-black text-blue-400">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-white/10">
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="text-xs text-emerald-400">
                    <span className="font-bold">{appliedCoupon.code}</span> applied ({formatPKR(discountAmount)} saved)
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 uppercase bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-cyan-400 border border-white/10 transition-colors"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}
                </form>
              )}
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01]"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 text-center">
              <p>🔒 256-Bit Encrypted Secure Checkout</p>
              <p>Cash on Delivery &amp; Bank Transfer available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
