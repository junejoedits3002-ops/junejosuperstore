import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Banknote,
  Smartphone,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HYDERABAD_AREAS, PAKISTANI_CITIES } from '../data/initialData';
import { PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    couponDiscount,
    cartTotal,
    appliedCoupon,
    placeOrder,
    setActiveView,
    storeSettings,
  } = useStore();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsappNumber: '',
    sameAsPhone: true,
    address: '',
    area: HYDERABAD_AREAS[0],
    customArea: '',
    city: 'Hyderabad, Sindh',
    deliveryNotes: '',
    paymentMethod: 'Cash on Delivery' as PaymentMethod,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-800">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('shop')}
          className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const isHyderabad =
    formData.city.toLowerCase().includes('hyderabad') &&
    !formData.city.toLowerCase().includes('unavailable');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.customerName.trim()) errs.customerName = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Valid 11-digit mobile phone number is required (e.g. 03001234567)';
    }
    const finalWhatsApp = formData.sameAsPhone ? formData.phone : formData.whatsappNumber;
    if (!finalWhatsApp.trim() || finalWhatsApp.length < 10) {
      errs.whatsappNumber = 'Valid WhatsApp number is required (e.g. 03001234567)';
    }
    if (!formData.address.trim()) errs.address = 'Complete street address is required';
    if (!formData.area.trim()) errs.area = 'Hyderabad delivery area is required';
    if (formData.area.includes('Other') && !formData.customArea.trim()) {
      errs.customArea = 'Please specify your Hyderabad area name';
    }

    if (!isHyderabad) {
      errs.city = 'Sorry, JUNEJO SUPERSTORE currently delivers only within Hyderabad.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedArea = formData.area.includes('Other') && formData.customArea.trim()
      ? `Other (${formData.customArea.trim()})`
      : formData.area;

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customerName: formData.customerName,
        phone: formData.phone,
        whatsappNumber: formData.sameAsPhone ? formData.phone : formData.whatsappNumber,
        address: formData.address,
        area: selectedArea,
        city: 'Hyderabad, Sindh',
        deliveryNotes: formData.deliveryNotes,
        paymentMethod: formData.paymentMethod,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const freeDeliveryThreshold = storeSettings.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="py-10 bg-stone-100/50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button
          type="button"
          onClick={() => setActiveView('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="text-center md:text-left mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-heading">
            Delivery &amp; Checkout
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Please enter your accurate Hyderabad delivery details and choose your payment method.
          </p>
        </div>

        {/* Global Delivery Notice */}
        <div className="mb-6 bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-emerald-700/60">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 block">
                Official Delivery Zone
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                📍 Delivery Available in Hyderabad Only
              </h2>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-xs font-bold bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-600/40 inline-block">
              Free Delivery Threshold: Rs. {freeDeliveryThreshold.toLocaleString()}+
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Customer Contact Details */}
              <div className="bg-white/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-2 border-b border-stone-200/60 pb-3">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>1. Contact Information</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="input-checkout-name"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Muhammad Bilal Khan"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90 ${
                        errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300/80'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        id="input-checkout-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="03001234567"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90 ${
                          errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300/80'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700">
                          WhatsApp Number *
                        </label>
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formData.sameAsPhone}
                            onChange={(e) => setFormData({ ...formData, sameAsPhone: e.target.checked })}
                            className="rounded text-emerald-700 w-3.5 h-3.5"
                          />
                          <span>Same as Mobile</span>
                        </label>
                      </div>

                      <input
                        id="input-checkout-whatsapp"
                        type="tel"
                        disabled={formData.sameAsPhone}
                        value={formData.sameAsPhone ? formData.phone : formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="03001234567"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          formData.sameAsPhone ? 'bg-stone-100/80 text-stone-500 border-stone-200' : 'border-stone-300/80 bg-white/90'
                        }`}
                      />
                      {errors.whatsappNumber && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.whatsappNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Hyderabad Delivery Address */}
              <div className="bg-white/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>2. Hyderabad Delivery Address</span>
                  </h3>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Hyderabad Only
                  </span>
                </div>

                {/* City restriction block */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Delivery Location *
                      </label>
                      <div className="relative">
                        <select
                          id="select-checkout-city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300/80 text-xs sm:text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90"
                        >
                          <option value="Hyderabad, Sindh">Hyderabad, Sindh (Delivery Available)</option>
                          <option value="Karachi (Unavailable)">Karachi (Outside Delivery Area)</option>
                          <option value="Lahore (Unavailable)">Lahore (Outside Delivery Area)</option>
                          <option value="Islamabad (Unavailable)">Islamabad (Outside Delivery Area)</option>
                          <option value="Rawalpindi (Unavailable)">Rawalpindi (Outside Delivery Area)</option>
                          <option value="Other City (Unavailable)">Other City (Outside Delivery Area)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Hyderabad Area / Neighborhood *
                      </label>
                      <select
                        id="select-checkout-area"
                        value={formData.area}
                        disabled={!isHyderabad}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300/80 text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90 disabled:opacity-50"
                      >
                        {HYDERABAD_AREAS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Warning banner if outside Hyderabad */}
                  {!isHyderabad && (
                    <div
                      id="delivery-unsupported-error-box"
                      className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-start gap-3 text-rose-800 animate-in fade-in"
                    >
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <p className="font-extrabold text-sm text-rose-900">
                          Sorry, JUNEJO SUPERSTORE currently delivers only within Hyderabad.
                        </p>
                        <p className="text-rose-700">
                          We are currently unable to accept delivery orders outside Hyderabad, Sindh. Please change your delivery location to a valid Hyderabad address to complete checkout.
                        </p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, city: 'Hyderabad, Sindh' })}
                          className="mt-2 px-3 py-1 bg-rose-700 text-white rounded-lg text-xs font-bold hover:bg-rose-800 transition-colors"
                        >
                          Switch back to Hyderabad, Sindh
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.area.includes('Other') && isHyderabad && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Specify Your Hyderabad Area Name *
                      </label>
                      <input
                        type="text"
                        value={formData.customArea}
                        onChange={(e) => setFormData({ ...formData, customArea: e.target.value })}
                        placeholder="e.g. Unit 5 Market Area, Hussainabad, Preetabad"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90 ${
                          errors.customArea ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300/80'
                        }`}
                      />
                      {errors.customArea && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.customArea}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Complete Address (House/Flat #, Street/Block, Landmark) *
                    </label>
                    <textarea
                      id="input-checkout-address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. House # 14-B, Street 3, Autobahn Road, Near Boulevard Mall, Hyderabad"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90 ${
                        errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300/80'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryNotes}
                      onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                      placeholder="e.g. Call before arrival / Ring front doorbell / Leave with security guard"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300/80 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Options */}
              <div className="bg-white/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-2 border-b border-stone-200/60 pb-3">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span>3. Payment Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* COD */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                        : 'border-stone-200/80 bg-stone-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-700" />
                        <span className="text-xs font-extrabold text-stone-900">Cash on Delivery (COD)</span>
                      </div>
                      {formData.paymentMethod === 'Cash on Delivery' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Pay cash to delivery rider at your Hyderabad doorstep upon receiving grocery.
                    </p>
                  </div>

                  {/* EasyPaisa */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'EasyPaisa' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'EasyPaisa'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                        : 'border-stone-200/80 bg-stone-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-extrabold text-stone-900">EasyPaisa Mobile</span>
                      </div>
                      {formData.paymentMethod === 'EasyPaisa' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Transfer to {storeSettings.easypaisaNumber}
                    </p>
                  </div>

                  {/* JazzCash */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'JazzCash' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'JazzCash'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                        : 'border-stone-200/80 bg-stone-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-amber-600" />
                        <span className="text-xs font-extrabold text-stone-900">JazzCash Mobile</span>
                      </div>
                      {formData.paymentMethod === 'JazzCash' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Transfer to {storeSettings.jazzcashNumber}
                    </p>
                  </div>

                  {/* Bank Transfer */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'Bank Transfer'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                        : 'border-stone-200/80 bg-stone-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-700" />
                        <span className="text-xs font-extrabold text-stone-900">Direct Bank Transfer</span>
                      </div>
                      {formData.paymentMethod === 'Bank Transfer' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Meezan Bank: {storeSettings.bankDetails.accountNumber}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Order Summary (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                  <h3 className="text-base font-extrabold text-stone-900 font-heading">
                    Order Summary
                  </h3>
                  <span className="text-xs text-stone-500 font-bold bg-stone-100/80 px-2.5 py-0.5 rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)} Items
                  </span>
                </div>

                {/* Free Delivery alert banner in summary */}
                {cartSubtotal >= freeDeliveryThreshold ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span className="text-base">🎉</span>
                    <span>You unlocked FREE DELIVERY!</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 text-amber-950 p-2.5 rounded-xl text-xs font-medium space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Add Rs. {remainingForFreeDelivery.toLocaleString()} more to get FREE DELIVERY 🚚</span>
                    </div>
                  </div>
                )}

                {/* Items Mini List */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 text-xs divide-y divide-stone-100">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 object-cover rounded-lg bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-stone-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-stone-400 font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-black text-stone-900 shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 text-xs border-t border-stone-200 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-stone-900">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span className="font-bold text-stone-900">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-black">FREE</span>
                      ) : (
                        `Rs. ${deliveryFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>-Rs. {couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base sm:text-lg font-black text-stone-900 border-t border-stone-200 pt-2">
                    <span>Total Payable:</span>
                    <span className="text-emerald-800">Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Location indicator in summary */}
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivering to: Hyderabad, Sindh</span>
                  </div>
                  <p className="text-stone-500 pl-5">
                    {formData.area.includes('Other') && formData.customArea ? formData.customArea : formData.area}
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  id="btn-place-order-submit"
                  type="submit"
                  disabled={isSubmitting || !isHyderabad}
                  className="w-full py-4 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Placing Your Order...</span>
                  ) : !isHyderabad ? (
                    <span>Hyderabad Delivery Only</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Place Order (Rs. {cartTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>

                <div className="pt-1 text-center text-[11px] text-stone-400 space-y-1">
                  <p className="flex items-center justify-center gap-1.5 text-emerald-800 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Safe &amp; Verified Hyderabad Supermarket Order</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
