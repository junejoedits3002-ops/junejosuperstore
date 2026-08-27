import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  MessageCircle,
  Package,
  Sparkles,
  Truck,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    couponDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings,
    setActiveView,
    generateWhatsAppOrderUrl,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ isError: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ isError: false, text: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ isError: true, text: res.message });
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
  };

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Progress for free delivery
  const freeDeliveryThreshold = storeSettings.freeDeliveryThreshold;
  const progressToFreeDelivery = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white/90 backdrop-blur-xl border-l border-white/60 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200/70 flex items-center justify-between bg-stone-50/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs border border-emerald-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-stone-900 font-heading">
                  Your Grocery Cart
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {cart.reduce((a, b) => a + b.quantity, 0)} items in basket
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 font-semibold transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                id="btn-close-cart-drawer"
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200/60 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div id="cart-free-delivery-banner" className="bg-emerald-50/95 backdrop-blur-xs px-4 py-3 border-b border-emerald-200/80 text-xs">
              {cartSubtotal >= freeDeliveryThreshold ? (
                <div className="flex items-center justify-between text-emerald-900 font-extrabold bg-emerald-100/90 border border-emerald-300/80 px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎉</span>
                    <span>You unlocked FREE DELIVERY!</span>
                  </div>
                  <span className="bg-emerald-700 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                    FREE 🚚
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-stone-800 font-bold text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-900">
                      <span>Add <strong className="text-emerald-700 font-extrabold text-sm">Rs. {remainingForFreeDelivery.toLocaleString()}</strong> more to get FREE DELIVERY 🚚</span>
                    </span>
                    <span className="font-extrabold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md text-[11px]">
                      {progressToFreeDelivery}%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressToFreeDelivery}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium pt-0.5">
                    <span>Current: Rs. {cartSubtotal.toLocaleString()}</span>
                    <span>Free at: Rs. {freeDeliveryThreshold.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-stone-100/80 border border-stone-200/60 text-stone-300 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-800">Your basket is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Explore our Pakistani supermarket catalog or select a Monthly Rashan package.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('shop');
                    }}
                    className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800"
                  >
                    Start Shopping
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('rashan');
                    }}
                    className="w-full py-2.5 bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold hover:bg-amber-200"
                  >
                    View Monthly Rashan Packages
                  </button>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-stone-200/80 flex gap-3 items-center justify-between shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl bg-white border border-stone-200/70 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      {item.type !== 'product' && (
                        <span className="text-[10px] bg-amber-400 text-stone-900 font-extrabold px-1.5 py-0.2 rounded uppercase">
                          Package
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.name}
                      </h4>
                    </div>
                    {item.weight && (
                      <p className="text-[11px] text-stone-500">{item.weight}</p>
                    )}
                    <p className="text-xs font-black text-emerald-800 mt-0.5">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-stone-400 font-normal ml-1">
                          (Rs. {item.price.toLocaleString()} each)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50/90 overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-1.5 py-1 hover:bg-stone-200/70 text-stone-700"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-1.5 py-1 hover:bg-stone-200/70 text-stone-700"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50/90 backdrop-blur-md border-t border-stone-200/80 space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="bg-emerald-100/80 backdrop-blur-xs border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-800" />
                      <span className="font-bold text-emerald-900">{appliedCoupon.code} applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Discount Code (e.g. WELCOME10)"
                        className="flex-1 px-3 py-1.5 bg-white/90 border border-stone-300/80 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponFeedback && (
                      <p className={`text-[11px] font-medium ${couponFeedback.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {couponFeedback.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown Calculation */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-stone-900">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-bold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-Rs. {couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-black text-stone-900 border-t border-stone-200 pt-2">
                  <span>Total Amount:</span>
                  <span className="text-emerald-800">Rs. {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  id="btn-proceed-to-checkout"
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-order-cart-on-whatsapp"
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 bg-emerald-50/80 backdrop-blur-xs hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order Entire Cart on WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
