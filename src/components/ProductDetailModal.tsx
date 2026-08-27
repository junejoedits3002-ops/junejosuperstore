import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Zap,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCartOpen,
    setActiveView,
    generateDirectProductWhatsAppUrl,
    products,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setActiveView('checkout');
  };

  const handleWhatsApp = () => {
    const url = generateDirectProductWhatsAppUrl(selectedProduct, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Find related products
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.category === selectedProduct.category || p.brand === selectedProduct.brand)
    )
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        id="product-detail-modal"
        className="relative bg-white/90 backdrop-blur-xl w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-white/60 ring-1 ring-stone-900/5 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-product-detail"
          type="button"
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-950 shadow-md flex items-center justify-center transition-colors border border-stone-200/50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Big Product Image */}
          <div className="md:col-span-6 bg-stone-100/70 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full max-h-80 object-contain rounded-2xl drop-shadow-md"
              referrerPolicy="no-referrer"
            />
            {selectedProduct.discountPercentage && selectedProduct.discountPercentage > 0 ? (
              <span className="absolute top-4 left-4 bg-rose-600/90 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs border border-white/20">
                {selectedProduct.discountPercentage}% DISCOUNT
              </span>
            ) : null}
          </div>

          {/* Right Column: Specs & Buy Actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white/50">
            <div className="space-y-3">
              {/* Brand and Weight */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                  {selectedProduct.brand}
                </span>
                <span className="bg-stone-100 text-stone-700 font-bold px-2.5 py-0.5 rounded-full">
                  {selectedProduct.weight}
                </span>
              </div>

              {/* Product Name */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-heading leading-tight">
                {selectedProduct.name}
              </h2>
              {selectedProduct.nameUrdu && (
                <p className="text-sm font-semibold text-emerald-800">
                  {selectedProduct.nameUrdu}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-stone-900">
                  Rs. {selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-sm text-stone-400 line-through">
                    Rs. {selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-stone-400 font-medium">
                  per {selectedProduct.unit}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                {selectedProduct.inStock ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>In Stock &amp; Ready for Delivery ({selectedProduct.stockCount} units available)</span>
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Currently Out of Stock</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="pt-2">
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Delivery notes */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Same-Day Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Genuine Brand</span>
                </div>
              </div>
            </div>

            {/* Actions Block */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              {/* Stepper + Add To Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount || 99, q + 1))}
                    className="px-3 py-2 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  id="btn-modal-add-to-cart"
                  type="button"
                  disabled={!selectedProduct.inStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95'
                  } disabled:opacity-50`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart (Rs. {(selectedProduct.price * quantity).toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now & WhatsApp */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-modal-buy-now"
                  type="button"
                  disabled={!selectedProduct.inStock}
                  onClick={handleBuyNow}
                  className="py-2.5 px-3 bg-stone-900 hover:bg-black text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buy Now</span>
                </button>

                <button
                  id="btn-modal-whatsapp"
                  type="button"
                  onClick={handleWhatsApp}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* You May Also Like Related Strip */}
        {relatedProducts.length > 0 && (
          <div className="bg-stone-50 border-t border-stone-200 p-5 sm:p-6">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>You May Also Like</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setSelectedProduct(rel);
                    setQuantity(1);
                  }}
                  className="bg-white p-2.5 rounded-xl border border-stone-200 hover:border-emerald-400 cursor-pointer flex items-center gap-3 transition-colors group"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 truncate group-hover:text-emerald-800">
                      {rel.name}
                    </p>
                    <p className="text-[11px] font-extrabold text-emerald-700">
                      Rs. {rel.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
