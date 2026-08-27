import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Settings,
  Store,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category, RashanPackage } from '../types';

import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminCategoriesTab } from './admin/AdminCategoriesTab';
import { AdminRashanTab } from './admin/AdminRashanTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminCustomersTab } from './admin/AdminCustomersTab';
import { AdminHomepageTab } from './admin/AdminHomepageTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';

import { ProductFormModal } from './admin/ProductFormModal';
import { CategoryFormModal } from './admin/CategoryFormModal';
import { RashanFormModal } from './admin/RashanFormModal';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'rashan'
  | 'orders'
  | 'customers'
  | 'homepage'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    rashanPackages,
    orders,
    customers,
    storeSettings,
    addProduct,
    updateProduct,
    addCategory,
    updateCategory,
    addRashanPackage,
    updateRashanPackage,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Rashan Package Modal State
  const [isRashanModalOpen, setIsRashanModalOpen] = useState(false);
  const [editingRashanPackage, setEditingRashanPackage] = useState<RashanPackage | null>(null);

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (prodData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, prodData);
    } else {
      addProduct(prodData as Omit<Product, 'id'>);
    }
  };

  // Handlers for Categories
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (catData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, catData);
    } else {
      addCategory(catData as Omit<Category, 'id'>);
    }
  };

  // Handlers for Rashan Packages
  const handleOpenAddRashan = () => {
    setEditingRashanPackage(null);
    setIsRashanModalOpen(true);
  };

  const handleOpenEditRashan = (pkg: RashanPackage) => {
    setEditingRashanPackage(pkg);
    setIsRashanModalOpen(true);
  };

  const handleSaveRashan = (pkgData: Partial<RashanPackage>) => {
    if (editingRashanPackage) {
      updateRashanPackage(editingRashanPackage.id, pkgData);
    } else {
      addRashanPackage(pkgData as Omit<RashanPackage, 'id'>);
    }
  };

  const navTabs: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products Catalog', icon: Package, count: products.length },
    { id: 'categories', label: 'Aisles & Categories', icon: Layers, count: categories.length },
    { id: 'rashan', label: 'Monthly Rashan', icon: Sparkles, count: rashanPackages.length },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: orders.length },
    { id: 'customers', label: 'Customer Directory', icon: Users, count: customers.length },
    { id: 'homepage', label: 'Homepage & Banners', icon: ImageIcon },
    { id: 'settings', label: 'Delivery & Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-950 text-amber-400 font-black flex items-center justify-center text-xl shadow-xs">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-stone-900 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase">
                  MASTER STORE MANAGER
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Live in Hyderabad
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                {storeSettings.storeName} Management Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>➕ Add Product</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-stone-200"
            >
              <Store className="w-4 h-4 text-stone-600" />
              <span>View Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-stone-900 text-amber-400 shadow-md ring-2 ring-stone-900'
                    : 'bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'overview' && (
          <AdminOverviewTab
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddProduct={handleOpenAddProduct}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsTab
            onOpenAddProduct={handleOpenAddProduct}
            onOpenEditProduct={handleOpenEditProduct}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesTab
            onOpenAddCategory={handleOpenAddCategory}
            onOpenEditCategory={handleOpenEditCategory}
          />
        )}

        {activeTab === 'rashan' && (
          <AdminRashanTab
            onOpenAddPackage={handleOpenAddRashan}
            onOpenEditPackage={handleOpenEditRashan}
          />
        )}

        {activeTab === 'orders' && <AdminOrdersTab />}

        {activeTab === 'customers' && <AdminCustomersTab />}

        {activeTab === 'homepage' && <AdminHomepageTab />}

        {activeTab === 'settings' && <AdminSettingsTab />}

        {/* Global Modals for Admin Management */}
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
          categories={categories}
        />

        <CategoryFormModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleSaveCategory}
          editingCategory={editingCategory}
        />

        <RashanFormModal
          isOpen={isRashanModalOpen}
          onClose={() => setIsRashanModalOpen(false)}
          onSave={handleSaveRashan}
          editingPackage={editingRashanPackage}
          availableProducts={products}
        />

      </div>
    </div>
  );
};
