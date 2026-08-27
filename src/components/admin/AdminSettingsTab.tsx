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
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminSettingsTab: React.FC = () => {
  const {
    storeSettings,
    updateStoreSettings,
    exportDataJSON,
    importDataJSON,
    resetToDefaults,
  } = useStore();

  const [form, setForm] = useState<StoreSettings>(storeSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `junejo-superstore-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const res = importDataJSON(content);
        if (res.success) {
          setImportStatus('✅ Database restored and synchronized successfully!');
          setForm(storeSettings);
        } else {
          setImportStatus(`❌ ${res.message}`);
        }
        setTimeout(() => setImportStatus(null), 4000);
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all products, packages, categories, and settings to original defaults? This will erase custom additions.'
      )
    ) {
      resetToDefaults();
      alert('Store reset to original default catalog.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      
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
                  Superstore Information &amp; Contacts
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Official store phone numbers, WhatsApp order line, email, and Hyderabad address.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Settings Saved!</span>
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
                WhatsApp Order Line * (International / National Format)
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
                City / Region
              </label>
              <input
                type="text"
                disabled
                value="Hyderabad, Sindh, Pakistan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm font-bold text-stone-600 cursor-not-allowed"
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

        {/* 2. Hyderabad Delivery Rules & Pricing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Delivery Engine
              </span>
              <h2 className="text-xl font-black text-stone-900 font-heading">
                Hyderabad Delivery &amp; Free Shipping Rules
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Configure free delivery thresholds, standard shipping fees, and store banner announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider">
                🚚 Free Delivery Threshold (Rs.) *
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
                Orders with cart subtotal of <strong>Rs. {form.freeDeliveryThreshold.toLocaleString()} or more</strong> receive 100% FREE DELIVERY in Hyderabad.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                Normal Delivery Fee (Rs.) *
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
                Applied automatically when cart subtotal is below Rs. {form.freeDeliveryThreshold.toLocaleString()}.
              </p>
            </div>

            <div className="sm:col-span-2">
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

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-800/20 transition-all flex items-center gap-2 hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>

      </form>

      {/* 3. Database Import / Export & Factory Reset */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-stone-900 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              Data Management
            </span>
            <h2 className="text-xl font-black text-stone-900 font-heading">
              Store Database Backup, Export &amp; Restore
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Export the complete store state (products, custom images, packages, banners, orders) into a JSON backup file, or restore a previous backup.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 bg-stone-900 text-white rounded-xl text-xs font-bold font-mono">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Download JSON Backup */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Export Backup JSON</span>
              </div>
              <p className="text-xs text-stone-500">
                Download all products, rashan bundles, customer orders, and settings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="w-full py-2.5 bg-stone-900 hover:bg-black text-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileJson className="w-4 h-4" />
              <span>Download Backup (.json)</span>
            </button>
          </div>

          {/* Restore JSON Backup */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Import / Restore JSON</span>
              </div>
              <p className="text-xs text-stone-500">
                Upload a previously exported backup file to restore your full catalog.
              </p>
            </div>
            <label className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Select Backup File</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-200 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                <RefreshCw className="w-4 h-4 text-rose-600" />
                <span>Reset to Factory Defaults</span>
              </div>
              <p className="text-xs text-rose-700">
                Restore the store to its original 25+ default supermarket inventory and packages.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Reset Store Database</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
