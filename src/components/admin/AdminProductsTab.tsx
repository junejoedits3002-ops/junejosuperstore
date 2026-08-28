import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Tag,
  Flame,
  Award,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AdminProductsTabProps {
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  onOpenAddProduct,
  onOpenEditProduct,
}) => {
  const {
    products,
    categories,
    deleteProduct,
    duplicateProduct,
    toggleProductStatus,
    updateProductStock,
    toggleFeaturedProduct,
    toggleBestSeller,
    toggleNewArrival,
    toggleDeal,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Active' | 'Draft' | 'Out of Stock'>('all');
  const [selectedBadge, setSelectedBadge] = useState<'all' | 'featured' | 'bestseller' | 'deal' | 'new'>('all');

  const filteredProducts = products.filter((product) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchSku = product.sku?.toLowerCase().includes(q) || false;
      if (!matchName && !matchBrand && !matchSku) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && product.status !== selectedStatus) {
      return false;
    }

    // Badge filter
    if (selectedBadge === 'featured' && !product.featured) return false;
    if (selectedBadge === 'bestseller' && !product.isBestSeller) return false;
    if (selectedBadge === 'deal' && !product.isDeal && !(product.discountPercentage && product.discountPercentage > 0)) return false;
    if (selectedBadge === 'new' && !product.isNewArrival) return false;

    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}" from your store?`);
    if (confirmed) {
      try {
        await deleteProduct(id);
        alert(`✓ "${name}" has been permanently deleted from Firestore.`);
      } catch (err: any) {
        alert(`✗ Delete failed: ${err?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              Product Inventory Catalog
            </h2>
            <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-0.5 rounded-full">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage grocery titles, prices, stock counts, discounts, and homepage feature placements.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddProduct}
          className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>➕ Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, brand, SKU..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600 bg-white"
            >
              <option value="all">All Aisles &amp; Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active (Visible)</option>
              <option value="Draft">Draft (Hidden)</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Badge Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600 bg-white"
            >
              <option value="all">All Merchandising Badges</option>
              <option value="featured">Featured Only</option>
              <option value="bestseller">Best Sellers Only</option>
              <option value="deal">Discount Deals Only</option>
              <option value="new">New Arrivals Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-black text-stone-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-3">Brand &amp; Category</th>
                <th className="py-3.5 px-3">Weight</th>
                <th className="py-3.5 px-3">Selling Price</th>
                <th className="py-3.5 px-3">Original Price</th>
                <th className="py-3.5 px-3">Discount</th>
                <th className="py-3.5 px-3">Stock Units</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-center">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-stone-500 font-medium">
                    No products found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/60 transition-colors group">
                    
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="space-y-0.5 max-w-[200px] sm:max-w-[240px]">
                          <div className="font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-800">
                            {product.name}
                          </div>
                          {product.nameUrdu && (
                            <div className="text-[11px] text-stone-400 font-normal line-clamp-1" dir="rtl">
                              {product.nameUrdu}
                            </div>
                          )}
                          {product.sku && (
                            <div className="text-[10px] text-stone-400 font-mono">
                              SKU: {product.sku}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Brand & Category */}
                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-200/60">
                          {product.brand}
                        </span>
                        <div className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                          {product.category}
                        </div>
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="py-3 px-3">
                      <span className="bg-stone-100 text-stone-700 font-semibold px-2 py-1 rounded-lg text-[11px] whitespace-nowrap">
                        {product.weight}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-3">
                      <span className="font-black text-stone-900 text-sm whitespace-nowrap">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Original Price */}
                    <td className="py-3 px-3">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <span className="text-stone-400 line-through text-xs whitespace-nowrap">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-3">
                      {product.discountPercentage && product.discountPercentage > 0 ? (
                        <span className="bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                          {product.discountPercentage}% OFF
                        </span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>

                    {/* Stock Units (Inline Quick Adjust) */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          value={product.stockCount ?? 0}
                          onChange={(e) => updateProductStock(product.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-stone-300 text-xs font-bold text-center focus:outline-emerald-600"
                        />
                        <span className="text-[10px] text-stone-400">units</span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleProductStatus(product.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                          product.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : product.status === 'Draft'
                            ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.status === 'Active'
                              ? 'bg-emerald-600'
                              : product.status === 'Draft'
                              ? 'bg-stone-500'
                              : 'bg-rose-600'
                          }`}
                        />
                        <span>{product.status || 'Active'}</span>
                      </button>
                    </td>

                    {/* Merchandising Badges Quick Toggles */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFeaturedProduct(product.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            product.featured ? 'bg-amber-100 text-amber-800 font-bold' : 'text-stone-300 hover:text-stone-600'
                          }`}
                          title="Toggle Featured"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBestSeller(product.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            product.isBestSeller ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:text-stone-600'
                          }`}
                          title="Toggle Best Seller"
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleNewArrival(product.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            product.isNewArrival ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-stone-300 hover:text-stone-600'
                          }`}
                          title="Toggle New Arrival"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleDeal(product.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            product.isDeal ? 'bg-rose-100 text-rose-800 font-bold' : 'text-stone-300 hover:text-stone-600'
                          }`}
                          title="Toggle Hot Deal"
                        >
                          <Tag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEditProduct(product)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-700 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => duplicateProduct(product.id)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(product.id, product.name)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 hover:text-rose-700 text-stone-700 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
