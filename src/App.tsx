/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetails } from './components/ProductDetails';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SellerDashboard } from './components/SellerDashboard';
import { ArtisanAdvisorChat } from './components/ArtisanAdvisorChat';
import { DiscountWheel } from './components/DiscountWheel';
import { Sparkles, MessageSquareHeart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user } = useShop();

  // Modals / Overlays States
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      
      {/* Universal Header */}
      <Header
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        onDashboardToggle={() => setShowDashboard(!showDashboard)}
        showDashboard={showDashboard}
      />

      {/* Main Screen Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDashboard ? (
          /* --- SELLER/ADMIN METRICS DASHBOARD --- */
          <SellerDashboard />
        ) : (
          /* --- BUYER E-COMMERCE BAZAAR --- */
          <ProductCatalog
            onProductSelect={(product) => setSelectedProduct(product)}
            onSpinWheelOpen={() => setIsWheelOpen(true)}
          />
        )}
      </main>

      {/* Footer Details */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-mono tracking-widest text-amber-500 uppercase">ShopEZ Artisanal India • Secure Direct Trade</p>
          <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
            Supporting standard direct-trade initiatives since 2026. Every purchase transfers capital directly to craft cooperatives. Fully audited and compliant with national handloom initiatives.
          </p>
          <div className="flex justify-center space-x-1.5 text-[10px] font-mono text-stone-600">
            <span>SSL Encrypted Transaction Portal</span>
            <span>•</span>
            <span>Firestore Core Persistence</span>
            <span>•</span>
            <span>Gemini API Enabled</span>
          </div>
        </div>
      </footer>

      {/* --- OVERLAYS AND MODALS --- */}

      {/* 1. Product Detailed Description & Review Board */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 2. Right Slide-Over Shopping Cart Drawer */}
      {isCartOpen && (
        <CartModal
          onClose={() => setIsCartOpen(false)}
          onCheckoutOpen={() => setIsCheckoutOpen(true)}
        />
      )}

      {/* 3. Checkout Form & Instant Order Confirmation Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {/* 4. Heritage Advisor Chat Drawer (Gemini Conversation) */}
      {isChatOpen && (
        <ArtisanAdvisorChat
          onClose={() => setIsChatOpen(false)}
          currentProductContext={selectedProduct}
        />
      )}

      {/* 5. Spin the handloom loyalty discount wheel */}
      {isWheelOpen && (
        <DiscountWheel
          onClose={() => setIsWheelOpen(false)}
        />
      )}

      {/* 6. Tiny persistent chat bubble */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer hover:shadow-amber-500/10"
          title="Chat with Artisan AI Advisor"
        >
          <MessageSquareHeart className="w-6 h-6 animate-pulse" />
        </button>
      )}

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
