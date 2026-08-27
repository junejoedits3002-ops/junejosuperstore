import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Percent,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const FeaturedDealsSection: React.FC = () => {
  const { products, promoBanners, setActiveView } = useStore();
  const [filterType, setFilterType] = useState<'featured' | 'bestsellers' | 'deals' | 'new'>('featured');

  const displayedProducts = products
    .filter((p) => {
      // Don't show draft items to customers
      if (p.status === 'Draft') return false;
      if (filterType === 'featured') return p.featured || p.isBestSeller;
      if (filterType === 'bestsellers') return p.isBestSeller;
      if (filterType === 'deals') return p.isDeal || (p.discountPercentage || 0) > 0;
      if (filterType === 'new') return p.isNewArrival;
      return true;
    })
    .slice(0, 8);

  const activeBanners = promoBanners.filter((b) => b.active);

  return (
    <section className="py-14 bg-white/40 backdrop-blur-xs border-b border-stone-200/60 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PROMOTIONAL BANNERS MANAGED BY ADMIN */}
        {activeBanners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {activeBanners.map((banner) => (
              <div
                key={banner.id}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl border border-emerald-700/50 min-h-[220px] group"
              >
                {banner.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-2 max-w-md">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>{banner.badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
                    {banner.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  {banner.code && (
                    <div className="pt-1 inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-stone-900/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      <span>Use Code:</span>
                      <strong className="text-amber-400 uppercase tracking-widest">{banner.code}</strong>
                    </div>
                  )}
                </div>

                <div className="relative z-10 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveView(banner.buttonLink || 'shop')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-950 hover:bg-amber-400 rounded-xl text-xs font-black transition-all shadow-md hover:scale-105"
                  >
                    <span>{banner.buttonText || 'Shop Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 backdrop-blur-xs border border-emerald-200/70 px-3 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Supermarket Curations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-heading">
              Featured Grocery Essentials
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Handpicked everyday grocery staples and monthly packages for Hyderabad homes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/80 self-start md:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterType('featured')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'featured'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('bestsellers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'bestsellers'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('deals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'deals'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-amber-300" />
              <span>Discount Deals</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('new')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'new'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Arrivals</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-stone-300 text-center space-y-2">
            <p className="text-sm font-bold text-stone-600">No products found under this section.</p>
            <button
              type="button"
              onClick={() => setActiveView('shop')}
              className="text-xs font-black text-emerald-700 hover:underline"
            >
              Browse Full Catalog →
            </button>
          </div>
        )}

        {/* Bottom CTA to View Full Shop */}
        <div className="text-center mt-10">
          <button
            id="btn-explore-all-catalog"
            type="button"
            onClick={() => setActiveView('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900/95 backdrop-blur-xs hover:bg-black text-amber-300 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg transition-all hover:scale-105 border border-stone-800/80"
          >
            <span>Explore All Supermarket Aisles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

