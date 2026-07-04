import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingCart, Sparkles, User, LogOut, ShieldAlert, Heart, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onCartToggle: () => void;
  onChatToggle: () => void;
  onDashboardToggle: () => void;
  showDashboard: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onCartToggle,
  onChatToggle,
  onDashboardToggle,
  showDashboard
}) => {
  const { user, cart, loginWithGoogle, loginAnonymously, logout, isAdminUser, setAdminStatus, discountPercent } = useShop();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { if (showDashboard) onDashboardToggle(); }}>
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 font-bold shadow-inner">
              EZ
            </div>
            <div>
              <span className="font-sans font-bold text-2xl tracking-tight text-white flex items-center gap-1.5">
                ShopEZ <span className="text-amber-500 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono tracking-widest uppercase">Artisanal</span>
              </span>
              <p className="text-[10px] font-mono tracking-wider text-stone-400">CONNECTING INDIAN HERITAGE</p>
            </div>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Quick Demo Mode Toggle (Admin / Seller) */}
            {user && (
              <button
                onClick={() => setAdminStatus(!isAdminUser)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  isAdminUser 
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25' 
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
                title="Toggle between Buyer and Seller/Admin dashboards"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isAdminUser ? 'Seller Mode Active' : 'Switch to Seller'}</span>
              </button>
            )}

            {/* Seller Panel Toggle */}
            {user && isAdminUser && (
              <button
                onClick={onDashboardToggle}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showDashboard 
                    ? 'bg-amber-500 text-stone-950 font-bold' 
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/20'
                }`}
              >
                {showDashboard ? 'Shop Store' : 'Seller Analytics'}
              </button>
            )}

            {/* Chat with Advisor Trigger */}
            <button
              onClick={onChatToggle}
              className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm animate-pulse cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisan AI Advisor</span>
            </button>

            {/* Cart Button */}
            {!showDashboard && (
              <button
                onClick={onCartToggle}
                className="relative p-2.5 bg-stone-800 text-stone-200 hover:text-white rounded-full hover:bg-stone-700 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-xs font-bold font-mono h-5 w-5 rounded-full flex items-center justify-center border-2 border-stone-900 shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Auth Toggle */}
            {user ? (
              <div className="flex items-center space-x-2.5 pl-2 border-l border-stone-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-white max-w-28 truncate">{user.displayName || 'Indian Artisan Patron'}</p>
                  <p className="text-[10px] font-mono text-stone-400">
                    {user.isAnonymous ? 'Guest Customer' : 'Verified Patron'}
                  </p>
                </div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    alt={user.displayName || 'Avatar'}
                    className="w-8 h-8 rounded-full border border-stone-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={loginWithGoogle}
                  className="px-4 py-2 bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 rounded-full text-xs transition-all tracking-wide shadow-md cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={loginAnonymously}
                  className="px-3.5 py-2 bg-stone-800 text-stone-300 hover:text-white rounded-full text-xs font-medium transition-all cursor-pointer"
                >
                  Guest
                </button>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </header>
  );
};
