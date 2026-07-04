import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Search, Star, Sparkles, Filter, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCatalogProps {
  onProductSelect: (product: Product) => void;
  onSpinWheelOpen: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onProductSelect,
  onSpinWheelOpen
}) => {
  const { products, productsLoading, discountPercent } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(35000);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
        <p className="font-mono text-stone-500 text-sm">Gathering handloom treasures and Vedic botanicals...</p>
      </div>
    );
  }

  const categories = ['All', 'Books', 'Menwear', 'Womenwear', 'Accessories', 'Electronics', 'Skincare', 'Gadgets', 'Home Appliances'];

  // Filter products based on category, search, and price
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="space-y-8">
      
      {/* Immersive Indian Artisan Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-amber-50 p-8 sm:p-12 border border-stone-800 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Subtle decorative Indian border pattern using Tailwind borders */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-widest border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>The Artisan Bazaar of India</span>
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-white">
            Effortless Shopping, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              Timeless Human Craft.
            </span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            ShopEZ connects you directly with the legacy weavers, metal-workers, clay-craftsmen, and herbalists of rural India. Experience secure shopping with transparent stories behind every single handmade artifact.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={onSpinWheelOpen}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-xs tracking-wider rounded-xl uppercase hover:from-amber-400 hover:to-amber-500 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              🎡 Spin the Handloom Wheel
            </button>
            {discountPercent > 0 && (
              <span className="inline-flex items-center px-4 py-2 bg-green-500/15 text-green-400 text-xs font-mono font-bold rounded-xl border border-green-500/30">
                🎉 Applied Wheel Discount: {discountPercent}% OFF Cart
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search Books, Wear, Electronics, Skincare, Gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center space-x-4 min-w-[280px]">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-mono text-stone-500">
                <span>Max Price:</span>
                <span className="font-semibold text-stone-700">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="35000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl border border-stone-200 py-16 text-center space-y-3">
          <p className="text-stone-400 text-lg">No treasures found matching your filters.</p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(35000); }} 
            className="text-amber-600 hover:text-amber-700 text-sm font-semibold underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const hasDiscount = product.discount > 0;
            const discountedPrice = product.price * (1 - product.discount / 100);

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => onProductSelect(product)}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col h-full"
              >
                {/* Image and badges */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    referrerPolicy="no-referrer"
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Stamp */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase border border-stone-200/50">
                    {product.category}
                  </span>

                  {/* Discount Banner */}
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase shadow-xs">
                      {product.discount}% OFF
                    </span>
                  )}

                  {/* Stock Alert */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute bottom-3 left-3 bg-amber-500 text-stone-950 text-[9px] font-bold font-mono px-2 py-0.5 rounded-md uppercase">
                      Only {product.stock} Left!
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-stone-900 text-stone-100 text-xs font-bold font-mono px-3 py-1.5 rounded-lg border border-stone-700 uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </span>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-sans font-bold text-sm text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    
                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      <div className="flex text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-semibold text-stone-700">{product.rating || '4.5'}</span>
                      <span className="text-stone-300">|</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-green-600 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                        Artisan Direct
                      </span>
                    </div>

                    <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      {hasDiscount ? (
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-stone-900 font-mono">
                            {formatCurrency(discountedPrice)}
                          </span>
                          <span className="block text-[10px] text-stone-400 line-through font-mono">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-stone-900 font-mono">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs font-bold text-amber-600 group-hover:underline flex items-center gap-1">
                      Story & Buy &rarr;
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
