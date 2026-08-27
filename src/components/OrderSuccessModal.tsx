import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ShoppingBag,
  MessageCircle,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const {
    lastCompletedOrder,
    setActiveView,
    generateWhatsAppOrderUrl,
    storeSettings,
  } = useStore();

  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!lastCompletedOrder) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold">No recent order found</h2>
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleWhatsAppSend = () => {
    const url = generateWhatsAppOrderUrl({
      items: lastCompletedOrder.items,
      total: lastCompletedOrder.total,
      name: lastCompletedOrder.customerName,
      address: `${lastCompletedOrder.address}, ${lastCompletedOrder.area}, ${lastCompletedOrder.city}`,
      phone: lastCompletedOrder.phone,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(lastCompletedOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 sm:py-16 bg-stone-100/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Success Box */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden">
          
          {/* Green Top Hero */}
          <div className="bg-gradient-to-br from-emerald-800/95 via-teal-900/90 to-emerald-950/95 backdrop-blur-md text-white p-6 sm:p-8 text-center space-y-3 relative border-b border-emerald-700/40">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-xs border-2 border-emerald-400/80 text-emerald-300 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-950/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-700/40">
              JUNEJO SUPERSTORE ORDER CONFIRMED
            </span>

            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Order Successfully Placed!
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
              Shukriya <strong className="text-white">{lastCompletedOrder.customerName}</strong>! Your grocery order has been received and sent to our packing team.
            </p>

            {/* Order Number Badge */}
            <div className="pt-2 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <span className="text-xs text-stone-200">Order ID:</span>
              <span className="text-sm font-black text-amber-300 tracking-wider font-mono">
                {lastCompletedOrder.orderNumber}
              </span>
              <button
                type="button"
                onClick={copyOrderNumber}
                className="text-stone-300 hover:text-white transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* WhatsApp Notify Banner */}
          <div className="bg-emerald-50/80 backdrop-blur-xs border-b border-emerald-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                  Notify Store on WhatsApp
                </h4>
                <p className="text-[11px] text-emerald-700">
                  Send your order confirmation message directly to our store WhatsApp for priority dispatch!
                </p>
              </div>
            </div>

            <button
              id="btn-whatsapp-order-notify"
              type="button"
              onClick={handleWhatsAppSend}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send on WhatsApp</span>
            </button>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Status & Delivery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Order Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-200/60">
                  <Clock className="w-3 h-3" />
                  <span>{lastCompletedOrder.status}</span>
                </span>
              </div>

              <div className="bg-white/60 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Payment Mode
                </span>
                <span className="text-xs font-bold text-stone-800">
                  {lastCompletedOrder.paymentMethod}
                </span>
              </div>

              <div className="bg-white/60 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Estimated Delivery
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  Same-Day Delivery
                </span>
              </div>
            </div>

            {/* Delivery Information Box */}
            <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/80 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Delivery Destination</span>
              </h4>
              <div className="text-xs text-stone-800 space-y-0.5">
                <p className="font-bold">{lastCompletedOrder.customerName} ({lastCompletedOrder.phone})</p>
                <p className="text-stone-600">{lastCompletedOrder.address}</p>
                <p className="text-stone-600 font-semibold">{lastCompletedOrder.area}, {lastCompletedOrder.city}</p>
                {lastCompletedOrder.deliveryNotes && (
                  <p className="text-[11px] text-amber-800 italic pt-1">
                    Note: &ldquo;{lastCompletedOrder.deliveryNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Products Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ordered Grocery Items ({lastCompletedOrder.items.length})</span>
              </h4>

              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
                {lastCompletedOrder.items.map((item) => (
                  <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-stone-400">Qty: {item.quantity} {item.weight ? `• ${item.weight}` : ''}</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="bg-stone-50/80 backdrop-blur-xs p-4 rounded-2xl space-y-1.5 text-xs text-stone-600 border border-stone-200/80">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-stone-800">Rs. {lastCompletedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-bold text-stone-800">
                    {lastCompletedOrder.deliveryFee === 0 ? 'FREE' : `Rs. ${lastCompletedOrder.deliveryFee}`}
                  </span>
                </div>
                {lastCompletedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span>-Rs. {lastCompletedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-stone-900 border-t border-stone-200/70 pt-2">
                  <span>Total Amount Paid / Payable:</span>
                  <span className="text-emerald-800">Rs. {lastCompletedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                id="btn-continue-shopping-success"
                type="button"
                onClick={() => setActiveView('home')}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
