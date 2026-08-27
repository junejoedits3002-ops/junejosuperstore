import React from 'react';
import {
  Wheat,
  Boxes,
  Soup,
  Droplet,
  Sparkles,
  Coffee,
  Flame,
  Cookie,
  GlassWater,
  Milk,
  Smile,
  Sparkle,
  HeartHandshake,
  Home,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const iconMap: Record<string, React.ElementType> = {
  Wheat,
  Boxes,
  Soup,
  Droplet,
  Sparkles,
  Coffee,
  Flame,
  Cookie,
  GlassWater,
  Milk,
  Smile,
  Sparkle,
  HeartHandshake,
  Home,
};

export const CategorySection: React.FC = () => {
  const { categories, setActiveCategory, setActiveView } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-white/60 backdrop-blur-md border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-6 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Fresh Supermarket Aisles
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-heading">
              Shop by Category
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Browse all 14 essential grocery departments for daily household living
            </p>
          </div>

          <button
            id="btn-view-all-categories"
            type="button"
            onClick={() => {
              setActiveCategory(null);
              setActiveView('shop');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 14 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.iconName] || Boxes;
            return (
              <div
                key={category.id}
                id={`card-category-${category.slug}`}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative bg-white/80 hover:bg-white/95 backdrop-blur-md border border-stone-200/80 hover:border-emerald-400 rounded-3xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/5 transform hover:-translate-y-1.5 flex flex-col items-center justify-between min-h-[145px] sm:min-h-[165px]"
              >
                {/* Category Thumbnail */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-2 bg-stone-100/90 border-2 border-white/80 shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Category Titles */}
                <div className="space-y-0.5 w-full">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-400 font-medium group-hover:text-emerald-600/80">
                    {category.nameUrdu}
                  </p>
                </div>

                {/* Subtle Department Icon Indicator */}
                <div className="mt-2 w-7 h-7 rounded-xl bg-stone-100/90 group-hover:bg-emerald-700 text-stone-500 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs border border-stone-200/50">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
