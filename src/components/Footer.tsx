import React from 'react';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, setActiveCategory, categories, storeSettings } = useStore();

  const handleWhatsAppContact = () => {
    const url = `https://wa.me/${storeSettings.whatsappNumber}?text=Assalam%20o%20Alaikum%20Junejo%20Superstore!%20I%20have%20an%20inquiry%20regarding%20monthly%20grocery%20delivery%20in%20Hyderabad...`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-stone-900/90 backdrop-blur-xl text-stone-300 border-t border-stone-800/80">
      
      {/* Top Value Badges Bar */}
      <div className="border-b border-stone-800/80 bg-stone-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-stone-900/50 backdrop-blur-xs p-3 rounded-2xl border border-stone-800/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white">Free Home Delivery</h4>
                <p className="text-[11px] text-stone-400">On orders above Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 bg-stone-900/50 backdrop-blur-xs p-3 rounded-2xl border border-stone-800/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white">100% Authentic Quality</h4>
                <p className="text-[11px] text-stone-400">Fresh stock from trusted Pakistani brands</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 bg-stone-900/50 backdrop-blur-xs p-3 rounded-2xl border border-stone-800/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white">WhatsApp Ordering</h4>
                <p className="text-[11px] text-stone-400">Order directly in 1-click on chat</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 bg-stone-900/50 backdrop-blur-xs p-3 rounded-2xl border border-stone-800/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white">Easy Returns &amp; Pay</h4>
                <p className="text-[11px] text-stone-400">Cash on Delivery, EasyPaisa, JazzCash</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white font-heading block">
                  JUNEJO <span className="text-amber-400">SUPERSTORE</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Pakistani Local Supermarket
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              &ldquo;Your Monthly Grocery, Sorted.&rdquo; Serving families in Hyderabad, Sindh with wholesale-rate daily staples, Atta, Ghee, Daal, Chai, cleaning essentials, and complete Monthly Rashan packages.
            </p>

            {/* Address & Hours */}
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{storeSettings.address || 'Main Autobahn Road, Latifabad, Hyderabad, Sindh'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Open 7 Days: 9:00 AM – 11:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Helpline: {storeSettings.phone}</span>
              </div>
            </div>

            <button
              id="btn-footer-whatsapp-chat"
              type="button"
              onClick={handleWhatsAppContact}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({storeSettings.whatsappNumber})</span>
            </button>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white font-heading">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveView('shop');
                  }}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Shop All Products</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('rashan')}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors text-amber-300 font-semibold"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Monthly Rashan Packages</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('rashan-builder')}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Custom Rashan Builder</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('deals')}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Supermarket Deals &amp; Discounts</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('reorder')}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Quick 1-Click Reorder</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Grocery Aisles */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white font-heading">
              Popular Aisles
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setActiveView('shop');
                    }}
                    className="hover:text-emerald-400 flex items-center gap-1 transition-colors text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Payment & City Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white font-heading">
              Payment &amp; Delivery
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p>Accepted Payment Options:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-stone-800 text-stone-200 px-2 py-1 rounded text-[11px] font-bold border border-stone-700">
                  Cash on Delivery (COD)
                </span>
                <span className="bg-stone-800 text-emerald-300 px-2 py-1 rounded text-[11px] font-bold border border-stone-700">
                  EasyPaisa
                </span>
                <span className="bg-stone-800 text-amber-300 px-2 py-1 rounded text-[11px] font-bold border border-stone-700">
                  JazzCash
                </span>
                <span className="bg-stone-800 text-blue-300 px-2 py-1 rounded text-[11px] font-bold border border-stone-700">
                  Direct Bank Transfer
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p className="font-bold text-white">📍 Delivery Available in Hyderabad Only</p>
              <p className="text-[11px] text-stone-400">
                Fast doorstep grocery delivery to Qasimabad, Latifabad, Saddar, Autobahn, Citizen Colony, Kohsar, Gulistan-e-Sajjad, Wadhu Wah, and all areas of Hyderabad, Sindh.
              </p>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} JUNEJO SUPERSTORE Hyderabad. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>📍 Serving Hyderabad, Sindh, Pakistan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
