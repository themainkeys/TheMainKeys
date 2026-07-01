/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order, PromoCode, ProductReview } from '../types';
import { 
  ShoppingBag, Heart, Star, Sparkles, Filter, ChevronRight, X, 
  Trash2, Plus, Minus, Tag, Check, ArrowLeft, CreditCard, Ship, 
  Percent, FileText, Download, Share2, MessageSquare, BadgeAlert, RefreshCw
} from 'lucide-react';

interface BoutiquePageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  promoCodes: PromoCode[];
}

export default function BoutiquePage({
  products,
  setProducts,
  orders,
  setOrders,
  promoCodes,
}: BoutiquePageProps) {
  // State variables
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeBrand, setActiveBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Cart & Wishlist state
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedSize?: string; selectedColor?: string }[]>(() => {
    const saved = localStorage.getItem('tmk_boutique_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tmk_boutique_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Checkout Form state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Completed

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  // NOTE: paymentForm state removed — PCI compliance fix.
  // Real card collection will use Stripe Elements in Phase 2 so that
  // raw card data never enters JavaScript application state.
  // See: https://stripe.com/docs/stripe-js

  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Save Cart and Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('tmk_boutique_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tmk_boutique_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Product Filter and Sorting Logic
  const categories = [
    'All', 'Fashion', 'Resort Wear', 'Fitness Apparel', 'Accessories', 
    'Fragrances', 'Wellness', 'Beverages', 'Digital', 'Catalog Downloads', 
    'Limited Collaborations', 'Event Merchandise'
  ];

  const brands = [
    { id: 'All', name: 'All Brands' },
    { id: 'cle_paris', name: 'CLÉ Paris' },
    { id: 'pier_st_barth', name: 'Pier St Barth' },
    { id: 'cuffed_design', name: 'Cuffed Design' },
    { id: 'fashion_meetz_fitness', name: 'Fashion Meetz Fitness' },
    { id: 'fitness_power_hour', name: 'Fitness Power Hour' },
    { id: 'mike_water_fitness', name: 'Mike Water Fitness' },
    { id: 'sorority', name: 'Sorority' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesBrand = activeBrand === 'All' || product.brandId === activeBrand;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sortBy === 'price-high') return (b.salePrice || b.price) - (a.salePrice || a.price);
    if (sortBy === 'newest') return b.id.localeCompare(a.id); // Simulating newest
    // default (featured)
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Cart operations
  const addToCart = (product: Product, size?: string, color?: string) => {
    if (product.soldOut) {
      if (window.showLuxuryToast) window.showLuxuryToast('This exclusive item is currently sold out.');
      return;
    }
    if (product.comingSoon) {
      if (window.showLuxuryToast) window.showLuxuryToast('This item is not yet available for purchase.');
      return;
    }

    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && 
              item.selectedSize === size && 
              item.selectedColor === color
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
    }

    if (window.showLuxuryToast) {
      window.showLuxuryToast(`Added ${product.name} to your curated checkout portfolio.`);
    }
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const newCart = cart.filter(
      item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    );
    setCart(newCart);
  };

  const updateCartQuantity = (productId: string, delta: number, size?: string, color?: string) => {
    const targetIndex = cart.findIndex(
      item => item.product.id === productId && item.selectedSize === size && item.selectedColor === color
    );

    if (targetIndex > -1) {
      const newCart = [...cart];
      const newQty = newCart[targetIndex].quantity + delta;
      if (newQty <= 0) {
        removeFromCart(productId, size, color);
      } else {
        newCart[targetIndex].quantity = newQty;
        setCart(newCart);
      }
    }
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      if (window.showLuxuryToast) window.showLuxuryToast('Item removed from your private wishlist.');
    } else {
      setWishlist([...wishlist, productId]);
      if (window.showLuxuryToast) window.showLuxuryToast('Item secured in your private wishlist.');
    }
  };

  // Review submission
  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || !selectedProduct) return;

    const newReview: ProductReview = {
      id: 'rev_' + Date.now(),
      user: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().slice(0, 10),
    };

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        const currentReviews = p.reviews || [];
        return {
          ...p,
          reviews: [newReview, ...currentReviews]
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setSelectedProduct({
      ...selectedProduct,
      reviews: [newReview, ...(selectedProduct.reviews || [])]
    });

    setReviewName('');
    setReviewComment('');
    setReviewRating(5);

    if (window.showLuxuryToast) {
      window.showLuxuryToast('Your editorial review has been logged and published.');
    }
  };

  // Checkout helper functions
  const getSubtotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.product.salePrice || item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  };

  const getDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = getSubtotal();
    if (appliedPromo.discountType === 'percentage') {
      return (subtotal * appliedPromo.value) / 100;
    } else {
      return Math.min(appliedPromo.value, subtotal);
    }
  };

  const getShippingFee = () => {
    if (getSubtotal() === 0) return 0;
    return shippingMethod === 'express' ? 35 : 15;
  };

  const getTax = () => {
    return (getSubtotal() - getDiscount()) * 0.085; // 8.5% luxury tax
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getShippingFee() + getTax();
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase() && p.active);
    if (promo) {
      setAppliedPromo(promo);
      if (window.showLuxuryToast) window.showLuxuryToast(`Promo code [${promo.code}] applied successfully.`);
    } else {
      if (window.showLuxuryToast) window.showLuxuryToast('Invalid or inactive privilege code.');
    }
  };

  // NOTE: handlePlaceOrder removed — PCI compliance fix.
  // Order creation requires Stripe payment confirmation (Phase 2).
  // The checkout flow now shows a "coming soon" placeholder at step 2.

  return (
    <div id="boutique-page-root" className="pt-28 pb-24 bg-black min-h-screen text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4 max-w-3xl">
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
              Curated Luxury Marketplace
            </span>
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
              THE <span className="font-serif italic font-light text-gold-200">BOUTIQUE</span>
            </h1>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              Discover selected physical designs, limited-run fashion drops, digital lookbooks, event access coordinates, and elite wellness formulations engineered by our ecosystem of ventures. Every purchase represents a distinct co-founder signature.
            </p>
          </div>

          {/* Quick Access Cart & Wishlist Headers */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="px-4 py-2.5 bg-neutral-950 border border-neutral-900 hover:border-gold-500/30 text-xs font-mono tracking-wider text-neutral-400 hover:text-white uppercase flex items-center gap-2 rounded cursor-pointer transition-all"
            >
              <Heart className="w-4 h-4 text-pink-500" />
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black text-xs font-bold tracking-widest uppercase flex items-center gap-2 rounded cursor-pointer transition-all shadow-[0_4px_15px_rgba(179,145,59,0.2)]"
            >
              <ShoppingBag className="w-4 h-4" />
              Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </button>
          </div>
        </div>

        {/* Search, Brand, and Category filters layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Side filter controls */}
          <div className="space-y-8 bg-[#030303] border border-neutral-900 p-6 rounded-lg self-start">
            
            {/* Search Input */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">Search Repertoire</span>
              <input
                type="text"
                placeholder="Ex. gold, linen, hoodie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded font-sans outline-none placeholder:text-neutral-600"
              />
            </div>

            {/* Brand Filter */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">Shop by Venture</span>
              <div className="flex flex-col gap-1">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBrand(b.id)}
                    className={`text-left p-2.5 rounded font-mono text-[10px] tracking-wider uppercase transition-colors flex justify-between items-center cursor-pointer ${
                      activeBrand === b.id
                        ? 'bg-gold-500/10 text-gold-400 font-bold border-l-2 border-gold-500 pl-3'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
                    }`}
                  >
                    <span>{b.name}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-700" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">Sort Collections</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded font-sans outline-none cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Limited Releases</option>
              </select>
            </div>

          </div>

          {/* Main Marketplace Grid */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Category horizontal filters bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-900">
              <span className="font-mono text-[10px] text-neutral-500 flex items-center gap-1 uppercase shrink-0 mr-2">
                <Filter className="w-3.5 h-3.5" /> Core Capsules:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-gold-500 text-black font-bold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900'
                  }`}
                >
                  {cat === 'All' ? 'All Repertoire' : cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const effectivePrice = p.salePrice || p.price;
                const hasDiscount = !!p.salePrice;

                return (
                  <div
                    key={p.id}
                    id={`boutique-product-card-${p.id}`}
                    className="group border border-neutral-900 bg-[#020202] rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-gold-500/30 hover:shadow-2xl"
                  >
                    {/* Media Block */}
                    <div 
                      onClick={() => setSelectedProduct(p)}
                      className="relative h-64 bg-neutral-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Brand Label */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-neutral-900 rounded font-mono text-[8px] tracking-widest text-gold-400 uppercase">
                        {p.brandName}
                      </span>

                      {/* Status Badges */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                        {p.soldOut && (
                          <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-500 text-[8px] font-mono rounded uppercase font-semibold">
                            SOLD OUT
                          </span>
                        )}
                        {p.comingSoon && (
                          <span className="px-2 py-0.5 bg-[#0d1b2a] border border-[#1b4965]/40 text-[#4895ef] text-[8px] font-mono rounded uppercase font-semibold">
                            COMING SOON
                          </span>
                        )}
                        {p.limitedDrop && !p.soldOut && (
                          <span className="px-2 py-0.5 bg-[#2d0a0a] border border-red-950 text-red-400 text-[8px] font-mono rounded uppercase font-semibold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> LIMITED DROP
                          </span>
                        )}
                        {p.preOrder && !p.soldOut && (
                          <span className="px-2 py-0.5 bg-gold-950/20 border border-gold-500/20 text-gold-400 text-[8px] font-mono rounded uppercase font-semibold">
                            PRE-ORDER
                          </span>
                        )}
                        {hasDiscount && !p.soldOut && !p.comingSoon && (
                          <span className="px-2 py-0.5 bg-green-950/20 border border-green-500/20 text-green-400 text-[8px] font-mono rounded uppercase font-semibold">
                            PRIVILEGE SALE
                          </span>
                        )}
                      </div>

                      {/* Floating actions on card */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(p.id);
                          }}
                          className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-pink-500 cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Meta Info Block */}
                    <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">
                            {p.category}
                          </span>
                          
                          {/* Average review rating */}
                          {p.reviews && p.reviews.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-gold-400 fill-current" />
                              <span className="font-mono text-[9px] text-neutral-300">
                                {(p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        <h3 
                          onClick={() => setSelectedProduct(p)}
                          className="font-sans font-bold text-sm text-white hover:text-gold-400 transition-colors cursor-pointer uppercase tracking-tight leading-tight line-clamp-1"
                        >
                          {p.name}
                        </h3>

                        <p className="text-neutral-500 text-xs leading-relaxed font-light line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-900/50 flex items-center justify-between">
                        {/* Price rendering */}
                        <div className="flex items-baseline gap-2">
                          {hasDiscount ? (
                            <>
                              <span className="text-sm font-bold text-white font-mono">
                                ${effectivePrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-neutral-600 line-through font-mono">
                                ${p.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-white font-mono">
                              ${p.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-neutral-600">USD</span>
                        </div>

                        {/* Quick buy/bag trigger */}
                        <button
                          onClick={() => addToCart(p, p.sizes?.[0], p.colors?.[0])}
                          disabled={p.soldOut || p.comingSoon}
                          className={`px-3 py-1.5 border font-mono text-[9px] tracking-wider uppercase rounded cursor-pointer transition-all ${
                            p.soldOut || p.comingSoon
                              ? 'border-neutral-900 text-neutral-600 cursor-not-allowed bg-transparent'
                              : 'border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black hover:border-transparent'
                          }`}
                        >
                          {p.soldOut ? 'SOLD OUT' : p.comingSoon ? 'SOON' : 'ADD TO BAG'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center space-y-4 border border-neutral-900 rounded-lg bg-neutral-950/20 max-w-lg mx-auto">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider">No products match</h3>
                <p className="text-neutral-500 text-xs max-w-xs mx-auto">Try resetting your filters or exploring another core capsule.</p>
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setActiveBrand('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white rounded font-mono text-[9px] uppercase tracking-widest cursor-pointer"
                >
                  Reset Selection
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* IMMERSIVE PRODUCT DETAIL LIGHTBOX */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-5xl bg-[#030303] border border-neutral-900 rounded-lg overflow-hidden my-8 shadow-2xl">
              
              <div className="grid grid-cols-1 lg:grid-cols-2">
                
                {/* Visual side */}
                <div className="space-y-4 p-8 bg-neutral-950 flex flex-col justify-between border-r border-neutral-900">
                  <div className="relative aspect-square bg-[#050505] rounded overflow-hidden">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Action floating buttons */}
                    <button
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="absolute top-4 right-4 p-2.5 bg-black/80 backdrop-blur-md border border-neutral-900 rounded-full text-neutral-400 hover:text-pink-500 cursor-pointer transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>
                  </div>

                  {/* Multi-image gallery carousel preview if more images */}
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {selectedProduct.images.map((img, i) => (
                        <div key={i} className="aspect-square bg-[#050505] rounded overflow-hidden border border-neutral-900 hover:border-gold-500 transition-colors cursor-pointer">
                          <img src={img} alt="gallery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Curated notes */}
                  <div className="p-4 border border-neutral-900/60 bg-neutral-950 rounded flex gap-3 items-start">
                    <FileText className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-gold-400 tracking-wider block uppercase">Co-Founder Strategic Alignment</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                        This item was engineered as a collaboration with {selectedProduct.brandName}. Profits from our marketplace support joint creative labs and developmental modeling initiatives.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical data & configuration side */}
                <div className="p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[90vh]">
                  
                  {/* Header metadata */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] tracking-widest text-gold-300 border border-gold-500/20 bg-gold-950/20 px-2.5 py-1 rounded uppercase">
                        {selectedProduct.category}
                      </span>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-neutral-500 hover:text-white font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                      >
                        [CLOSE]
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                        Venture Brand: {selectedProduct.brandName}
                      </span>
                      <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase leading-tight">
                        {selectedProduct.name}
                      </h2>
                    </div>

                    {/* Star evaluation */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5 text-gold-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-neutral-400 uppercase">
                        ({selectedProduct.reviews?.length || 0} customer reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2.5 pt-2">
                      {selectedProduct.salePrice ? (
                        <>
                          <span className="text-2xl font-bold text-white font-mono">
                            ${selectedProduct.salePrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-neutral-500 line-through font-mono">
                            ${selectedProduct.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-white font-mono">
                          ${selectedProduct.price.toLocaleString()}
                        </span>
                      )}
                      <span className="text-xs font-mono text-neutral-500">USD + taxes</span>
                    </div>

                    <div className="h-[1px] bg-neutral-900"></div>

                    {/* Overview description */}
                    <div className="space-y-3">
                      <h4 className="font-sans font-semibold text-xs tracking-wider text-neutral-400 uppercase">
                        Product Specification
                      </h4>
                      <p className="text-neutral-400 text-xs leading-relaxed font-light">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Select Size Option if available */}
                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="font-mono text-[9px] text-neutral-500 tracking-wider block uppercase">Select Size:</span>
                        <div className="flex gap-2">
                          {selectedProduct.sizes.map((s) => (
                            <button
                              key={s}
                              className="px-3 py-1.5 bg-neutral-950 border border-neutral-900 hover:border-gold-500 text-[10px] font-mono text-white rounded cursor-pointer"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Select Color Option if available */}
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="font-mono text-[9px] text-neutral-500 tracking-wider block uppercase">Select Finish/Color:</span>
                        <div className="flex gap-2">
                          {selectedProduct.colors.map((c) => (
                            <button
                              key={c}
                              className="px-3 py-1.5 bg-neutral-950 border border-neutral-900 hover:border-gold-500 text-[10px] font-mono text-white rounded cursor-pointer"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive digital downloads / lookbook triggers */}
                    {(selectedProduct.digitalDownloadUrl || selectedProduct.pdfCatalogUrl) && (
                      <div className="p-4 bg-gold-950/10 border border-gold-500/15 rounded space-y-2">
                        <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest block flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" /> ATTACHED DIGITAL ASSET INCLUDED
                        </span>
                        <p className="text-neutral-400 text-[10px] leading-relaxed font-light">
                          Purchasing this product unlocks {selectedProduct.pdfCatalogName || 'the high-fidelity catalog PDF specification file'} instantly.
                        </p>
                        {selectedProduct.price === 0 && (
                          <a
                            href={selectedProduct.digitalDownloadUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-black font-mono text-[9px] tracking-widest uppercase font-bold rounded cursor-pointer transition-all"
                          >
                            <Download className="w-3 h-3" /> Download Catalog
                          </a>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Add to Bag and checkout triggers */}
                  <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, selectedProduct.sizes?.[0], selectedProduct.colors?.[0]);
                        setSelectedProduct(null);
                        setIsCartOpen(true);
                      }}
                      disabled={selectedProduct.soldOut || selectedProduct.comingSoon}
                      className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest transition-colors cursor-pointer uppercase rounded"
                    >
                      {selectedProduct.soldOut ? 'OUT OF STOCK' : selectedProduct.comingSoon ? 'COMING SOON' : 'SECURE ITEM & CHECKOUT'}
                    </button>
                  </div>

                  {/* Product Editorial Reviews Hub */}
                  <div className="space-y-4 pt-6 border-t border-neutral-900">
                    <h4 className="font-sans font-bold text-xs tracking-wider text-white uppercase flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-gold-400" /> Customer Reviews ({selectedProduct.reviews?.length || 0})
                    </h4>

                    {/* Review submission panel */}
                    <form onSubmit={submitReview} className="space-y-3 bg-[#070707] border border-neutral-900 p-4 rounded">
                      <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase block">Add Editorial Review</span>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Name"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-2 text-white rounded outline-none"
                          required
                        />
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-2 text-white rounded outline-none cursor-pointer"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Share your experience regarding craftsmanship, materials, or delivery..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-2.5 text-white rounded outline-none h-16 resize-none"
                        required
                      ></textarea>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500 hover:text-black font-mono text-[9px] tracking-widest uppercase rounded cursor-pointer transition-all"
                      >
                        Publish Review
                      </button>
                    </form>

                    {/* Past reviews stack */}
                    <div className="space-y-4 divide-y divide-neutral-900 max-h-48 overflow-y-auto">
                      {selectedProduct.reviews && selectedProduct.reviews.map((r) => (
                        <div key={r.id} className="pt-3 first:pt-0 space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-white font-bold">{r.user}</span>
                            <span className="text-neutral-600">{r.date}</span>
                          </div>
                          <div className="flex gap-0.5 text-gold-400">
                            {Array.from({ length: r.rating }).map((_, idx) => (
                              <Star key={idx} className="w-2.5 h-2.5 fill-current" />
                            ))}
                          </div>
                          <p className="text-neutral-400 text-xs leading-relaxed font-light font-sans">
                            {r.comment}
                          </p>
                        </div>
                      ))}
                      {(!selectedProduct.reviews || selectedProduct.reviews.length === 0) && (
                        <p className="text-neutral-600 text-xs italic font-light">Be the first to review this elite co-founder asset.</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOPPING BAG SIDEBAR OVERLAY DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#020202] border-l border-neutral-900 z-50 flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                  <span className="font-mono text-[10px] tracking-widest text-gold-400 uppercase block">Curated Shopping Bag</span>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 border border-neutral-900 hover:border-neutral-700 rounded text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto divide-y divide-neutral-900 pr-1 scrollbar-thin scrollbar-thumb-neutral-900">
                  {cart.map((item, idx) => {
                    const price = item.product.salePrice || item.product.price;
                    return (
                      <div key={idx} className="pt-4 first:pt-0 flex gap-4">
                        <div className="w-16 h-16 rounded overflow-hidden bg-neutral-950 shrink-0 border border-neutral-900">
                          <img src={item.product.images[0]} alt="product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow space-y-1">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase">{item.product.brandName}</span>
                          <h4 className="font-sans font-bold text-xs text-white uppercase">{item.product.name}</h4>
                          <div className="flex items-center gap-4 pt-1">
                            {/* Quantity controls */}
                            <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded p-0.5">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, -1, item.selectedSize, item.selectedColor)}
                                className="p-1 text-neutral-500 hover:text-white cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="font-mono text-xs text-white px-2">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, 1, item.selectedSize, item.selectedColor)}
                                className="p-1 text-neutral-500 hover:text-white cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                              className="text-neutral-600 hover:text-red-500 font-mono text-[10px] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-bold text-white">${(price * item.quantity).toLocaleString()}</span>
                          <span className="block text-[8px] text-neutral-600 font-mono">USD</span>
                        </div>
                      </div>
                    );
                  })}
                  {cart.length === 0 && (
                    <div className="py-12 text-center text-neutral-500 text-xs italic font-light">Your shopping bag is empty.</div>
                  )}
                </div>

              </div>

              {/* Summary and Stripe checkout entry point */}
              {cart.length > 0 && (
                <div className="border-t border-neutral-900 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                    <span>Privilege Subtotal:</span>
                    <span className="text-white font-bold">${getSubtotal().toLocaleString()} USD</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckingOut(true);
                      setCheckoutStep(1);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black text-xs font-extrabold tracking-widest uppercase rounded flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_20px_rgba(179,145,59,0.25)]"
                  >
                    <CreditCard className="w-4 h-4" />
                    PROCEED TO STRIPE CHECKOUT
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WISHLIST SIDEBAR OVERLAY DRAWER */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#020202] border-l border-neutral-900 z-50 flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                  <span className="font-mono text-[10px] tracking-widest text-gold-400 uppercase block">Private Luxury Wishlist</span>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="p-1 border border-neutral-900 hover:border-neutral-700 rounded text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Wishlist Items Stack */}
                <div className="space-y-4 divide-y divide-neutral-900">
                  {wishlist.map(id => {
                    const item = products.find(p => p.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="pt-4 first:pt-0 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded overflow-hidden bg-neutral-950 border border-neutral-900 shrink-0">
                          <img src={item.images[0]} alt="wishlist" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase">{item.brandName}</span>
                          <h4 className="font-sans font-bold text-xs text-white uppercase">{item.name}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              addToCart(item, item.sizes?.[0], item.colors?.[0]);
                              toggleWishlist(item.id);
                            }}
                            className="p-2 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black rounded transition-all cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleWishlist(item.id)}
                            className="p-2 border border-neutral-900 text-neutral-500 hover:text-red-500 hover:border-red-500/20 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {wishlist.length === 0 && (
                    <div className="py-12 text-center text-neutral-500 text-xs italic font-light">Your private wishlist is empty.</div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SECURE STRIPE CHECKOUT MODAL OVERLAY */}
      <AnimatePresence>
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-4xl bg-[#030303] border border-neutral-900 rounded-lg overflow-hidden my-8 shadow-2xl">
              
              <div className="p-5 border-b border-neutral-900 bg-[#070707] flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-widest text-gold-400 uppercase block flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-gold-400" /> SECURE SSL ENCRYPTED checkout (STRIPE SANDBOX)
                </span>
                <button
                  onClick={() => setIsCheckingOut(false)}
                  className="text-neutral-500 hover:text-white font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                >
                  [ABANDON]
                </button>
              </div>

              {checkoutStep < 3 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Column - checkout inputs */}
                  <div className="lg:col-span-7 p-8 space-y-6 border-r border-neutral-900 max-h-[80vh] overflow-y-auto">
                    
                    {/* Step indicator breadcrumbs */}
                    <div className="flex items-center gap-3 border-b border-neutral-900/60 pb-4">
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${checkoutStep === 1 ? 'text-gold-400 font-bold' : 'text-neutral-500'}`}>1. Shipping details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-700" />
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${checkoutStep === 2 ? 'text-gold-400 font-bold' : 'text-neutral-500'}`}>2. Review &amp; Confirm</span>
                    </div>

                    {/* Step 1 Form */}
                    {checkoutStep === 1 && (
                      <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }} className="space-y-4">
                        <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">Shipping Address</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">First Name</label>
                            <input
                              type="text"
                              required
                              value={shippingForm.firstName}
                              onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">Last Name</label>
                            <input
                              type="text"
                              required
                              value={shippingForm.lastName}
                              onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">Secure Email</label>
                            <input
                              type="email"
                              required
                              value={shippingForm.email}
                              onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">Phone Number</label>
                            <input
                              type="tel"
                              required
                              value={shippingForm.phone}
                              onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase">Residential/Business Address</label>
                          <input
                            type="text"
                            required
                            value={shippingForm.address}
                            onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">City</label>
                            <input
                              type="text"
                              required
                              value={shippingForm.city}
                              onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">Postal Code</label>
                            <input
                              type="text"
                              required
                              value={shippingForm.postalCode}
                              onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase">Country</label>
                            <select
                              value={shippingForm.country}
                              onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none cursor-pointer"
                            >
                              <option value="United States">United States</option>
                              <option value="France">France</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Canada">Canada</option>
                            </select>
                          </div>
                        </div>

                        {/* Shipping method selection */}
                        <div className="space-y-2 pt-3">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase block">Select Carrier Services</span>
                          <div className="grid grid-cols-2 gap-3">
                            <label className={`p-4 border rounded cursor-pointer flex flex-col justify-between transition-colors ${
                              shippingMethod === 'standard' ? 'border-gold-500 bg-gold-950/5' : 'border-neutral-900 hover:border-neutral-800'
                            }`}>
                              <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="sr-only" />
                              <span className="font-mono text-xs text-white font-bold uppercase">Standard Premium</span>
                              <span className="text-[10px] text-neutral-500 leading-relaxed font-light">3-7 business days. Fully tracked.</span>
                              <span className="font-mono text-xs font-bold text-gold-400 pt-1">$15 USD</span>
                            </label>
                            <label className={`p-4 border rounded cursor-pointer flex flex-col justify-between transition-colors ${
                              shippingMethod === 'express' ? 'border-gold-500 bg-gold-950/5' : 'border-neutral-900 hover:border-neutral-800'
                            }`}>
                              <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="sr-only" />
                              <span className="font-mono text-xs text-white font-bold uppercase">Consolidated Express</span>
                              <span className="text-[10px] text-neutral-500 leading-relaxed font-light">1-3 business days. Overnight courier.</span>
                              <span className="font-mono text-xs font-bold text-gold-400 pt-1">$35 USD</span>
                            </label>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest uppercase rounded cursor-pointer transition-colors"
                        >
                          PROCEED TO PAYMENT PRESET
                        </button>
                      </form>
                    )}

                    {/* Step 2 — Secure Checkout Coming Soon (PCI-safe placeholder) */}
                    {checkoutStep === 2 && (
                      <div className="space-y-6">
                        <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-gold-400" />
                          Secure Payment
                        </h3>

                        {/* Coming Soon Card */}
                        <div className="border border-gold-500/20 bg-gold-950/10 rounded-lg p-8 text-center space-y-5">
                          <div className="w-14 h-14 rounded-full border border-gold-500/30 bg-gold-500/5 flex items-center justify-center mx-auto">
                            <CreditCard className="w-6 h-6 text-gold-400" />
                          </div>

                          <div className="space-y-2">
                            <span className="font-mono text-[9px] tracking-[0.4em] text-gold-400 uppercase block">
                              Stripe Integration — Phase 2
                            </span>
                            <h4 className="font-sans font-bold text-base text-white uppercase tracking-wide">
                              Secure Checkout Coming Soon
                            </h4>
                            <p className="text-neutral-400 text-xs max-w-xs mx-auto leading-relaxed font-light">
                              We are integrating Stripe Elements for fully PCI-compliant, server-side
                              payment processing. Your shipping details have been saved.
                            </p>
                          </div>

                          {/* Order summary preview */}
                          <div className="text-left bg-[#070707] border border-neutral-900 rounded p-4 space-y-2">
                            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">Order Summary</span>
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-neutral-400">Subtotal</span>
                              <span className="text-white">${getSubtotal().toLocaleString()} USD</span>
                            </div>
                            {appliedPromo && (
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-green-400">Promo ({appliedPromo.code})</span>
                                <span className="text-green-400">-${getDiscount().toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-neutral-400">Shipping ({shippingMethod})</span>
                              <span className="text-white">${getShippingFee()} USD</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono border-t border-neutral-900 pt-2 mt-2">
                              <span className="text-white font-bold">Total</span>
                              <span className="text-gold-400 font-bold">${getTotal().toFixed(2)} USD</span>
                            </div>
                          </div>

                          {/* Notify me CTA */}
                          <button
                            onClick={() => {
                              if (window.showLuxuryToast) window.showLuxuryToast('You will be notified when Stripe checkout goes live.');
                            }}
                            className="w-full py-3 bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-mono text-[10px] tracking-widest uppercase font-bold rounded cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            Notify Me When Payment is Live
                          </button>
                        </div>

                        {/* Back button */}
                        <button
                          onClick={() => setCheckoutStep(1)}
                          className="px-5 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white rounded font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
                        >
                          ← Back to Shipping
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Right Column - order summary pricing metrics */}
                  <div className="lg:col-span-5 p-8 bg-[#020202] flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                    <div className="space-y-6">
                      <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">Purchase Summary</h3>
                      
                      {/* Cart item summaries */}
                      <div className="space-y-3 max-h-40 overflow-y-auto divide-y divide-neutral-900 pr-1 scrollbar-thin scrollbar-thumb-neutral-900">
                        {cart.map((item, idx) => {
                          const price = item.product.salePrice || item.product.price;
                          return (
                            <div key={idx} className="pt-2.5 first:pt-0 flex justify-between text-xs font-light">
                              <span className="text-neutral-400 uppercase font-sans line-clamp-1">{item.product.name} (x{item.quantity})</span>
                              <span className="font-mono text-white shrink-0 font-medium">${(price * item.quantity).toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="h-[1px] bg-neutral-900"></div>

                      {/* Privilege Promo validation input */}
                      <div className="space-y-2">
                        <span className="font-mono text-[8px] text-neutral-500 uppercase block">Privilege Code Entry</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="WELCOME10, ELITE20, etc."
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            className="flex-grow bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-2.5 text-white rounded outline-none uppercase placeholder:text-neutral-800"
                          />
                          <button
                            type="button"
                            onClick={applyPromoCode}
                            className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-gold-500/20 text-neutral-300 font-mono text-[9px] uppercase tracking-widest cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {appliedPromo && (
                          <span className="text-green-400 text-[9px] font-mono flex items-center gap-1 uppercase">
                            <Check className="w-3 h-3" /> Privilege code [{appliedPromo.code}] applied successfully!
                          </span>
                        )}
                      </div>

                      <div className="h-[1px] bg-neutral-900"></div>

                      {/* Pricing formulas */}
                      <div className="space-y-3.5 text-xs font-mono">
                        <div className="flex justify-between text-neutral-500">
                          <span>Subtotal:</span>
                          <span className="text-white">${getSubtotal().toLocaleString()} USD</span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-green-400">
                            <span>Promo Discount:</span>
                            <span>-${getDiscount().toLocaleString()} USD</span>
                          </div>
                        )}
                        <div className="flex justify-between text-neutral-500">
                          <span>Luxury Tax (8.5%):</span>
                          <span className="text-white">${getTax().toLocaleString()} USD</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Courier Shipping:</span>
                          <span className="text-white">${getShippingFee().toLocaleString()} USD</span>
                        </div>
                        <div className="h-[1px] bg-neutral-900"></div>
                        <div className="flex justify-between text-sm text-gold-300 font-bold">
                          <span>Total Payment:</span>
                          <span>${getTotal().toLocaleString()} USD</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              ) : (
                
                /* Immersive checkout complete success page with receipt printing and digital links */
                <div className="p-12 text-center space-y-6 max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-gold-400 tracking-[0.3em] uppercase block">SSL TRANSACTION APPROVED</span>
                    <h2 className="font-sans font-extrabold text-3xl text-white uppercase tracking-tight">ORDER COMPLETE</h2>
                    <p className="text-neutral-400 text-xs leading-relaxed font-light">
                      Your premium order has been recorded and authenticated with Stripe. A secure confirmation email receipt was dispatched to <strong>{shippingForm.email}</strong> under license with TheMainKeys.
                    </p>
                  </div>

                  {/* Order credentials plate */}
                  <div className="bg-[#070707] border border-neutral-900 p-5 rounded space-y-3 font-mono text-[10px] text-left">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Order ID:</span>
                      <span className="text-white font-bold">{placedOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Courier tracking:</span>
                      <span className="text-gold-400 hover:underline cursor-pointer">TRK-{(9183901 + Math.floor(Math.random() * 1000000))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Customer:</span>
                      <span className="text-white">{shippingForm.firstName} {shippingForm.lastName}</span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setIsCheckingOut(false);
                        setCheckoutStep(1);
                        setPlacedOrderId(null);
                        setAppliedPromo(null);
                      }}
                      className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest uppercase rounded cursor-pointer"
                    >
                      CONTINUE EXPLORING
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-3 border border-neutral-800 text-neutral-400 hover:text-white rounded font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                    >
                      PRINT RECEIPT
                    </button>
                  </div>
                </div>

              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
