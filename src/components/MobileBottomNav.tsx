import React from 'react';
import {
  Home,
  ShoppingBag,
  Package,
  RotateCcw,
  MessageCircle,
  Layers,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cart,
    setIsCartOpen,
    storeSettings,
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleWhatsAppFloating = () => {
    const url = `https://wa.me/${storeSettings.whatsappNumber}?text=Assalam%20o%20Alaikum%20junejo%20Superstore!%20I%20want%20to%20place%20a%20grocery%20order...`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating WhatsApp Action Button on Desktop & Mobile */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
        <button
          id="btn-floating-whatsapp"
          type="button"
          onClick={handleWhatsAppFloating}
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-105"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current text-white shrink-0" />
          <span className="hidden sm:inline text-xs font-black tracking-wide pr-1">
            Order on WhatsApp
          </span>
        </button>
      </div>

      {/* Mobile-Only Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-navbar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-lg border-t border-stone-200/70 px-2 py-1.5 shadow-lg"
      >
        <div className="grid grid-cols-5 items-center text-center">
          {/* Home */}
          <button
            type="button"
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeView === 'home' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          {/* Shop */}
          <button
            type="button"
            onClick={() => setActiveView('shop')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeView === 'shop' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Aisles</span>
          </button>

          {/* Monthly Rashan */}
          <button
            type="button"
            onClick={() => setActiveView('rashan')}
            className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
              activeView === 'rashan' || activeView === 'rashan-builder'
                ? 'text-emerald-800 font-bold'
                : 'text-amber-600 font-semibold hover:text-amber-700'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-bold">Rashan</span>
          </button>

          {/* Reorder */}
          <button
            type="button"
            onClick={() => setActiveView('reorder')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeView === 'reorder' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Reorder</span>
          </button>

          {/* Cart */}
          <button
            id="btn-mobile-nav-cart"
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1 relative text-stone-700 hover:text-emerald-800"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-bold">Cart</span>
          </button>
        </div>
      </nav>
    </>
  );
};
