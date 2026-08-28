import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLogin: React.FC = () => {
  const { adminLogin, setActiveView, storeSettings, isCloudConnected } = useStore();
  
  const [email, setEmail] = useState('admin@junejosuperstore.pk');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your admin email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await adminLogin(email.trim(), password.trim());
      setIsLoading(false);
      if (result.success) {
        setIsSuccess(true);
        setError(null);
      } else {
        setError(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Failed to connect to Firebase Authentication.');
    }
  };

  return (
    <div
      id="admin-login-screen"
      className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-400 selection:text-stone-950"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Back to storefront link */}
        <div className="flex items-center justify-between">
          <button
            id="btn-admin-back-store"
            type="button"
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>

          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>Firebase Auth</span>
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-stone-950/90 rounded-3xl border border-stone-800 p-7 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
                {storeSettings.storeName}
              </h1>
              <p className="text-xs uppercase tracking-widest font-bold text-amber-400 mt-0.5">
                Admin Portal Login
              </p>
            </div>
            <p className="text-xs text-stone-400 max-w-xs mx-auto pt-1">
              Secure Firebase Authentication for store managers and administrators.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="admin@junejosuperstore.pk"
                  autoFocus
                  autoComplete="username"
                  disabled={isLoading || isSuccess}
                  className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm font-medium text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
              >
                Firebase Account Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading || isSuccess}
                  className="w-full pl-10 pr-11 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm font-medium text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                id="admin-auth-error"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Feedback */}
            {isSuccess && (
              <div
                id="admin-auth-success"
                className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Firebase Authentication verified. Loading dashboard...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-admin-submit-login"
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm tracking-wide shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying with Firebase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In with Firebase</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-stone-500 space-y-1">
          <p>📍 JUNEJO SUPERSTORE — Hyderabad, Sindh, Pakistan</p>
          <p className="text-[11px] text-stone-600">
            Backed by Google Cloud Firestore with real-time sync.
          </p>
        </div>
      </div>
    </div>
  );
};
