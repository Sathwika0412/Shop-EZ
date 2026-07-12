import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Sparkles, Check, Loader2, KeyRound, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithGoogle, 
    loginAnonymously, 
    loginWithEmail, 
    signUpWithEmail, 
    loginWithSimulatedRole 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'simulated' | 'email-login' | 'email-register'>('simulated');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email, password);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setErrorMsg('All fields (Name, Email, Password) are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await signUpWithEmail(email, password, displayName);
      setSuccessMsg('Account created and logged in successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Check if email is valid or already exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedLogin = async (role: 'patron' | 'artisan' | 'admin') => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithSimulatedRole(role);
      setSuccessMsg(`Logged in as ${role === 'admin' ? 'Curator Admin' : role === 'artisan' ? 'Artisan Seller' : 'Patron'}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      setErrorMsg('Simulated login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      // In context, if popup fails it falls back to simulated guest. Just close.
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginAnonymously();
      onClose();
    } catch (err: any) {
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-stone-50 text-stone-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative flex flex-col"
      >
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 w-full" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex-1">
          {/* Brand Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-full bg-amber-500 items-center justify-center text-stone-950 font-bold shadow-md mb-2">
              EZ
            </div>
            <h2 className="font-sans font-extrabold text-2xl tracking-tight text-stone-900">
              Welcome to ShopEZ Bazaar
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Connect directly with India's legacy handlooms, pottery, and Vedic wellness
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 mb-6 bg-stone-100/80 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('simulated'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'simulated'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ⚡ 1-Click Test roles
            </button>
            <button
              onClick={() => { setActiveTab('email-login'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'email-login'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('email-register'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'email-register'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Status Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs rounded-r-lg flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'simulated' && (
              <motion.div
                key="simulated-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 mb-2">
                  💡 <strong>Immediate Developer Testing:</strong> Real-time OAuth popup authentication can get blocked inside sandboxed iFrames. Use these pre-configured accounts to instantly experience different user flows!
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Patron role */}
                  <button
                    onClick={() => handleSimulatedLogin('patron')}
                    disabled={loading}
                    className="flex items-center justify-between p-3.5 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-2xl transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900 group-hover:text-amber-700 transition-colors">
                          Sita Devi (Patron Customer)
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">Role: Patron • Write reviews, Place Orders</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                  </button>

                  {/* Artisan Seller role */}
                  <button
                    onClick={() => handleSimulatedLogin('artisan')}
                    disabled={loading}
                    className="flex items-center justify-between p-3.5 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-2xl transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900 group-hover:text-orange-700 transition-colors">
                          Ramchandra (Artisan Seller)
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">Role: Seller • Stocks, Seller Dashboard</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-stone-400 group-hover:text-orange-600 transition-colors" />
                  </button>

                  {/* Curator Admin role */}
                  <button
                    onClick={() => handleSimulatedLogin('admin')}
                    disabled={loading}
                    className="flex items-center justify-between p-3.5 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-2xl transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900 group-hover:text-red-700 transition-colors">
                          Curator Admin
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">Role: Admin • Global orders, Manage site</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-stone-400 group-hover:text-red-600 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'email-login' && (
              <motion.form
                key="login-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onSubmit={handleEmailLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sita@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Authenticate Patron Account</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {activeTab === 'email-register' && (
              <motion.form
                key="register-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onSubmit={handleEmailRegister}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Sita Devi"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sita@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>Register & Explore Bazaar</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social / Guest fallbacks */}
          <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-white border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-xs active:bg-stone-50 transition-all text-stone-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.38-2.07 2.07l3.19 2.48c1.87-1.72 2.94-4.25 2.94-7.4z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.19-2.48c-.88.59-2.01.95-3.37.95-2.6 0-4.8-1.75-5.59-4.1H4.63v2.53C6.61 21.94 9.12 24 12 24z" />
                <path fill="#FBBC05" d="M6.41 15.46c-.2-.59-.31-1.22-.31-1.86s.11-1.27.31-1.86V9.21H1.41C.51 11-.01 13.01.01 15c.01 1.99.51 3.9 1.41 5.69l5-3.88c-.01-.1.01-.1-.01-.35z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 9.12 0 6.61 2.06 4.63 4.75l5 3.88c.79-2.35 2.99-4.1 5.59-4.1z" />
              </svg>
              Google Sign-In
            </button>
            
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Anonymous Guest
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
