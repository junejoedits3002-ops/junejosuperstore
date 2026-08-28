import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Package,
  Layers,
  Sparkles,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  editingProduct: Product | null;
  categories: Category[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    nameUrdu: '',
    brand: '',
    category: categories[0]?.name || 'Flour & Grains (Atta, Rice)',
    subcategory: '',
    weight: '1 kg',
    unit: 'pack',
    price: 500,
    originalPrice: 550,
    discountPercentage: 0,
    stockCount: 50,
    status: 'Active',
    inStock: true,
    sku: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    additionalImages: [],
    description: '',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    isDeal: false,
  });

  const [newAdditionalImageUrl, setNewAdditionalImageUrl] = useState('');
  const [imagePreviewMode, setImagePreviewMode] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        additionalImages: editingProduct.additionalImages || [],
      });
    } else {
      setFormData({
        name: '',
        nameUrdu: '',
        brand: 'JUNEJO Staples',
        category: categories[0]?.name || 'Flour & Grains (Atta, Rice)',
        subcategory: '',
        weight: '1 kg',
        unit: 'pack',
        price: 500,
        originalPrice: 550,
        discountPercentage: 9,
        stockCount: 50,
        status: 'Active',
        inStock: true,
        sku: `JS-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        additionalImages: [],
        description: 'Fresh quality grocery item sourced directly for Hyderabad households.',
        featured: false,
        isBestSeller: false,
        isNewArrival: true,
        isDeal: false,
      });
    }
  }, [editingProduct, categories, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({
            ...prev,
            additionalImages: [...(prev.additionalImages || []), reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdditionalImage = () => {
    if (newAdditionalImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), newAdditionalImageUrl.trim()],
      }));
      setNewAdditionalImageUrl('');
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: (prev.additionalImages || []).filter((_, i) => i !== index),
    }));
  };

  const handlePriceChange = (priceVal: number, originalPriceVal: number) => {
    let discount = 0;
    if (originalPriceVal > priceVal && originalPriceVal > 0) {
      discount = Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100);
    }
    setFormData((prev) => ({
      ...prev,
      price: priceVal,
      originalPrice: originalPriceVal,
      discountPercentage: discount,
      isDeal: discount > 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.price) {
      alert('Please fill out Product Name and Price.');
      return;
    }
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      // Error handling is done in the parent component, just stay open
      console.error('handleSubmit error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div>
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {editingProduct ? 'Update Product' : 'Add New Grocery Item'}
            </span>
            <h2 className="text-xl font-black text-stone-900 font-heading mt-1">
              {editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Product Title &amp; Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dalda Cooking Oil 5 Litre Tin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Name in Urdu (Optional)
                </label>
                <input
                  type="text"
                  value={formData.nameUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, nameUrdu: e.target.value })}
                  placeholder="e.g. ڈالڈا کوکنگ آئل ۵ لیٹر"
                  dir="rtl"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Dalda, Sunridge, Tapal, Guard"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Categorization & Hierarchy */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Category &amp; SKU</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Main Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subcategory || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g. Banaspati Ghee, Basmati"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  SKU / Barcode (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. JS-OIL-500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 3. Pricing, Weight & Stock */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Pricing, Weight &amp; Inventory</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Selling Price (Rs.) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price || ''}
                  onChange={(e) =>
                    handlePriceChange(Number(e.target.value), formData.originalPrice || Number(e.target.value))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Original Price (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) =>
                    handlePriceChange(formData.price || 0, Number(e.target.value))
                  }
                  placeholder="e.g. 600"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Weight / Size *
                </label>
                <input
                  type="text"
                  required
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g. 5 kg, 1 Litre, 900 g"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Unit Type
                </label>
                <select
                  value={formData.unit || 'pack'}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600 bg-white"
                >
                  <option value="pack">pack</option>
                  <option value="kg">kg</option>
                  <option value="litre">litre</option>
                  <option value="tin">tin</option>
                  <option value="bottle">bottle</option>
                  <option value="box">box</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                  <option value="jar">jar</option>
                  <option value="bar">bar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Stock Quantity (Available)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockCount ?? 0}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    setFormData({
                      ...formData,
                      stockCount: count,
                      inStock: count > 0,
                      status: count === 0 ? 'Out of Stock' : (formData.status === 'Draft' ? 'Draft' : 'Active'),
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Status
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'Active' | 'Draft' | 'Out of Stock';
                    setFormData({
                      ...formData,
                      status: newStatus,
                      inStock: newStatus === 'Active' && (formData.stockCount ?? 0) > 0,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600 bg-white"
                >
                  <option value="Active">Active (Visible in Store)</option>
                  <option value="Draft">Draft (Hidden from Customers)</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Calculated Discount
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-black text-emerald-800">
                  {formData.discountPercentage || 0}% OFF
                </div>
              </div>
            </div>
          </div>

          {/* 4. Product Image Upload & Additional Images */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Product Image &amp; Gallery</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview Thumbnail */}
              <div className="w-32 h-32 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-stone-400" />
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImagePreviewMode('url')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${
                      imagePreviewMode === 'url' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImagePreviewMode('upload')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${
                      imagePreviewMode === 'upload' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Upload from Device
                  </button>
                </div>

                {imagePreviewMode === 'url' ? (
                  <div>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/grocery-image.jpg"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
                    />
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 text-xs font-bold text-stone-700">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Choose Grocery Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-[11px] text-stone-400">
                  Recommended size: 800x800px. High quality grocery photo on clean background.
                </p>
              </div>
            </div>

            {/* Additional Images Gallery */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Additional Gallery Images (Optional)
              </label>

              <div className="flex flex-wrap items-center gap-3">
                {(formData.additionalImages || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl border border-stone-200 overflow-hidden group">
                    <img src={imgUrl} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(idx)}
                      className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newAdditionalImageUrl}
                    onChange={(e) => setNewAdditionalImageUrl(e.target.value)}
                    placeholder="Add image URL..."
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs w-48"
                  />
                  <button
                    type="button"
                    onClick={handleAddAdditionalImage}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                  <label className="p-1.5 border border-stone-300 rounded-lg cursor-pointer hover:bg-stone-100 text-stone-600" title="Upload additional">
                    <Upload className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" onChange={handleAdditionalFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Description */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700">
              Product Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the product quality, packaging, origin, and manufacturer details..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          {/* 6. Homepage Display Toggles */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Homepage Merchandising Badges</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-emerald-50/50">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-800">Featured</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-emerald-50/50">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller || false}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-800">Best Seller</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-emerald-50/50">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival || false}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-800">New Arrival</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-emerald-50/50">
                <input
                  type="checkbox"
                  checked={formData.isDeal || false}
                  onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-800">Hot Deal</span>
              </label>
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{editingProduct ? 'Save Product Changes' : 'Publish Product'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
