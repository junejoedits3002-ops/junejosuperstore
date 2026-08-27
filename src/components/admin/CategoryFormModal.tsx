import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Upload,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
  editingCategory: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    nameUrdu: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    subcategories: [],
  });

  const [subcategoriesStr, setSubcategoriesStr] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setFormData(editingCategory);
      setSubcategoriesStr((editingCategory.subcategories || []).join(', '));
    } else {
      setFormData({
        name: '',
        nameUrdu: '',
        slug: '',
        description: 'Superstore grocery department for Hyderabad families.',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        subcategories: [],
      });
      setSubcategoriesStr('');
    }
  }, [editingCategory, isOpen]);

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

  const handleNameChange = (val: string) => {
    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug || slugVal : slugVal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a Category Name.');
      return;
    }

    const subcats = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      subcategories: subcats,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Aisle &amp; Category
            </span>
            <h2 className="text-xl font-black text-stone-900 font-heading mt-1">
              {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Category Name (English) *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Flour & Grains (Atta, Rice)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Category Name in Urdu (Optional)
            </label>
            <input
              type="text"
              value={formData.nameUrdu || ''}
              onChange={(e) => setFormData({ ...formData, nameUrdu: e.target.value })}
              placeholder="e.g. آٹا اور چاول"
              dir="rtl"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. flour-grains"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Subcategories (comma separated)
            </label>
            <input
              type="text"
              value={subcategoriesStr}
              onChange={(e) => setSubcategoriesStr(e.target.value)}
              placeholder="e.g. Chakki Atta, Basmati Rice, Maida, Suji"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Category Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/category.jpg"
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer text-xs font-bold text-stone-700 border border-stone-300">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Aisle description..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
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
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{editingCategory ? 'Save Category' : 'Create Category'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
