import React, { useState } from 'react';
import {
  Settings,
  Truck,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Save,
  Check,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  FileJson,
  CreditCard,
  Clock,
  Building2,
  Database,
  CloudCheck,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminSettingsTab: React.FC = () => {
  const {
    storeSettings,
    updateStoreSettings,
    exportDataJSON,
    importDataJSON,
    syncCloudSeed,
    isCloudConnected,
  } = useStore();

  const [form, setForm] = useState<StoreSettings>(storeSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSyncingSeed, setIsSyncingSeed] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  // Sync state if external Firestore update happens
  React.useEffect(() => {
    setForm(storeSettings);
  }, [storeSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSyncCloud = async () => {
    setIsSyncingSeed(true);
    setSeedStatus(null);
    const res = await syncCloudSeed();
    setIsSyncingSeed(false);
    if (res.success) {
      setSeedStatus('✅ Cloud Firestore successfully synchronized and verified!');
    } else {
      setSeedStatus(`❌ ${res.message}`);
    }
    setTimeout(() => setSeedStatus(null), 5000);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `junejo-superstore-cloud-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const res = await importDataJSON(content);
        if (res.success) {
          setImportStatus('✅ Firestore database restored and synchronized with cloud!');
          setForm(storeSettings);
        } else {
          setImportStatus(`❌ ${res.message}`);
        }
        setTimeout(() => setImportStatus(null), 4000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Cloud Status Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Cloud Database Engine
              </span>
            </div>
            <h3 className="text-base font-black text-white font-heading">
              Google Cloud Firestore Connected
            </h3>
            <p className="text-xs text-stone-400">
              Changes saved in this panel update live across all customer devices in Hyderabad in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncCloud}
            disabled={isSyncingSeed}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-stone-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingSeed ? 'animate-spin' : ''}`} />
            <span>{isSyncingSeed ? 'Syncing to Cloud...' : 'Re-sync All to Firestore'}</span>
          </button>
        </div>
      </div>

      {seedStatus && (
        <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 text-xs font-bold border border-stone-700">
          {seedStatus}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Store Identity & Contact */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  Store Profile
                </span>
                <h2 className="text-xl font-black text-stone-900 font-heading">
                  Superstore Identity &amp; Contact Numbers
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Store name, customer helpline, WhatsApp order receiver, and physical store address.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Cloud Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Store Tagline / Slogan
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Helpline Phone Number *
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0300-1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp Order Line * (National or International Format)
              </label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="+923001234567 or 03001234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-emerald-800 focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="orders@junejosuperstore.pk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Opening Hours / Operating Timing
              </label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                placeholder="8:00 AM – 12:00 Midnight (Open 7 Days a Week)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Physical Superstore Address in Hyderabad
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Main Autobahn Road / Latifabad Unit 7, Hyderabad, Sindh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 2. Hyderabad Delivery Rules & Minimum Order */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Delivery Policy
              </span>
              <h2 className="text-xl font-black text-stone-900 font-heading">
                Hyderabad Delivery Fees &amp; Order Thresholds
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Configure free delivery thresholds, standard shipping fees, minimum checkout cart value, and top announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider">
                🚚 Free Delivery Above (Rs.) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-base font-black text-emerald-900 focus:outline-emerald-600"
              />
              <p className="text-[11px] text-emerald-800 font-medium">
                Orders <strong>Rs. {form.freeDeliveryThreshold.toLocaleString()}+</strong> receive FREE shipping.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                Standard Delivery Fee (Rs.) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.deliveryFee}
                onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-base font-black text-stone-900 focus:outline-emerald-600"
              />
              <p className="text-[11px] text-stone-600 font-medium">
                Applied when order subtotal is below Rs. {form.freeDeliveryThreshold.toLocaleString()}.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                Minimum Order Value (Rs.) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.minimumOrder}
                onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-base font-black text-stone-900 focus:outline-emerald-600"
              />
              <p className="text-[11px] text-stone-600 font-medium">
                Lowest cart subtotal accepted at checkout.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Announcement Top Bar Message
              </label>
              <input
                type="text"
                value={form.announcement}
                onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                placeholder="🚚 FREE DELIVERY ON ORDERS RS. 8,000+ | 📍 DELIVERY AVAILABLE IN HYDERABAD ONLY"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Methods & Bank / Mobile Accounts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Payment Gateways
              </span>
              <h2 className="text-xl font-black text-stone-900 font-heading">
                Bank Transfer, EasyPaisa &amp; JazzCash Account Details
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              These details are displayed to customers at Checkout when choosing online payment options.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-950 uppercase">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>EasyPaisa Account</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  EasyPaisa Account / Mobile Number
                </label>
                <input
                  type="text"
                  value={form.easypaisaNumber}
                  onChange={(e) => setForm({ ...form, easypaisaNumber: e.target.value })}
                  placeholder="0300-1234567 (Title: Daniyal Junejo)"
                  className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-bold text-stone-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-rose-950 uppercase">
                <CreditCard className="w-4 h-4 text-rose-700" />
                <span>JazzCash Account</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  JazzCash Account / Mobile Number
                </label>
                <input
                  type="text"
                  value={form.jazzcashNumber}
                  onChange={(e) => setForm({ ...form, jazzcashNumber: e.target.value })}
                  placeholder="0300-7654321 (Title: Daniyal Junejo)"
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-300 bg-white text-xs font-bold text-stone-900 focus:outline-rose-600"
                />
              </div>
            </div>

            <div className="sm:col-span-2 p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase">
                <Building2 className="w-4 h-4 text-stone-700" />
                <span>Direct Bank Transfer Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={form.bankDetails?.bankName || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, bankName: e.target.value },
                      })
                    }
                    placeholder="Meezan Bank / HBL"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={form.bankDetails?.accountTitle || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountTitle: e.target.value },
                      })
                    }
                    placeholder="JUNEJO SUPERSTORE"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={form.bankDetails?.accountNumber || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
                      })
                    }
                    placeholder="0101-010582910"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono font-medium text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">IBAN</label>
                  <input
                    type="text"
                    value={form.bankDetails?.iban || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, iban: e.target.value },
                      })
                    }
                    placeholder="PK36MEZN000101010582910"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono font-medium text-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-800/20 transition-all flex items-center gap-2 hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>Save All Configuration to Firestore</span>
          </button>
        </div>

      </form>

      {/* 4. Database Cloud Backup & Export */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-stone-900 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              Data Management
            </span>
            <h2 className="text-xl font-black text-stone-900 font-heading">
              Cloud Database Backup &amp; Migration
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Export a full JSON snapshot of products, categories, rashan bundles, and orders, or upload an existing backup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export Button */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Export Cloud JSON Backup</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Download an offline backup file containing all 42 products, categories, Rashan packages, and customer orders.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <FileJson className="w-4 h-4 text-amber-600" />
              <span>Download Backup (.json)</span>
            </button>
          </div>

          {/* Import Button */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Restore Database from File</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Upload a JSON store backup to update Firestore collections in a single batch.
              </p>
            </div>
            <label className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer text-center">
              <Upload className="w-4 h-4" />
              <span>Select &amp; Upload JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

        </div>

        {importStatus && (
          <div className="p-3.5 bg-stone-900 text-amber-300 rounded-xl text-xs font-bold">
            {importStatus}
          </div>
        )}
      </div>

    </div>
  );
};
