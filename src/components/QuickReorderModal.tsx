import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  ShoppingBag,
  Clock,
  CheckCircle,
  Package,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const QuickReorderModal: React.FC = () => {
  const {
    getOrdersByPhone,
    reorderPastOrder,
    setActiveView,
    orders,
  } = useStore();

  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    const results = getOrdersByPhone(phoneInput);
    setSearchedOrders(results);
  };

  const handleReorder = (order: Order) => {
    reorderPastOrder(order);
  };

  return (
    <div className="py-12 bg-stone-50/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 backdrop-blur-xs text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200/60 shadow-2xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Instant 1-Click Grocery Reorder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading">
            Quick Reorder Past Groceries
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Enter your mobile number to lookup your previous junejo SUPERSTORE orders and instantly re-fill your cart.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-md max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-bold text-stone-700">
              Enter Your Registered Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 03009876543"
                  className="w-full pl-9 pr-3 py-2.5 bg-white/90 border border-stone-300/80 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Find Orders
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              Try searching with sample phone: <strong className="text-stone-700">03009876543</strong>
            </p>
          </form>
        </div>

        {/* Results List */}
        {searchedOrders !== null && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-800">
              Found {searchedOrders.length} Order(s)
            </h2>

            {searchedOrders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 p-8 text-center space-y-3 shadow-xs">
                <p className="text-sm font-semibold text-stone-700">
                  No previous orders found for &ldquo;{phoneInput}&rdquo;
                </p>
                <p className="text-xs text-stone-400">
                  Make sure you entered the same phone number you used during checkout.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('shop')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Start New Order
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {searchedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-emerald-300 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-sm text-stone-900 bg-stone-100/90 px-2.5 py-1 rounded-md border border-stone-200/60">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {new Date(ord.date).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded border border-emerald-200/60">
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600">
                        <p className="font-semibold text-stone-800">{ord.customerName} • {ord.area}, {ord.city}</p>
                        <p className="text-stone-500 mt-1 line-clamp-1">
                          Items: {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="text-sm font-black text-stone-900">
                        Total: <span className="text-emerald-800">Rs. {ord.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReorder(ord)}
                      className="w-full md:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reorder This Basket</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
