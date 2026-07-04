import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, Order } from '../types';
import { X, CheckCircle, IndianRupee, CreditCard, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onClose
}) => {
  const { cart, checkout, discountPercent, user, loginAnonymously, authLoading } = useShop();

  const [formData, setFormData] = useState<ShippingAddress>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pinCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('You must sign in (Google or Guest) to place an order.');
      return;
    }
    
    // Simple validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pinCode) {
      setErrorMessage('Please fill out all shipping fields.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^\d{6}$/.test(formData.pinCode)) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const order = await checkout(formData, paymentMethod);
      setCompletedOrder(order);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setErrorMessage('Checkout failed. Please confirm database setup and rules are deployed correctly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const INDIAN_STATES = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Rajasthan', 'Tamil Nadu', 
    'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Kerala', 'Telangana', 
    'Andhra Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Uttarakhand'
  ];

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
    return acc + (discountedPrice * item.quantity);
  }, 0);

  const discountAmount = subtotal * (discountPercent / 100);
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center items-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-900 text-white">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-amber-500" />
            <h2 className="font-sans font-bold text-lg">
              {completedOrder ? 'Order Confirmed!' : 'Secure Checkout'}
            </h2>
          </div>
          {!isSubmitting && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {completedOrder ? (
            /* --- SUCCESS STATE: ORDER CONFIRMED --- */
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 border border-green-200">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-sans font-extrabold text-2xl text-stone-900">Your order has been placed!</h3>
                <p className="text-xs text-stone-400 font-mono tracking-wider">ORDER ID: {completedOrder.id}</p>
                <p className="text-sm text-stone-600 max-w-md mx-auto pt-2">
                  Thank you for supporting sustainable craftsmanship. We've notified the artisan cooperative to select, polish, and package your unique treasures.
                </p>
              </div>

              {/* Order Summary Cards */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-wider text-stone-400">SHIPPING SUMMARY</span>
                <div className="text-xs text-stone-700 space-y-1.5">
                  <p><span className="font-semibold text-stone-800">Deliver To:</span> {completedOrder.shippingAddress.name}</p>
                  <p><span className="font-semibold text-stone-800">Phone:</span> {completedOrder.shippingAddress.phone}</p>
                  <p><span className="font-semibold text-stone-800">Address:</span> {completedOrder.shippingAddress.address}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.pinCode}</p>
                  <p><span className="font-semibold text-stone-800">Payment:</span> {completedOrder.paymentMethod} (COD/Simulated)</p>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-stone-500">Paid Amount:</span>
                  <span className="text-lg font-extrabold text-stone-900 font-mono">
                    {formatCurrency(completedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-stone-900 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-stone-800 cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            </div>
          ) : (
            /* --- FORM STATE: ENTER CHECKOUT DETAILS --- */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Form Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-1.5 text-stone-800 border-b border-stone-100 pb-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Shipping Destination</span>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">Customer Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">10-Digit Mobile Number</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">Complete Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Flat No, Street, Landmark"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="e.g. Jaipur"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">PIN Code</label>
                      <input
                        type="text"
                        name="pinCode"
                        required
                        placeholder="6-digit code"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Right Column: Billing & Secure Payment */}
              <div className="space-y-6 bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col justify-between">
                
                {/* Billing Summary */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-stone-800 border-b border-stone-200 pb-2">
                    <CreditCard className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Checkout Billing</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Items Price:</span>
                      <span className="font-mono">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Wheel Discount ({discountPercent}%):</span>
                        <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Shipping:</span>
                      <span className="text-green-600 uppercase font-bold text-[10px] font-mono">FREE</span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-stone-800">Final Price (INR):</span>
                      <span className="text-lg font-extrabold text-stone-900 font-mono">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Payment Select */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">SELECT PAYMENT METHOD</span>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'UPI', label: 'UPI GPay/PhonePe' },
                      { id: 'COD', label: 'Cash on Delivery' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border text-xs font-medium text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                          paymentMethod === method.id
                            ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-sm'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="font-sans font-bold">{method.label}</span>
                        <span className="text-[8px] opacity-75 font-mono">100% SECURE</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-stone-100 rounded-lg text-[10px] text-stone-500 leading-relaxed text-center">
                    🔒 SSL Encrypted & Secure Sandbox. Your bank accounts will not be debited. This order will process via direct simulated confirmation.
                  </div>
                </div>

                {/* Submit Action */}
                <div>
                  {!user ? (
                    <div className="space-y-2">
                      <p className="text-[10px] text-center text-stone-500">Please authenticate with 1-click guest login to finalize order:</p>
                      <button
                        type="button"
                        onClick={loginAnonymously}
                        disabled={authLoading}
                        className="w-full py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl uppercase tracking-wider hover:bg-amber-400 transition-all cursor-pointer"
                      >
                        {authLoading ? 'Signing In...' : 'Quick Guest Sign-In'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-stone-950 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-850 transition-all shadow-md disabled:bg-stone-300 disabled:text-stone-500 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>{isSubmitting ? 'Processing Transaction...' : `Confirm Payment of ${formatCurrency(finalTotal)}`}</span>
                    </button>
                  )}
                </div>

              </div>

            </form>
          )}
        </div>

      </motion.div>
    </div>
  );
};
