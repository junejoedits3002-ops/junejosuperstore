import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  Tag,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  initialDealOnly?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialDealOnly = false }) => {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [discountOnly, setDiscountOnly] = useState<boolean>(initialDealOnly);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount' | 'newest'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory && activeCategory !== 'All' && p.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          (p.nameUrdu && p.nameUrdu.includes(q)) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Discount
      if (discountOnly && (!p.discountPercentage || p.discountPercentage <= 0)) {
        return false;
      }
      // Price
      if (p.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      // default 'popular'
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, activeCategory, searchQuery, selectedBrand, inStockOnly, discountOnly, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
    setSelectedBrand('all');
    setInStockOnly(false);
    setDiscountOnly(false);
    setMaxPrice(6000);
    setSortBy('popular');
  };

  return (
    <div className="py-8 bg-stone-50/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/70">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-heading">
              {discountOnly
                ? 'Supermarket Deals & Discounts'
                : activeCategory
                ? `${activeCategory} Aisle`
                : 'JUNEJO Grocery Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Showing <span className="font-bold text-stone-900">{filteredProducts.length}</span> authentic grocery staples &amp; household essentials
            </p>
          </div>

          {/* Quick Search & Sort on top */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-2xl px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <label htmlFor="select-sort-by" className="sr-only">Sort products by</label>
              <select
                id="select-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent border-none focus:outline-none cursor-pointer font-bold text-stone-800"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              id="btn-mobile-filter-toggle"
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="py-4 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <button
            id="chip-category-all"
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === null
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-stone-700 hover:bg-white border border-stone-200/80 shadow-2xs'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                id={`chip-category-${cat.slug}`}
                type="button"
                onClick={() => setActiveCategory(isCatActive ? null : cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCatActive
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'bg-white/80 backdrop-blur-xs text-stone-700 hover:bg-white border border-stone-200/80 shadow-2xs'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid: Filter Sidebar (Desktop) + Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          
          {/* Filter Sidebar - Desktop & Collapsible Mobile */}
          <div
            className={`md:col-span-3 bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 p-5 space-y-6 shadow-xs ${
              mobileFilterOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>Filters &amp; Refine</span>
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search inside filters */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-600">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Atta, Oil, Surf..."
                  className="w-full pl-8 pr-3 py-2 border border-stone-300/80 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white/90"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-600">
                Filter by Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 border border-stone-300/80 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">All Brands (Sunridge, Dalda, Tapal, etc.)</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Max Price:</span>
                <span className="text-emerald-800 font-extrabold">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="6000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Rs. 100</span>
                <span>Rs. 6,000+</span>
              </div>
            </div>

            {/* Checkboxes: In Stock & Deals */}
            <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-rose-600" />
                  <span>Discount Deals Only</span>
                </span>
              </label>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="md:col-span-9 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-stone-100/80 text-stone-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">No Grocery Items Found</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  We couldn&rsquo;t find any products matching your current search or filter combination.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
