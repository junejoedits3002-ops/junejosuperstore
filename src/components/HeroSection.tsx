import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Percent,
  Clock,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { setActiveView, setActiveCategory, storeSettings, heroConfig } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-950 to-stone-900 text-white pt-6 pb-14 sm:pt-8 sm:pb-20">
      {/* Subtle background glow & texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* PROMINENT STORE INFORMATION BANNER */}
        <div
          id="hero-delivery-information-banner"
          className="relative bg-gradient-to-r from-emerald-800/90 via-teal-800/90 to-emerald-900/90 backdrop-blur-xl border border-emerald-400/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-emerald-950/40"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-400/20 border border-amber-300">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    🚚 FREE DELIVERY ON ORDERS RS. {storeSettings.freeDeliveryThreshold.toLocaleString()}+
                  </span>
                  <span className="bg-amber-400/95 text-stone-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    Special Offer
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-200">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="tracking-wide">📍 DELIVERY AVAILABLE IN HYDERABAD ONLY</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setActiveView('shop');
                }}
                className="px-4 py-2 bg-white/95 hover:bg-white text-emerald-950 rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105 border border-white/80"
              >
                Order in Hyderabad →
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <span>{heroConfig.badgeText || "Hyderabad's Trusted Online Supermarket • Wholesale Rates"}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-none">
                {heroConfig.heading || 'JUNEO'} <span className="text-emerald-400">{heroConfig.highlightWord || 'SUPERSTORE'}</span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-stone-200 leading-snug">
                {heroConfig.subheading || '“Everything You Need for Your Home, All in One Place.”'}
              </p>
            </div>

            {/* Sub-description */}
            <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroConfig.description || 'Order fresh flour, premium basmati rice, Dalda cooking oil, pure lentils, dairy, and full household supplies. Delivering across all areas in Hyderabad, Sindh with wholesale savings and specialized Monthly Rashan packages right to your doorstep.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                id="btn-hero-shop-now"
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setActiveView('shop');
                }}
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingBag className="w-5 h-5 text-stone-950" />
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>

              <button
                id="btn-hero-build-rashan"
                type="button"
                onClick={() => setActiveView((heroConfig.buttonLink as any) || 'rashan')}
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-stone-950" />
                <span>{heroConfig.buttonText || 'Order Monthly Rashan'}</span>
              </button>

              <button
                id="btn-hero-view-packages"
                type="button"
                onClick={() => setActiveView((heroConfig.secondaryButtonLink as any) || 'rashan-builder')}
                className="w-full sm:w-auto px-5 py-3.5 bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-xl font-semibold text-sm transition-all"
              >
                <span>{heroConfig.secondaryButtonText || 'Build Custom Rashan'}</span>
              </button>
            </div>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-left">
              <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Brands</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash on Delivery &amp; EasyPaisa</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hyderabad Same-Day Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature Box */}
          <div className="lg:col-span-5 relative">
            {/* Main Feature Card */}
            <div className="relative bg-stone-900/70 border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between border-b border-stone-700/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Monthly Rashan Special
                  </span>
                </div>
                <span className="text-xs font-extrabold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full shadow-xs">
                  SAVE UP TO 10%
                </span>
              </div>

              {/* Visual Grid of Grocery Staples */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="relative rounded-2xl overflow-hidden group bg-stone-900/80 border border-white/10 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
                    alt="Chakki Atta"
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex flex-col justify-end p-2">
                    <span className="text-xs font-bold text-white leading-tight">Whole Wheat Atta</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">10kg • Rs. 1,450</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden group bg-stone-900/80 border border-white/10 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
                    alt="Basmati Rice"
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex flex-col justify-end p-2">
                    <span className="text-xs font-bold text-white leading-tight">Super Kernel Rice</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">5kg • Rs. 1,850</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden group bg-stone-900/80 border border-white/10 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
                    alt="Cooking Oil"
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex flex-col justify-end p-2">
                    <span className="text-xs font-bold text-white leading-tight">Dalda Cooking Oil</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">5 Litre • Rs. 2,650</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden group bg-stone-900/80 border border-white/10 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80"
                    alt="Tapal Tea"
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex flex-col justify-end p-2">
                    <span className="text-xs font-bold text-white leading-tight">Danedar Chai</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">900g • Rs. 1,580</span>
                  </div>
                </div>
              </div>

              {/* Package Quick Card CTA */}
              <div className="bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-xs font-bold text-emerald-200">Family Rashan (5-7 Persons)</p>
                  <p className="text-[11px] text-stone-300">17 Core Items • Atta, Rice, Oil, Daal, Tea</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('rashan')}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-black transition-colors shadow-sm"
                >
                  Rs. 16,500
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 bg-stone-800/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Free Home Delivery</p>
              <p className="text-[10px] text-stone-300">On all orders above Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Hyderabad Only</p>
              <p className="text-[10px] text-stone-300">Fast delivery across all areas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Wholesale Grocery Rates</p>
              <p className="text-[10px] text-stone-300">Directly from verified distributors</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Instant WhatsApp Order</p>
              <p className="text-[10px] text-stone-300">1-click order confirmation</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
