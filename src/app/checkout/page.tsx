'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPKR, isValidPakistaniPhone } from '@/lib/format';
import { PAKISTAN_PROVINCES, POPULAR_CITIES } from '@/lib/constants';
import { ShieldCheck, Truck, Lock, ArrowRight, CreditCard, Building2, Banknote, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, appliedCoupon, discountAmount, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingProvince: 'Punjab',
    shippingCity: 'Lahore',
    shippingArea: '',
    shippingAddress: '',
    shippingPostalCode: '',
    deliveryNotes: '',
    paymentMethod: 'CASH_ON_DELIVERY',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-white">Your Cart is Empty</h1>
        <p className="text-xs text-slate-400">Add products to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!formData.customerName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.customerEmail.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.customerPhone.trim() || !isValidPakistaniPhone(formData.customerPhone)) {
      setErrorMessage('Please provide a valid Pakistani phone number (e.g. 03001234567 or +923001234567).');
      return;
    }
    if (!formData.shippingArea.trim()) {
      setErrorMessage('Please specify your Area / Town / Sector.');
      return;
    }
    if (!formData.shippingAddress.trim()) {
      setErrorMessage('Please enter your complete street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        couponCode: appliedCoupon?.code,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to place order. Please review your cart.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/orders/${data.orderNumber}`);
    } catch {
      setErrorMessage('A network error occurred while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Checkout &amp; Delivery</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete your delivery details for fast insured shipping across Pakistan
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery and Payment Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer & Delivery Form */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <Truck className="w-4 h-4 text-cyan-400" />
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Tariq Mehmood"
                  required
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="name@example.pk"
                  required
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">
                  Pakistani Mobile Number * <span className="text-slate-400 text-[10px]">(For Courier Delivery SMS/Call)</span>
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="03001234567 or +923001234567"
                  required
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Province *</label>
                <select
                  name="shippingProvince"
                  value={formData.shippingProvince}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                >
                  {PAKISTAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">City *</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  list="city-suggestions"
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  required
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
                <datalist id="city-suggestions">
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">
                  Town / Area / Sector *
                </label>
                <input
                  type="text"
                  name="shippingArea"
                  value={formData.shippingArea}
                  onChange={handleChange}
                  placeholder="e.g. DHA Phase 5 / Gulberg III / F-7/2"
                  required
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Complete Street Address *</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House / Apartment number, Street name, Landmark"
                  required
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Postal Code (Optional)</label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  value={formData.shippingPostalCode}
                  onChange={handleChange}
                  placeholder="e.g. 54000"
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                  placeholder="e.g. Ring doorbell twice"
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <Lock className="w-4 h-4 text-emerald-400" />
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-white/10 bg-slate-800/30 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Cash on Delivery (COD)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-semibold">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pay in cash upon doorstep delivery by TCS / Leopard courier. Available throughout Pakistan.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_TRANSFER'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-white/10 bg-slate-800/30 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Direct Corporate Bank Transfer</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Transfer directly from your banking app (HBL, Meezan, Alfalah, Raast) to our official corporate account. Bank account details provided upon confirmation.
                  </p>
                </div>
              </label>

              {/* Online Card */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'ONLINE_CARD'
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-white/10 bg-slate-800/30 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE_CARD"
                  checked={formData.paymentMethod === 'ONLINE_CARD'}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Visa / MasterCard Debit or Credit</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instant 3D-Secure payment via card. Verified instantly.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Order Items ({items.length})
            </h2>

            {/* List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-white/5"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                    {item.variantName && (
                      <p className="text-[10px] text-cyan-400">{item.variantName}</p>
                    )}
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-400">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">{formatPKR(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Nationwide Express Courier</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between text-base">
                <span className="font-bold text-white">Final Total</span>
                <span className="font-black text-blue-400">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order • {formatPKR(totalAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 space-y-1 text-center pt-2">
              <p className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Sealed Hardware Guarantee
              </p>
              <p>You will receive an instant order number and live shipment tracking.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
