'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import { ShoppingBag, Zap, Check, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

interface VariantItem {
  id: string;
  name: string;
  sku: string;
  priceAdjustment: number;
  stock: number;
}

interface ProductPurchaseBoxProps {
  product: {
    id: string;
    title: string;
    sku: string;
    basePrice: number;
    salePrice: number | null;
    stock: number;
    warrantyMonths: number;
    images: { url: string }[];
    variants: VariantItem[];
  };
}

export default function ProductPurchaseBox({ product }: ProductPurchaseBoxProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

  const basePrice = product.salePrice ?? product.basePrice;
  const currentPrice = basePrice + (selectedVariant ? selectedVariant.priceAdjustment : 0);
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  const handleAddToCart = () => {
    if (currentStock <= 0) return;

    addToCart(
      {
        productId: product.id,
        variantId: selectedVariantId,
        title: product.title,
        variantName: selectedVariant?.name,
        sku: currentSku,
        price: currentPrice,
        image: product.images[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
        maxStock: currentStock,
      },
      quantity
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
      {/* Price Block */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-blue-400">
            {formatPKR(currentPrice)}
          </span>
          {product.salePrice && product.salePrice < product.basePrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPKR(product.basePrice)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          All taxes included. Free shipping on orders over Rs. 50,000.
        </p>
      </div>

      {/* Variant Selector */}
      {product.variants.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Configuration / Color:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/10 text-white'
                      : 'border-white/10 bg-slate-800/40 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <p className="text-xs font-bold">{v.name}</p>
                  <p className="text-[11px] text-cyan-400 mt-0.5">
                    {v.priceAdjustment > 0
                      ? `+${formatPKR(v.priceAdjustment)}`
                      : v.priceAdjustment < 0
                      ? `-${formatPKR(Math.abs(v.priceAdjustment))}`
                      : 'Included'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock & SKU Info */}
      <div className="flex items-center justify-between text-xs py-2 border-y border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Stock Status:</span>
          {currentStock > 0 ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> In Stock ({currentStock} available)
            </span>
          ) : (
            <span className="text-rose-400 font-bold">Out of Stock</span>
          )}
        </div>
        <div className="text-slate-400">
          SKU: <span className="font-mono text-slate-200">{currentSku}</span>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-800/60">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-slate-100">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
              disabled={quantity >= currentStock}
              className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {addedAnimation ? 'Added to Cart ✓' : 'Add to Cart'}
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={currentStock <= 0}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-30 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          Buy Now with 1-Click
        </button>
      </div>

      {/* Highlights */}
      <div className="space-y-2 pt-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{product.warrantyMonths} Months Official Pakistan Distributor Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Delivered in 24-48 Hours across major cities (TCS / Leopard)</span>
        </div>
      </div>
    </div>
  );
}
