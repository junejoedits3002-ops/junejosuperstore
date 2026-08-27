import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  MessageCircle,
  CheckCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { RashanPackage } from '../types';
import { useStore } from '../context/StoreContext';

interface MonthlyRashanSectionProps {
  isDedicatedPage?: boolean;
}

export const MonthlyRashanSection: React.FC<MonthlyRashanSectionProps> = ({ isDedicatedPage = false }) => {
  const {
    rashanPackages,
    addPackageToCart,
    setActiveView,
    setIsCartOpen,
    generateWhatsAppOrderUrl,
  } = useStore();

  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    rashanPackages.find((p) => p.isPopular)?.id || rashanPackages[0]?.id || null
  );

  const activePackages = rashanPackages.filter((p) => p.active);

  const handleAddPackage = (pkg: RashanPackage) => {
    addPackageToCart(pkg);
    setIsCartOpen(true);
  };

  const handleBuyPackageNow = (pkg: RashanPackage) => {
    addPackageToCart(pkg);
    setActiveView('checkout');
  };

  const handleWhatsAppPackage = (pkg: RashanPackage) => {
    const item = {
      cartItemId: `pkg-${pkg.id}`,
      type: 'rashan_package' as const,
      name: pkg.name,
      price: pkg.price,
      quantity: 1,
      image: pkg.image,
      packageItems: pkg.items,
    };
    const url = generateWhatsAppOrderUrl({
      items: [item],
      total: pkg.price,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={`bg-stone-100/40 backdrop-blur-xs border-b border-stone-200/70 ${isDedicatedPage ? 'py-12' : 'py-16'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xs border border-emerald-300/80 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pakistan’s #1 Grocery Solution</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-heading">
            MONTHLY RASHAN PACKAGES
          </h2>

          <p className="text-base sm:text-lg text-stone-600 font-medium">
            &ldquo;Get your essential monthly groceries in one convenient package.&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto">
            Zero hassle of supermarket queues or making handwritten grocery lists. Handpicked premium staples delivered in heavy-duty packaging with wholesale savings.
          </p>

          {/* Builder Callout Banner */}
          <div className="pt-2">
            <button
              id="btn-goto-custom-rashan-builder"
              type="button"
              onClick={() => setActiveView('rashan-builder')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400/95 hover:bg-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all hover:scale-105 border border-amber-300"
            >
              <Layers className="w-4 h-4" />
              <span>Want to customize items? Open Monthly Rashan Builder →</span>
            </button>
          </div>
        </div>

        {/* 3 Main Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {activePackages.map((pkg) => {
            const isExpanded = expandedPackageId === pkg.id;
            const savings = pkg.originalPrice - pkg.price;

            return (
              <div
                key={pkg.id}
                id={`card-package-${pkg.id}`}
                className={`relative bg-white/80 backdrop-blur-md rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl ${
                  pkg.isPopular
                    ? 'border-emerald-600 ring-4 ring-emerald-500/15 shadow-emerald-900/10'
                    : 'border-stone-200/80 hover:border-emerald-400'
                }`}
              >
                {/* Popular Tag */}
                {pkg.isPopular && (
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 text-center shadow-xs">
                    ★ Most Popular Choice for Pakistani Families ★
                  </div>
                )}

                {/* Package Header with Image */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-100/90 border border-stone-200/60 shadow-xs">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex flex-col justify-end p-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-xl backdrop-blur-xs border border-white/20">
                          <Users className="w-3.5 h-3.5" />
                          <span>{pkg.familySize}</span>
                        </span>
                        <span className="bg-amber-400 text-stone-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                          Save Rs. {savings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-heading">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                      {pkg.nameUrdu}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="bg-stone-50/90 backdrop-blur-xs border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[11px] text-stone-400 font-semibold block uppercase tracking-wider">
                        Package Price (PKR)
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-stone-900">
                          Rs. {pkg.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          Rs. {pkg.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-200/70">
                      {pkg.discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Included Items Accordion Trigger */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-stone-700 bg-stone-100/90 hover:bg-stone-200/80 px-3 py-2 rounded-xl transition-colors border border-stone-200/60"
                    >
                      <span className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Included Items ({pkg.items.length} staples)</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Items List */}
                    {isExpanded && (
                      <div className="mt-3 bg-stone-50/90 backdrop-blur-xs rounded-2xl p-3 border border-stone-200/70 max-h-60 overflow-y-auto divide-y divide-stone-100 text-xs space-y-1">
                        {pkg.items.map((item, idx) => (
                          <div key={item.id || idx} className="py-1.5 flex items-center justify-between text-stone-700">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-medium">{item.productName}</span>
                            </div>
                            <span className="font-bold text-stone-900 bg-white/90 px-2 py-0.5 rounded-lg border border-stone-200 shrink-0 text-[11px]">
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="p-5 sm:p-6 pt-0 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-add-package-cart-${pkg.id}`}
                      type="button"
                      onClick={() => handleAddPackage(pkg)}
                      className="w-full py-3 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-800/20 active:scale-95 border border-emerald-600/40"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      id={`btn-buy-package-now-${pkg.id}`}
                      type="button"
                      onClick={() => handleBuyPackageNow(pkg)}
                      className="w-full py-3 px-3 bg-stone-900/95 hover:bg-black text-amber-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-stone-800 shadow-xs"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Buy Rashan</span>
                    </button>
                  </div>

                  {/* WhatsApp Order */}
                  <button
                    id={`btn-whatsapp-package-${pkg.id}`}
                    type="button"
                    onClick={() => handleWhatsAppPackage(pkg)}
                    className="w-full py-2.5 px-3 bg-emerald-50/80 backdrop-blur-xs hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Order this Package on WhatsApp</span>
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-emerald-600" />
                      <span>Free Delivery</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Cash on Delivery</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
