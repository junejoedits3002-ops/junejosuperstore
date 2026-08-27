import React from 'react';
import {
  Plus,
  Layers,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { Category } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AdminCategoriesTabProps {
  onOpenAddCategory: () => void;
  onOpenEditCategory: (cat: Category) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  onOpenAddCategory,
  onOpenEditCategory,
}) => {
  const { categories, products, deleteCategory, reorderCategory, setActiveCategory, setActiveView } = useStore();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove category "${name}"?`)) {
      deleteCategory(id);
    }
  };

  const handlePreviewCategory = (catName: string) => {
    setActiveCategory(catName);
    setActiveView('shop');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              Aisle &amp; Category Hierarchy
            </h2>
            <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-0.5 rounded-full">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize supermarket aisles, subcategory filters, cover images, and display order.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddCategory}
          className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>➕ Add Category</span>
        </button>
      </div>

      {/* Categories Grid / Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => {
          const productCount = products.filter((p) => p.category === category.name).length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-emerald-500 transition-colors"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-32 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Position Badge */}
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    Position #{index + 1}
                  </div>

                  {/* Items Count Badge */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-black bg-emerald-700/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                      {productCount} Items
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                      {category.name}
                    </h3>
                    {category.nameUrdu && (
                      <span className="text-xs font-semibold text-stone-400" dir="rtl">
                        {category.nameUrdu}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {category.description}
                  </p>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {category.subcategories.slice(0, 4).map((sub, i) => (
                        <span
                          key={i}
                          className="bg-stone-100 text-stone-600 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-stone-200/60"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 4 && (
                        <span className="text-[10px] text-stone-400 font-bold self-center">
                          +{category.subcategories.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
                {/* Reorder Up/Down */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => reorderCategory(category.id, 'up')}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1}
                    onClick={() => reorderCategory(category.id, 'down')}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePreviewCategory(category.name)}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                    title="View in Customer Store"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenEditCategory(category)}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-emerald-100 hover:text-emerald-800"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-rose-100 hover:text-rose-800"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
