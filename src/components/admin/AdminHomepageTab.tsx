import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Save,
  Check,
  Plus,
  Trash2,
  Edit2,
  Tag,
  Flame,
  Award,
  Upload,
  Eye,
} from 'lucide-react';
import { HeroBannerConfig, PromoBanner } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminHomepageTab: React.FC = () => {
  const {
    heroConfig,
    updateHeroConfig,
    promoBanners,
    addPromoBanner,
    updatePromoBanner,
    deletePromoBanner,
    products,
    toggleFeaturedProduct,
    toggleBestSeller,
    toggleNewArrival,
    toggleDeal,
  } = useStore();

  const [heroForm, setHeroForm] = useState<HeroBannerConfig>(heroConfig);
  const [heroSaved, setHeroSaved] = useState(false);

  // New / Editing Promo Banner Form
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [bannerFormData, setBannerFormData] = useState<Partial<PromoBanner>>({
    title: '',
    subtitle: '',
    badge: 'Special Offer',
    code: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Shop Now',
    buttonLink: 'shop',
    active: true,
  });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroConfig(heroForm);
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2000);
  };

  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerFormData({
      title: '',
      subtitle: '',
      badge: 'Special Offer',
      code: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      buttonText: 'Shop Deals',
      buttonLink: 'deals',
      active: true,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: PromoBanner) => {
    setEditingBanner(b);
    setBannerFormData(b);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerFormData.title?.trim()) {
      alert('Please provide banner title.');
      return;
    }

    if (editingBanner) {
      updatePromoBanner(editingBanner.id, bannerFormData);
    } else {
      addPromoBanner(bannerFormData as Omit<PromoBanner, 'id'>);
    }
    setIsBannerModalOpen(false);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Hero Section Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Store Front Hero
              </span>
              <h2 className="text-xl font-black text-stone-900 font-heading">
                Hero Banner Customization
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Customize the main homepage headline, slogans, badge text, and call-to-action buttons.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveHero}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
          >
            {heroSaved ? (
              <>
                <Check className="w-4 h-4 text-amber-300" />
                <span>Saved to Storefront!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Hero Settings</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSaveHero} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Main Brand Name Heading
              </label>
              <input
                type="text"
                value={heroForm.heading}
                onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                placeholder="e.g. junejo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Highlighted Word (Emerald Color)
              </label>
              <input
                type="text"
                value={heroForm.highlightWord}
                onChange={(e) => setHeroForm({ ...heroForm, highlightWord: e.target.value })}
                placeholder="e.g. SUPERSTORE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-emerald-700 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={heroForm.badgeText}
              onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
              placeholder="e.g. Hyderabad's Trusted Online Supermarket • Wholesale Rates"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Tagline Subheading
            </label>
            <input
              type="text"
              value={heroForm.subheading}
              onChange={(e) => setHeroForm({ ...heroForm, subheading: e.target.value })}
              placeholder="e.g. “Everything You Need for Your Home, All in One Place.”"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Detailed Description Text
            </label>
            <textarea
              rows={2}
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={heroForm.buttonText}
                onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                placeholder="e.g. Order Monthly Rashan"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={heroForm.secondaryButtonText}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                placeholder="e.g. Build Custom Rashan"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>
          </div>
        </form>
      </div>

      {/* 2. Promotional Banners Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Deals &amp; Offers
              </span>
              <h2 className="text-xl font-black text-stone-900 font-heading">
                Promotional Display Banners
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Add custom promotional graphics, promo discount codes, and special campaigns shown on the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddBanner}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Add Promo Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoBanners.map((banner) => (
            <div
              key={banner.id}
              className={`relative rounded-2xl border p-5 overflow-hidden flex flex-col justify-between space-y-4 ${
                banner.active ? 'bg-stone-900 text-white border-stone-800' : 'bg-stone-100 text-stone-600 border-stone-300 opacity-60'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-400 text-stone-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-md">
                    {banner.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updatePromoBanner(banner.id, { active: !banner.active })}
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        banner.active ? 'bg-emerald-500 text-white' : 'bg-stone-300 text-stone-700'
                      }`}
                    >
                      {banner.active ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditBanner(banner)}
                      className="p-1 text-stone-300 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePromoBanner(banner.id)}
                      className="p-1 text-stone-300 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black font-heading line-clamp-1">{banner.title}</h3>
                <p className="text-xs text-stone-300 line-clamp-2">{banner.subtitle}</p>
                {banner.code && (
                  <div className="text-xs text-amber-300 font-mono font-bold">
                    Promo Code: {banner.code}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-700/50 text-xs">
                <span className="text-[11px] text-stone-400">Action: {banner.buttonText}</span>
                <span className="text-[11px] font-mono text-emerald-400">Link: {banner.buttonLink}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Merchandising Curations Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-xl font-black text-stone-900 font-heading">
          Curated Product Merchandising Overview
        </h2>
        <p className="text-xs text-stone-500">
          Products currently featured across homepage carousels and highlight sections:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1">
            <Award className="w-5 h-5 text-amber-600 mx-auto" />
            <div className="text-lg font-black text-amber-950 font-heading">
              {products.filter((p) => p.featured).length}
            </div>
            <div className="text-xs font-bold text-amber-800">Featured Items</div>
          </div>

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-center space-y-1">
            <Flame className="w-5 h-5 text-orange-600 mx-auto" />
            <div className="text-lg font-black text-orange-950 font-heading">
              {products.filter((p) => p.isBestSeller).length}
            </div>
            <div className="text-xs font-bold text-orange-800">Best Sellers</div>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-1">
            <Tag className="w-5 h-5 text-rose-600 mx-auto" />
            <div className="text-lg font-black text-rose-950 font-heading">
              {products.filter((p) => p.isDeal || (p.discountPercentage || 0) > 0).length}
            </div>
            <div className="text-xs font-bold text-rose-800">Discount Deals</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
            <Sparkles className="w-5 h-5 text-emerald-600 mx-auto" />
            <div className="text-lg font-black text-emerald-950 font-heading">
              {products.filter((p) => p.isNewArrival).length}
            </div>
            <div className="text-xs font-bold text-emerald-800">New Arrivals</div>
          </div>
        </div>
      </div>

      {/* Promo Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900 font-heading">
                {editingBanner ? 'Edit Promo Banner' : 'Create Promo Banner'}
              </h3>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="text-stone-500 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerFormData.title || ''}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                  placeholder="e.g. Monthly Rashan Packages"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Slogan</label>
                <input
                  type="text"
                  value={bannerFormData.subtitle || ''}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                  placeholder="e.g. Save up to 15% on wholesale grocery bundles in Hyderabad"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Badge Ribbon</label>
                  <input
                    type="text"
                    value={bannerFormData.badge || ''}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, badge: e.target.value })}
                    placeholder="e.g. Best Value"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={bannerFormData.code || ''}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, code: e.target.value })}
                    placeholder="e.g. RASHAN500"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Background Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={bannerFormData.image || ''}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, image: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                  <label className="p-2 border border-stone-300 rounded-xl cursor-pointer hover:bg-stone-100 text-xs font-bold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleBannerFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={bannerFormData.buttonText || ''}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, buttonText: e.target.value })}
                    placeholder="e.g. Explore Packages"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Destination Link</label>
                  <select
                    value={bannerFormData.buttonLink || 'shop'}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, buttonLink: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="shop">Shop All Products</option>
                    <option value="rashan">Monthly Rashan Packages</option>
                    <option value="rashan-builder">Custom Rashan Builder</option>
                    <option value="deals">Deals &amp; Offers</option>
                    <option value="categories">Categories</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
