import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Package,
  Check,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Users,
} from 'lucide-react';
import { RashanPackage, RashanPackageItem, Product } from '../../types';

interface RashanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (packageData: Partial<RashanPackage>) => void;
  editingPackage: RashanPackage | null;
  availableProducts: Product[];
}

export const RashanFormModal: React.FC<RashanFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPackage,
  availableProducts,
}) => {
  const [formData, setFormData] = useState<Partial<RashanPackage>>({
    name: '',
    nameUrdu: '',
    description: '',
    familySize: 'Family of 4-6 Persons',
    price: 8950,
    originalPrice: 9800,
    savingsText: 'Save Rs. 850 (Wholesale Bundle)',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    items: [],
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1 kg');
  const [newItemUrdu, setNewItemUrdu] = useState('');

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        ...editingPackage,
        items: editingPackage.items || [],
      });
    } else {
      setFormData({
        name: 'Deluxe Family Rashan Package',
        nameUrdu: 'ڈیلکس فیملی راشن پیکج',
        description: 'Complete 30-day monthly household grocery package with premium staples.',
        familySize: 'Family of 5-7 Persons',
        price: 15400,
        originalPrice: 16900,
        savingsText: 'Save Rs. 1,500 with Superstore Bundle',
        badge: 'Best Value',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        items: [
          { productName: 'Sunridge Whole Wheat Chakki Atta', quantity: '20 kg', unit: 'bag' },
          { productName: 'Guard Super Basmati Kernel Rice', quantity: '5 kg', unit: 'bag' },
          { productName: 'Dalda Cooking Oil 5L Tin', quantity: '5 Litres', unit: 'tin' },
          { productName: 'Tapal Danedar Black Tea', quantity: '900 g', unit: 'pack' },
          { productName: 'Daal Moong Washed', quantity: '2 kg', unit: 'pack' },
          { productName: 'Daal Masoor', quantity: '2 kg', unit: 'pack' },
          { productName: 'Refined White Sugar (Cheeni)', quantity: '5 kg', unit: 'bag' },
          { productName: 'National Salt Iodine Pack', quantity: '800 g', unit: 'pack' },
        ],
      });
    }
  }, [editingPackage, isOpen]);

  if (!isOpen) return null;

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

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const item: RashanPackageItem = {
      productName: newItemName.trim(),
      quantity: newItemQty.trim() || '1 pack',
      productNameUrdu: newItemUrdu.trim() || undefined,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), item],
    }));
    setNewItemName('');
    setNewItemQty('1 kg');
    setNewItemUrdu('');
  };

  const handleQuickAddFromCatalog = (prod: Product) => {
    const item: RashanPackageItem = {
      productName: `${prod.name}`,
      quantity: prod.weight || '1 pack',
      productNameUrdu: prod.nameUrdu,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), item],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.price) {
      alert('Please provide package name and price.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <span className="text-[11px] font-black tracking-wider uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Monthly Grocery Bundle
            </span>
            <h2 className="text-xl font-black text-stone-900 font-heading mt-1">
              {editingPackage ? `Edit Package: ${editingPackage.name}` : 'Create New Rashan Package'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Package Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Budget Rashan Package, Deluxe Family Package"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Package Name in Urdu (Optional)
              </label>
              <input
                type="text"
                value={formData.nameUrdu || ''}
                onChange={(e) => setFormData({ ...formData, nameUrdu: e.target.value })}
                placeholder="e.g. بنیادی فیملی راشن پیکج"
                dir="rtl"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Family Size / Household Description *
              </label>
              <input
                type="text"
                required
                value={formData.familySize || ''}
                onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                placeholder="e.g. Family of 4-6 Persons"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Bundle Price (Rs.) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Original Market Price (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                placeholder="e.g. 9800"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Savings Text Badge
              </label>
              <input
                type="text"
                value={formData.savingsText || ''}
                onChange={(e) => setFormData({ ...formData, savingsText: e.target.value })}
                placeholder="e.g. Save Rs. 850 (Wholesale Bundle)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Highlight Ribbon Badge
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Most Popular, Best Value, Ramadan Special"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Image */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700">
              Package Cover Image URL or Upload
            </label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/rashan-package.jpg"
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer text-xs font-bold text-stone-700 border border-stone-300 shrink-0">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Package Description
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide context on which family size this package is designed for..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          {/* Package Items Builder */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-stone-700 tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Included Grocery Items ({formData.items?.length || 0})</span>
              </h3>
            </div>

            {/* Quick Add from Store Products */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Quick-Add from Store Catalog:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {availableProducts.slice(0, 12).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickAddFromCatalog(p)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-emerald-700" />
                    <span>{p.name.split(' ').slice(0, 3).join(' ')} ({p.weight})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Add Line */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Item Name (e.g. Daal Chana)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  placeholder="Quantity (e.g. 2 kg)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {(formData.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-stone-900">{item.productName}</span>
                    <span className="text-stone-500 font-semibold bg-white px-2 py-0.5 rounded border border-stone-200">
                      {item.quantity}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{editingPackage ? 'Save Package' : 'Publish Rashan Package'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
