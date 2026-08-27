import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Zap,
  MessageCircle,
  Eye,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    setSelectedProduct,
    setIsCartOpen,
    setActiveView,
    generateDirectProductWhatsAppUrl,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity);
    setActiveView('checkout');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateDirectProductWhatsAppUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 hover:border-emerald-500/70 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Image Container with Badges */}
      <div className="relative w-full pt-[80%] bg-stone-100/60 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 ? (
          <div className="absolute top-3 left-3 bg-rose-600/90 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-0.5 border border-white/20">
            <span>{product.discountPercentage}% OFF</span>
          </div>
        ) : null}

        {/* Best Seller / Deal Tag */}
        {product.isBestSeller && (
          <div className="absolute top-3 right-3 bg-amber-400/95 backdrop-blur-xs text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg shadow-xs border border-white/30">
            Bestseller
          </div>
        )}

        {/* Quick View overlay button */}
        <div className="absolute inset-0 bg-stone-900/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-stone-800 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/60">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quick Details</span>
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white/40">
        <div>
          {/* Brand & Weight */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px] truncate max-w-[60%] bg-emerald-50/70 px-2 py-0.5 rounded-md border border-emerald-200/50">
              {product.brand}
            </span>
            <span className="bg-stone-100/90 backdrop-blur-xs text-stone-700 font-medium px-2 py-0.5 rounded-md text-[11px] border border-stone-200/60">
              {product.weight}
            </span>
          </div>

          {/* Title in English & Urdu */}
          <h3 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>
          {product.nameUrdu && (
            <p className="text-xs text-stone-400 font-normal line-clamp-1 mt-0.5">
              {product.nameUrdu}
            </p>
          )}

          {/* Stock status indicator */}
          <div className="mt-2 flex items-center gap-1.5">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                <span>In Stock ({product.stockCount} left)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Out of Stock</span>
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions Area */}
        <div className="space-y-3 pt-2.5 border-t border-stone-200/60">
          {/* Price Block */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-stone-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 uppercase font-bold">
              per {product.unit}
            </span>
          </div>

          {/* Quantity Selector + Action Buttons */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center border border-stone-200 rounded-xl bg-stone-50/80 backdrop-blur-xs overflow-hidden shrink-0 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 py-1.5 hover:bg-stone-200/70 text-stone-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-stone-800 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 99, q + 1))}
                  className="px-2 py-1.5 hover:bg-stone-200/70 text-stone-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add To Cart button */}
              <button
                id={`btn-add-to-cart-${product.id}`}
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  justAdded
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 active:scale-95'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Sub-row: Buy Now & WhatsApp */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id={`btn-buy-now-${product.id}`}
                type="button"
                disabled={!product.inStock}
                onClick={handleBuyNow}
                className="py-1.5 px-2 bg-stone-900/90 hover:bg-black text-amber-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50 shadow-2xs"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Buy Now</span>
              </button>

              <button
                id={`btn-whatsapp-order-${product.id}`}
                type="button"
                onClick={handleWhatsApp}
                className="py-1.5 px-2 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-300/70 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors backdrop-blur-xs"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
