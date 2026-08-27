import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminCustomersTab: React.FC = () => {
  const { customers, storeSettings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((cust) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cust.name.toLowerCase().includes(q);
      const matchPhone = cust.phone.includes(q);
      const matchArea = cust.area?.toLowerCase().includes(q) || false;
      if (!matchName && !matchPhone && !matchArea) return false;
    }
    return true;
  });

  const getDirectWhatsAppUrl = (phone: string, name: string) => {
    const cleanNum = phone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `*Assalamualaikum ${name}!* Greetings from *${storeSettings.storeName}*. We have exciting grocery deals and new stock available for Hyderabad delivery today!`
    );
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              Customer Directory
            </h2>
            <span className="bg-indigo-100 text-indigo-900 font-black text-xs px-2.5 py-0.5 rounded-full">
              {customers.length} Customers
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Directory of all customers who placed orders from Hyderabad with order volume and lifetime spending.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, or Hyderabad neighborhood..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-black text-stone-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-3">Phone &amp; WhatsApp</th>
                <th className="py-3.5 px-3">Hyderabad Area &amp; Address</th>
                <th className="py-3.5 px-3">Orders Count</th>
                <th className="py-3.5 px-3">Lifetime Spent</th>
                <th className="py-3.5 px-3">Last Order Date</th>
                <th className="py-3.5 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500 font-medium">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs">
                          {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="font-bold text-stone-900">{cust.name}</div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="font-mono font-bold text-stone-800">{cust.phone}</div>
                        {cust.whatsappNumber && cust.whatsappNumber !== cust.phone && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            WA: {cust.whatsappNumber}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Area & Address */}
                    <td className="py-3.5 px-3">
                      <div className="max-w-[220px]">
                        <div className="font-bold text-stone-800 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{cust.area || 'Hyderabad'}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate" title={cust.address}>
                          {cust.address}
                        </div>
                      </div>
                    </td>

                    {/* Orders Count */}
                    <td className="py-3.5 px-3">
                      <span className="bg-stone-100 text-stone-800 font-black px-2.5 py-1 rounded-lg text-xs">
                        {cust.ordersCount} Orders
                      </span>
                    </td>

                    {/* Lifetime Spent */}
                    <td className="py-3.5 px-3">
                      <span className="font-black text-emerald-800 text-sm">
                        Rs. {cust.totalSpent.toLocaleString()}
                      </span>
                    </td>

                    {/* Last Order Date */}
                    <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                      {new Date(cust.lastOrderDate).toLocaleDateString()}
                    </td>

                    {/* Quick WhatsApp contact */}
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getDirectWhatsAppUrl(cust.phone, cust.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat</span>
                      </a>
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
