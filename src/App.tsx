/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategorySection } from './components/CategorySection';
import { MonthlyRashanSection } from './components/MonthlyRashanSection';
import { RashanBuilder } from './components/RashanBuilder';
import { FeaturedDealsSection } from './components/FeaturedDealsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { QuickReorderModal } from './components/QuickReorderModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 pb-16 md:pb-0 selection:bg-emerald-200 selection:text-emerald-950">
      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <CategorySection />
            <MonthlyRashanSection />
            <FeaturedDealsSection />
          </>
        )}

        {activeView === 'shop' && <ProductCatalog />}

        {activeView === 'rashan' && <MonthlyRashanSection isDedicatedPage={true} />}

        {activeView === 'rashan-builder' && <RashanBuilder />}

        {activeView === 'deals' && <ProductCatalog initialDealOnly={true} />}

        {activeView === 'checkout' && <CheckoutPage />}

        {activeView === 'order-success' && <OrderSuccessModal />}

        {activeView === 'reorder' && <QuickReorderModal />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <ProductDetailModal />
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
