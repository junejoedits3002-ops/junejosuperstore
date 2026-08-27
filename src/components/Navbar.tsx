import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Phone,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Layers,
  Tag,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBasket,
  MapPin,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    storeSettings,
    cartCount,
    cartTotal,
    setIsCartOpen,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    categories,
    products,
    setSelectedProduct,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter search suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 5);
  }, [products, searchQuery]);

  // Click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    setActiveView('shop');
  };

  const navLinks = [
    { label: 'Home', view: 'home' as const, icon: null },
    { label: 'All Products', view: 'shop' as const, icon: null },
    { label: 'Monthly Rashan', view: 'rashan' as const, icon: Sparkles, badge: 'Popular' },
    { label: 'Rashan Builder', view: 'rashan-builder' as const, icon: Layers, badge: 'Custom' },
    { label: 'Deals & Discounts', view: 'deals' as const, icon: Tag, badge: 'Hot' },
    { label: 'Quick Reorder', view: 'reorder' as const, icon: RotateCcw },
  
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md shadow-xs border-b border-stone-200/70 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-900 text-white text-xs py-1.5 px-4 font-medium border-b border-emerald-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
              <MapPin className="w-3 h-3" />
              Hyderabad Only
            </span>
            <p className="truncate text-emerald-100 text-xs">
              {storeSettings.announcement}
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-emerald-100 text-xs shrink-0">
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Free Delivery on Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}+</span>
            </div>
            <span className="text-emerald-700">|</span>
            <a
              href={`tel:${storeSettings.phone.replace(/[^0-9+]/g, '')}`}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{storeSettings.phone.split('/')[0]}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile Menu Button */}
          <button
            id="btn-mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100/80 focus:outline-none transition-colors"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Store Logo */}
          <div
            id="nav-logo"
            onClick={() => {
              setActiveView('home');
              setActiveCategory(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform border border-emerald-400/30">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 font-heading">
                  JUNEJO
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100/70 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-emerald-300/60">
                  SUPERSTORE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-tight">
                {storeSettings.tagline}
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                id="input-global-search-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search Atta, Rice, Cooking Oil, Daal, Tea, Masala, Soaps..."
                className="w-full pl-10 pr-24 py-2.5 bg-stone-100/70 backdrop-blur-xs border border-stone-300/70 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white/95 transition-all text-stone-800 placeholder:text-stone-400 shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <button
                id="btn-search-submit-desktop"
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-stone-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider bg-stone-50/80 border-b border-stone-100">
                  Quick Product Matches
                </div>
                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setSearchFocused(false);
                      }}
                      className="p-3 hover:bg-emerald-50/70 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200/60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{product.name}</p>
                        <p className="text-xs text-stone-500">
                          {product.brand} • <span className="text-emerald-700 font-bold">Rs. {product.price.toLocaleString()}</span>
                        </p>
                      </div>
                      <span className="text-xs bg-stone-100/90 text-stone-600 px-2 py-0.5 rounded-full font-medium shrink-0 border border-stone-200/50">
                        {product.weight}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => {
                    setSearchFocused(false);
                    setActiveView('shop');
                  }}
                  className="p-2.5 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50/80 cursor-pointer border-t border-stone-100 transition-colors"
                >
                  View all results for &ldquo;{searchQuery}&rdquo; →
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* WhatsApp Quick Order button */}
            <a
              id="btn-nav-whatsapp-quick"
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalamualaikum JUNEJO SUPERSTORE! I would like to inquire about grocery delivery.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-2 bg-emerald-50/80 backdrop-blur-xs text-emerald-800 hover:bg-emerald-100/90 border border-emerald-300/80 rounded-2xl text-xs font-bold transition-colors shadow-2xs"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>WhatsApp Order</span>
            </a>

            {/* Shopping Cart Trigger */}
            <button
              id="btn-nav-cart-toggle"
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-semibold text-sm transition-all shadow-md shadow-emerald-800/20 border border-emerald-600/50 active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-xs animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[10px] text-emerald-200 font-normal">Cart ({cartCount})</span>
                <span className="text-xs font-bold tracking-tight">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              id="input-global-search-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries & Monthly Rashan..."
              className="w-full pl-9 pr-16 py-2 bg-stone-100/80 backdrop-blur-xs border border-stone-300/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-800"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <button
              id="btn-search-submit-mobile"
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Sub-Bar (Desktop) */}
      <nav className="hidden md:block bg-stone-50/70 backdrop-blur-md border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            {/* Left Category Dropdown Trigger */}
            <div className="relative group">
              <button
                id="btn-nav-categories-dropdown"
                onClick={() => setActiveView('categories')}
                className="flex items-center gap-2 text-stone-800 hover:text-emerald-700 font-bold text-xs uppercase tracking-wider py-1.5 px-3 rounded-xl hover:bg-stone-200/50 transition-colors"
              >
                <Menu className="w-4 h-4 text-emerald-700" />
                <span>Shop by Category</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Hover Dropdown */}
              <div className="hidden group-hover:block absolute top-full left-0 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setActiveView('shop');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50/80 hover:text-emerald-800 flex items-center justify-between transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-stone-400 font-normal">{cat.nameUrdu}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Nav Links */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.label}
                    id={`nav-link-${link.view}`}
                    onClick={() => {
                      if (link.view === 'shop') setActiveCategory(null);
                      setActiveView(link.view);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-200/50'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-600'}`} />}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-black tracking-wider ${
                          isActive
                            ? 'bg-amber-400 text-stone-900'
                            : 'bg-emerald-100/90 text-emerald-800 border border-emerald-300/70'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Express Delivery Badge */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium bg-white/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Same-Day Delivery across Karachi & Pakistan</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200/80 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.view === 'shop') setActiveCategory(null);
                    setActiveView(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-emerald-700 text-white' : 'text-stone-800 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300 text-stone-900 font-extrabold uppercase">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Categories list in mobile drawer */}
          <div className="pt-3 border-t border-stone-100">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setActiveView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-50/80 hover:bg-emerald-50 hover:text-emerald-800 truncate border border-stone-200/50"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Direct */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalamualaikum JUNEJO SUPERSTORE! I want to order groceries.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp: {storeSettings.whatsappNumber}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
