import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: any) => void;
  onOpenAddProduct: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const { products, orders, categories, rashanPackages, customers, storeSettings } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) <= 5);
  const outOfStockProducts = products.filter((p) => !p.inStock || (p.stockCount ?? 0) === 0);

  return (
    <div className="space-y-6">
      
      {/* Quick Action & Hyderabad Status Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700/50">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-stone-950 text-xs font-black rounded-full">
            <Truck className="w-3.5 h-3.5" />
            <span>Hyderabad Delivery Engine Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Welcome to {storeSettings.storeName} Management Console
          </h2>
          <p className="text-xs text-stone-300">
            Free Delivery threshold: <strong className="text-amber-300">Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}</strong> | Standard delivery: <strong className="text-white">Rs. {storeSettings.deliveryFee}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Add New Product</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              Rs
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>From {orders.length} total customer orders</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold">
            Requires store confirmation &amp; dispatch
          </div>
        </div>

        {/* Total Active Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 cursor-pointer hover:border-emerald-500 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
            {products.length}
          </div>
          <div className="text-[11px] text-stone-500">
            Across {categories.length} aisles &amp; categories
          </div>
        </div>

        {/* Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Hyderabad Clients</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
            {customers.length}
          </div>
          <div className="text-[11px] text-stone-500">
            Registered customer phone directories
          </div>
        </div>
      </div>

      {/* Two-column layout: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-stone-900 font-heading">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-stone-500">Latest grocery deliveries in Hyderabad</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:bg-stone-100 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-stone-900">#{order.orderNumber}</span>
                    <span className="text-xs font-bold text-stone-700">• {order.customerName}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {order.area} • {order.items.length} items • {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-stone-900">
                    Rs. {order.total.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    {order.deliveryFee === 0 ? 'FREE Delivery' : `+Rs. ${order.deliveryFee}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock & Out of Stock Alerts */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-stone-900 font-heading flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Stock Alerts</span>
              </h3>
              <p className="text-xs text-stone-500">Items needing re-order from suppliers</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
              <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-1 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">Inventory Healthy</p>
                <p className="text-[11px] text-emerald-700">All grocery products have sufficient stock.</p>
              </div>
            ) : (
              <>
                {outOfStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-rose-50 rounded-2xl border border-rose-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-rose-950 line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-rose-600 font-bold uppercase">OUT OF STOCK (0 units)</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('products')}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                    >
                      Restock
                    </button>
                  </div>
                ))}

                {lowStockProducts
                  .filter((p) => (p.stockCount ?? 0) > 0)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-amber-950 line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-amber-700 font-bold">Only {p.stockCount} left in stock</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('products')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-bold"
                      >
                        Update
                      </button>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
