import React from 'react';
import {
  Plus,
  Package,
  Sparkles,
  Edit2,
  Copy,
  Trash2,
  Users,
  DollarSign,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { RashanPackage } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AdminRashanTabProps {
  onOpenAddPackage: () => void;
  onOpenEditPackage: (pkg: RashanPackage) => void;
}

export const AdminRashanTab: React.FC<AdminRashanTabProps> = ({
  onOpenAddPackage,
  onOpenEditPackage,
}) => {
  const {
    rashanPackages,
    deleteRashanPackage,
    duplicateRashanPackage,
    setActiveView,
  } = useStore();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteRashanPackage(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              Monthly Rashan Package Bundles
            </h2>
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-2.5 py-0.5 rounded-full">
              {rashanPackages.length} Bundles
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure full-month grocery staples bundles tailored for Hyderabad families with wholesale discounts.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddPackage}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>➕ Add Rashan Package</span>
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rashanPackages.map((pkg) => {
          const discountAmt = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-amber-500 transition-colors"
            >
              <div>
                {/* Header with image */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                      {pkg.badge}
                    </div>
                  )}

                  {/* Pricing on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <h3 className="text-lg font-black font-heading leading-tight">{pkg.name}</h3>
                      {pkg.nameUrdu && <p className="text-xs text-amber-200" dir="rtl">{pkg.nameUrdu}</p>}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-amber-400">
                        Rs. {pkg.price.toLocaleString()}
                      </div>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <div className="text-xs text-stone-300 line-through">
                          Rs. {pkg.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Users className="w-4 h-4" />
                      <span>{pkg.familySize}</span>
                    </span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {pkg.savingsText || `Save Rs. ${discountAmt.toLocaleString()}`}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider">
                      Included Package Groceries ({pkg.items.length} items):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                      {pkg.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-stone-50 rounded-lg text-xs border border-stone-200"
                        >
                          <span className="font-semibold text-stone-800 truncate mr-2">
                            {item.productName}
                          </span>
                          <span className="font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                            {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveView('rashan')}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Preview on Customer Store →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => duplicateRashanPackage(pkg.id)}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1"
                    title="Duplicate Package"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenEditPackage(pkg)}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-emerald-100 hover:text-emerald-800 text-stone-700 text-xs font-bold flex items-center gap-1"
                    title="Edit Package"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pkg.id, pkg.name)}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 text-xs font-bold"
                    title="Delete Package"
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
