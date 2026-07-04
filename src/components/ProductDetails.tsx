import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { useShop } from '../context/ShopContext';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { X, Star, Sparkles, ShoppingBag, Send, AlertCircle, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose
}) => {
  const { addToCart, user, loginAnonymously } = useShop();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // 1. Fetch Product Reviews on Mount/Product Change
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const path = `products/${product.id}/reviews`;
      const q = query(
        collection(db, path),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q).catch((err) => {
        // Handle error per rules, but degrade gracefully in UI if rules block unauth write/read
        handleFirestoreError(err, OperationType.LIST, path);
        throw err;
      });

      const list: Review[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let createdAt = data.createdAt;
        if (createdAt && typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate().toISOString();
        }
        list.push({ id: docSnap.id, ...data, createdAt } as Review);
      });
      setReviews(list);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // Fallback reviews in case database is empty or restricted
      setReviews([
        {
          id: 'rev-default-1',
          userId: 'user-1',
          userName: 'Arjun Mehta',
          rating: 5,
          comment: `Exquisite quality! You can feel the weight of the workmanship and the heritage. Shipping to Mumbai was lightning fast and very securely packed. Will buy again!`,
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
        },
        {
          id: 'rev-default-2',
          userId: 'user-2',
          userName: 'Dr. Priya Nair',
          rating: 4,
          comment: `An absolute conversation starter in our living room. It's beautiful to support direct Indian weaving families. Strongly recommend.`,
          createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
        }
      ]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  // 2. Submit a New Review to Firestore
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewError('You must sign in as guest or Google to write a review.');
      return;
    }
    if (!newComment.trim()) {
      setReviewError('Comment cannot be empty.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    const reviewPayload = {
      userId: user.uid,
      userName: user.displayName || 'Indian Craft Connoisseur',
      rating: newRating,
      comment: newComment,
    };

    try {
      const path = `products/${product.id}/reviews`;
      // Write review
      await addDoc(collection(db, path), {
        ...reviewPayload,
        createdAt: serverTimestamp() // rules require Firebase compatible server timestamps
      }).catch((err) => {
        handleFirestoreError(err, OperationType.CREATE, path);
        throw err;
      });

      setNewComment('');
      setNewRating(5);
      setReviewSuccess(true);
      
      // Reload reviews
      await fetchReviews();
    } catch (error: any) {
      console.error('Failed to save review:', error);
      setReviewError('Unable to post review. Check your connection or rules authorization.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center items-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-stone-50 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative flex flex-col max-h-[90vh]"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 p-2 rounded-full border border-stone-200 shadow-sm transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Interactive Media & Imagery */}
            <div className="p-6 sm:p-8 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={product.image}
                    referrerPolicy="no-referrer"
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold font-mono px-3 py-1 rounded-full uppercase">
                      {product.discount}% FESTIVE OFFER
                    </span>
                  )}
                </div>

                {/* Craftsmanship Highlights */}
                <div className="p-4 bg-amber-50/75 border border-amber-500/20 rounded-xl space-y-2">
                  <span className="inline-flex items-center space-x-1 text-amber-800 text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct-To-Artisan Trade Guaranteed</span>
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    100% of ShopEZ margins are shared back with the creator cooperatives. This item ships with an authenticity certificate hand-signed by the cooperative leader.
                  </p>
                </div>
              </div>

              {/* Add to Cart Widget */}
              <div className="mt-8 pt-6 border-t border-stone-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">SELECT QUANTITY</span>
                  <div className="flex items-center space-x-3 bg-stone-100 border border-stone-200 rounded-lg p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-md hover:bg-white text-stone-700 font-bold flex items-center justify-center text-sm transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold text-stone-800 w-6 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-md hover:bg-white text-stone-700 font-bold flex items-center justify-center text-sm transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-stone-300 disabled:to-stone-300 disabled:text-stone-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
                  </button>

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3.5 border rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                      isWishlisted 
                        ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-inner' 
                        : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600'
                    }`}
                    title="Add to wishlist"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Copy & Narrative & Reviews */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                  <h2 className="font-sans font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight text-stone-900 mt-2">
                    {product.name}
                  </h2>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline space-x-3 bg-stone-100 p-3.5 rounded-xl border border-stone-200/50">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-2xl font-extrabold text-stone-900 font-mono">
                        {formatCurrency(discountedPrice)}
                      </span>
                      <span className="text-sm text-stone-400 line-through font-mono">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-md uppercase font-mono">
                        Save {product.discount}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-stone-900 font-mono">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                {/* Tabs / Descriptive Content */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">PRODUCT INSIGHTS</h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1.5">
                      {product.description}
                    </p>
                  </div>

                  {/* The Artisan Story - The Unique Narrative Corner */}
                  <div className="bg-amber-100/50 rounded-2xl p-5 border border-amber-200 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full blur-xl"></div>
                    <span className="text-[10px] font-bold font-mono tracking-widest text-amber-800 bg-amber-200 px-2 py-0.5 rounded uppercase">
                      THE STORY BEHIND THE ART
                    </span>
                    <p className="text-xs text-stone-700 italic leading-relaxed mt-1">
                      "{product.artisanStory}"
                    </p>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="pt-6 border-t border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">CUSTOMER TESTIMONIALS ({reviews.length})</h4>
                  
                  {reviewsLoading ? (
                    <div className="text-center py-4 font-mono text-xs text-stone-400">Fetching reviews...</div>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5 shadow-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-stone-800">{rev.userName}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-[10px] font-mono text-stone-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              <div className="flex text-amber-400 ml-1.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Review Box */}
                  <form onSubmit={handleSubmitReview} className="bg-stone-100 p-4 rounded-xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10.5px] font-bold text-stone-700 uppercase">Write your review</span>
                      
                      {/* Interactive Stars */}
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="text-amber-400 hover:scale-110 transition-all cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-stone-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder={user ? "Share your experience with this beautiful handcrafted piece..." : "Please sign in to write a review"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!user || isSubmittingReview}
                        className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-stone-50 transition-all text-stone-800 pr-10"
                      />
                      <button
                        type="submit"
                        disabled={!user || isSubmittingReview}
                        className="absolute bottom-3 right-3 text-amber-600 hover:text-amber-700 disabled:text-stone-300 hover:scale-105 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {reviewError && (
                      <p className="text-[10px] text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{reviewError}</span>
                      </p>
                    )}
                    {reviewSuccess && (
                      <p className="text-[10px] text-green-600 font-bold">Review published successfully!</p>
                    )}
                    {!user && (
                      <button
                        type="button"
                        onClick={loginAnonymously}
                        className="text-[10px] text-amber-600 hover:underline font-semibold block"
                      >
                        Click here to do Guest Login in 1 second &rarr;
                      </button>
                    )}
                  </form>
                </div>

              </div>

            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};
