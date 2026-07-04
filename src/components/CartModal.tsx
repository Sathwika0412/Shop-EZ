import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CartModalProps {
  onClose: () => void;
  onCheckoutOpen: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  onClose,
  onCheckoutOpen
}) => {
  const { cart, removeFromCart, updateQuantity, discountPercent, clearCart } = useShop();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate cart calculations
  const subtotal = cart.reduce((acc, item) => {
    const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
    return acc + (discountedPrice * item.quantity);
  }, 0);

  const wheelDiscountAmount = subtotal * (discountPercent / 100);
  const finalTotal = subtotal - wheelDiscountAmount;
  const isCartEmpty = cart.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex justify-end">
      
      {/* Background overlay click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-900 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-sans font-extrabold text-lg tracking-tight">Shopping Cart</h2>
            <span className="bg-amber-500 text-stone-950 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isCartEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-stone-800 font-bold">Your cart is empty</p>
                <p className="text-stone-400 text-xs mt-1">Explore our product catalogs to find beautiful Indian artisan creations!</p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold tracking-wider text-stone-400">YOUR SELECTED TREASURES</span>
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-red-500 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  Clear All
                </button>
              </div>

              {cart.map((item) => {
                const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
                return (
                  <div 
                    key={item.product.id}
                    className="flex space-x-4 p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all shadow-2xs"
                  >
                    <img
                      src={item.product.image}
                      referrerPolicy="no-referrer"
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover bg-stone-100 border border-stone-200"
                    />
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="font-sans font-bold text-xs text-stone-900 line-clamp-1">{item.product.name}</h4>
                        <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">{item.product.category}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2 bg-stone-100 rounded-md p-0.5 border border-stone-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-5 h-5 rounded-sm hover:bg-white text-stone-700 flex items-center justify-center font-bold text-xs transition-all"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold text-stone-800 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 rounded-sm hover:bg-white text-stone-700 flex items-center justify-center font-bold text-xs transition-all"
                          >
                            +
                          </button>
                        </div>

                        {/* Pricing */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-stone-900 font-mono">
                            {formatCurrency(discountedPrice * item.quantity)}
                          </span>
                          {item.product.discount > 0 && (
                            <span className="block text-[9px] text-stone-400 line-through font-mono">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-300 hover:text-red-500 transition-all self-center p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Billing Block */}
        {!isCartEmpty && (
          <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500 font-medium">
                <span>Items Subtotal:</span>
                <span className="font-mono text-stone-800">{formatCurrency(subtotal)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-xs text-green-600 font-bold">
                  <span>Wheel Discount ({discountPercent}%):</span>
                  <span className="font-mono">-{formatCurrency(wheelDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-stone-500 font-medium">
                <span>Delivery Charges:</span>
                <span className="text-green-600 uppercase font-bold text-[10px] font-mono">FREE DELIVERY</span>
              </div>

              <div className="pt-2.5 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Estimated Total:</span>
                <span className="text-xl font-extrabold text-stone-900 font-mono">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckoutOpen();
              }}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
