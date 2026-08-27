import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MessageCircle,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  ChevronDown,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminOrdersTab: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    generateWhatsAppOrderStatusUrl,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.phone.includes(q);
      const matchArea = order.area.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchArea) return false;
    }
    return true;
  });

  const handleDelete = (id: string, orderNumber: string) => {
    if (window.confirm(`Are you sure you want to remove Order #${orderNumber}?`)) {
      deleteOrder(id);
      if (activeOrderModal?.id === id) {
        setActiveOrderModal(null);
      }
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Out for Delivery':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              Customer Grocery Orders
            </h2>
            <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-0.5 rounded-full">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Track customer grocery orders across Hyderabad, dispatch status updates, and notify customers via WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, customer name, phone, or Hyderabad area..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
            />
          </div>

          <div className="sm:col-span-6">
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedStatus === st
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">No orders found.</p>
            <p className="text-xs text-stone-400">Incoming checkout orders will show up here in real time.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500/80 transition-all space-y-4"
            >
              {/* Order Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-black text-stone-950 font-mono">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(order.date).toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="bg-stone-100 text-stone-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-black text-stone-900">
                      Rs. {order.total.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold">
                      {order.deliveryFee === 0 ? 'FREE Delivery (Hyderabad)' : `Delivery: Rs. ${order.deliveryFee}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Location Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Customer */}
                <div className="space-y-1 bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                  <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">
                    Customer Information
                  </span>
                  <div className="font-bold text-stone-900 text-sm">{order.customerName}</div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{order.phone}</span>
                  </div>
                  {order.whatsappNumber && (
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp: {order.whatsappNumber}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Location */}
                <div className="space-y-1 bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                  <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>Hyderabad Delivery Address</span>
                  </span>
                  <div className="font-bold text-stone-900">{order.area}</div>
                  <div className="text-stone-600 leading-relaxed">{order.address}</div>
                  {order.deliveryNotes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 mt-1">
                      <strong>Note:</strong> {order.deliveryNotes}
                    </div>
                  )}
                </div>

                {/* Summary of Items */}
                <div className="space-y-1 bg-stone-50 p-3 rounded-2xl border border-stone-200/70 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">
                      Ordered Groceries ({order.items.length} items)
                    </span>
                    <div className="space-y-1 mt-1 max-h-24 overflow-y-auto">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-800 truncate mr-2">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="font-bold text-stone-900 whitespace-nowrap">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveOrderModal(order)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-900 text-left pt-1 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Receipt Breakdown</span>
                  </button>
                </div>
              </div>

              {/* Status Update Controls & WhatsApp Notifier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Update Order Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-stone-900 focus:outline-emerald-600"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateWhatsAppOrderStatusUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send WhatsApp Update to Customer</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(order.id, order.orderNumber)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Full Order Receipt Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div>
                <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Order Details
                </span>
                <h3 className="text-xl font-black text-stone-900 font-heading mt-1">
                  #{activeOrderModal.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="text-sm font-bold text-stone-900">{activeOrderModal.customerName}</div>
                <div>Phone: {activeOrderModal.phone}</div>
                <div>Address: {activeOrderModal.address}, {activeOrderModal.area}, Hyderabad</div>
                <div>Payment Method: {activeOrderModal.paymentMethod}</div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                  Itemized Order Breakdown:
                </span>
                <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
                  {activeOrderModal.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-900">{item.name}</div>
                        <div className="text-stone-500 text-[11px]">
                          {item.weight} • {item.quantity} × Rs. {item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="font-black text-stone-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">Rs. {activeOrderModal.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee:</span>
                  <span className="font-bold">
                    {activeOrderModal.deliveryFee === 0 ? 'FREE (Hyderabad)' : `Rs. ${activeOrderModal.deliveryFee}`}
                  </span>
                </div>
                {activeOrderModal.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount:</span>
                    <span>-Rs. {activeOrderModal.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total:</span>
                  <span className="text-emerald-800">Rs. {activeOrderModal.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
