/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import VenturesGrid from './components/VenturesGrid';
import AdminDashboard from './components/AdminDashboard';

// Public pages
import FashionPage from './pages/FashionPage';
import ModelingPage from './pages/ModelingPage';
import FoundersPage from './pages/FoundersPage';
import BrandDetailPage from './pages/BrandDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import MediaPage from './pages/MediaPage';
import ContactPage from './pages/ContactPage';
import BoutiquePage from './pages/BoutiquePage';
import JournalPage from './pages/JournalPage';

// Types & Pre-seeded Data
import { Brand, Founder, MediaItem, ModelingItem, ProjectItem, PageSeo, Product, Order, PromoCode } from './types';
import { 
  INITIAL_BRANDS, 
  INITIAL_FOUNDERS, 
  INITIAL_MEDIA_ITEMS, 
  INITIAL_MODELING_ITEMS, 
  INITIAL_PROJECTS,
  INITIAL_PRODUCTS,
  INITIAL_PROMO_CODES
} from './data';

import { Play, Sparkles, Filter } from 'lucide-react';
import Toast from './components/Toast';
import { LanguageProvider } from './components/LanguageContext';

declare global {
  interface Window {
    showLuxuryToast?: (message: string) => void;
  }
}

const INITIAL_PAGE_SEO: PageSeo[] = [
  { view: 'home', title: 'TheMainKeys - Venture Builder & Luxury Studio', description: 'Orchestrating the future of luxury and technology through custom software, high-fashion branding, and curated hospitality ventures.', ogImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200' },
  { view: 'brands', title: 'Curated Brands & Ventures - TheMainKeys', description: 'Explore our portfolio of high-fidelity venture holdings, luxury design capsules, and computational software solutions.', ogImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200' },
  { view: 'fashion', title: 'Fashion House Curation - TheMainKeys', description: 'Bespoke apparel, limited streetwear collections, and high-fashion capsules crafted in Parisian and Miami designer studios.', ogImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200' },
  { view: 'modeling', title: 'Elite Modeling Portfolio - TheMainKeys', description: 'High-fashion editorial campaigns and brand lifestyle portraits highlighting premier aesthetic principles.', ogImage: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200' },
  { view: 'founders', title: 'Our Founders & Leadership - TheMainKeys', description: 'Meet the elite strategists, technologists, and designers steering the ventures of the TheMainKeys network.', ogImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200' },
  { view: 'projects', title: 'High-Fidelity Software Projects - TheMainKeys', description: 'Discover custom systems, creative interactive installations, and digital orchestration platforms designed by our team.', ogImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200' },
  { view: 'media', title: 'Media & Asset Library - TheMainKeys', description: 'Access official press kits, download vector assets, and view behind-the-scenes digital lookbooks.', ogImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200' },
  { view: 'boutique', title: 'The Curated Boutique Marketplace - TheMainKeys', description: 'Acquire limited luxury design drops, active fashion garments, digital catalogs, and signature wellness formulations.', ogImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200' },
  { view: 'journal', title: 'The Journal & Design Chronicles - TheMainKeys', description: 'Deep editorial insights, material science disclosures, and co-founder logs charting the frontier of design.', ogImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200' },
  { view: 'contact', title: 'Private Concierge Desk - TheMainKeys', description: 'Request private consultation, initiate venture financing dialogues, or contact our Miami Design District headquarters.', ogImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200' },
];

export function AppContent() {
  // Navigation states
  const [view, setView] = useState<string>('home');
  const [toast, setToast] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedFounderId, setSelectedFounderId] = useState<string | null>(null);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [brandFilter, setBrandFilter] = useState<'all' | 'active' | 'soon' | 'client'>('all');

  // Database States (persistent in localStorage for scalable CMS interaction)
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('tmk_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  const [founders, setFounders] = useState<Founder[]>(() => {
    const saved = localStorage.getItem('tmk_founders');
    return saved ? JSON.parse(saved) : INITIAL_FOUNDERS;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('tmk_media_items');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  const [modelingItems, setModelingItems] = useState<ModelingItem[]>(() => {
    const saved = localStorage.getItem('tmk_modeling_items');
    return saved ? JSON.parse(saved) : INITIAL_MODELING_ITEMS;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('tmk_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tmk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tmk_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('tmk_promo_codes');
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('tmk_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('tmk_founders', JSON.stringify(founders));
  }, [founders]);

  useEffect(() => {
    localStorage.setItem('tmk_media_items', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('tmk_modeling_items', JSON.stringify(modelingItems));
  }, [modelingItems]);

  useEffect(() => {
    localStorage.setItem('tmk_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tmk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tmk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tmk_promo_codes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const [pageSeo, setPageSeo] = useState<PageSeo[]>(() => {
    const saved = localStorage.getItem('tmk_page_seo');
    return saved ? JSON.parse(saved) : INITIAL_PAGE_SEO;
  });

  useEffect(() => {
    localStorage.setItem('tmk_page_seo', JSON.stringify(pageSeo));
  }, [pageSeo]);

  // Dynamic Head Injection for SEO metadata discoverability
  useEffect(() => {
    let title = 'TheMainKeys - Venture Builder & Luxury Studio';
    let desc = 'Orchestrating the future of luxury and technology.';
    let ogImage = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200';

    if (view === 'brand-detail' && selectedBrandId) {
      const activeBrand = brands.find(b => b.id === selectedBrandId);
      if (activeBrand) {
        title = activeBrand.metaTitle || `${activeBrand.name} - Brand System`;
        desc = activeBrand.metaDesc || activeBrand.description;
        ogImage = activeBrand.ogImage || activeBrand.coverImage || activeBrand.logo || ogImage;
      }
    } else {
      const match = pageSeo.find(p => p.view === view);
      if (match) {
        title = match.title;
        desc = match.description;
        ogImage = match.ogImage || ogImage;
      }
    }

    // Apply to DOM
    document.title = title;
    
    // Find or create meta description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute('content', desc);

    // Find or create og:title
    let ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (!ogTitleEl) {
      ogTitleEl = document.createElement('meta');
      ogTitleEl.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleEl);
    }
    ogTitleEl.setAttribute('content', title);

    // Find or create og:description
    let ogDescEl = document.querySelector('meta[property="og:description"]');
    if (!ogDescEl) {
      ogDescEl = document.createElement('meta');
      ogDescEl.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescEl);
    }
    ogDescEl.setAttribute('content', desc);

    // Find or create og:image
    let ogImgEl = document.querySelector('meta[property="og:image"]');
    if (!ogImgEl) {
      ogImgEl = document.createElement('meta');
      ogImgEl.setAttribute('property', 'og:image');
      document.head.appendChild(ogImgEl);
    }
    ogImgEl.setAttribute('content', ogImage);

  }, [view, selectedBrandId, brands, pageSeo]);

  // Reset scroll on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, selectedBrandId, selectedFounderId]);

  // Bind custom toast notifier
  useEffect(() => {
    window.showLuxuryToast = (msg: string) => {
      setToast(msg);
    };
    return () => {
      window.showLuxuryToast = undefined;
    };
  }, []);

  // Helper: Navigate to specific brand details page
  const handleBrandClick = (id: string) => {
    setSelectedBrandId(id);
    setView('brand-detail');
  };

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  return (
    <div id="app-viewport-container" className="min-h-screen bg-[#050505] text-neutral-300 font-sans flex flex-col justify-between selection:bg-gold-500 selection:text-black">
      
      {/* Global Navigation Header (hidden inside Admin Panel to preserve full-screen layout matches) */}
      {view !== 'admin' && (
        <Header
          currentView={view}
          setView={setView}
          setSelectedBrandId={setSelectedBrandId}
          setSelectedFounderId={setSelectedFounderId}
        />
      )}

      {/* Main Page Layout Wrapper */}
      <div id="main-content-canvas" className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE VIEW */}
          {view === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Cinematic hero section */}
              <Hero
                onExploreClick={() => setView('brands')}
                onWatchShowreelClick={() => setIsShowreelOpen(true)}
              />

              {/* Animated Ventures Grid */}
              <VenturesGrid
                brands={brands}
                onBrandClick={handleBrandClick}
              />
            </motion.div>
          )}

          {/* BRANDS / VENTURES BROWSER VIEW */}
          {view === 'brands' && (
            <motion.div
              key="brands-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
                <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
                  Studio Ecosystem Portfolio
                </span>
                <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
                  BRANDS & <span className="font-serif italic font-light text-gold-200">VENTURES</span>
                </h1>
                <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
                  We distinguish clearly between self-owned studio Ventures, our physical Wellness programs, Brand Collaborations, and high-end fashion lines. Click on any venture card to access interactive case studies, brand lookbooks, and catalogs.
                </p>
              </div>

              {/* Luxury Filter Toggle Bar */}
              <div className="flex flex-wrap gap-3 mb-16 relative z-20">
                {[
                  { id: 'all', label: 'All Ventures' },
                  { id: 'active', label: 'Active Ventures' },
                  { id: 'soon', label: 'Coming Soon' },
                  { id: 'client', label: 'Client Projects' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`filter-brand-${tab.id}`}
                    onClick={() => setBrandFilter(tab.id as any)}
                    className={`px-5 py-2.5 rounded font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                      brandFilter === tab.id
                        ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-bold border-transparent shadow-[0_4px_20px_rgba(242,125,38,0.25)]'
                        : 'bg-neutral-950 border-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Separate by distinct groups as requested */}
              {(() => {
                const availableGroups = ['TheMainKeys Ventures', 'Brand Collaborations', 'Fashion Collaborations', 'Hospitality Partnerships', 'Client Projects', 'Technology Projects'];
                
                // Track total matched brands
                let totalMatched = 0;

                const groupsToRender = availableGroups.map((cat) => {
                  const groupBrands = brands.filter((b) => {
                    if (b.category !== cat) return false;
                    if (brandFilter === 'active') return b.status === 'Active' && b.category !== 'Client Projects';
                    if (brandFilter === 'soon') return b.status === 'Coming Soon';
                    if (brandFilter === 'client') return b.category === 'Client Projects';
                    return true;
                  });

                  totalMatched += groupBrands.length;
                  if (groupBrands.length === 0) return null;

                  return (
                    <div key={cat} id={`brand-cat-group-${cat.replace(/\s+/g, '-').toLowerCase()}`} className="mb-20 space-y-8">
                      <h2 className="font-sans font-bold text-lg tracking-wider text-white uppercase border-b border-neutral-900 pb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                        {cat}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupBrands.map((b) => {
                          const isSoon = b.status === 'Coming Soon';
                          return (
                            <div
                              key={b.id}
                              id={`category-brand-${b.id}`}
                              onClick={() => !isSoon && handleBrandClick(b.id)}
                              className={`p-6 border border-neutral-900 bg-neutral-950/30 rounded-lg flex flex-col justify-between h-[280px] transition-all duration-300 ${
                                isSoon
                                  ? 'opacity-65 cursor-not-allowed'
                                  : 'hover:border-gold-400/40 hover:bg-neutral-950 hover:shadow-lg cursor-pointer'
                              }`}
                            >
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                                    {b.status}
                                  </span>
                                  {isSoon && (
                                    <span className="px-2 py-0.5 border border-gold-500/20 bg-gold-950/20 text-[8px] font-mono text-gold-400 rounded uppercase">
                                      COMING SOON
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-sans font-bold text-lg text-white group-hover:text-gold-300 uppercase leading-snug">
                                  {b.name}
                                </h3>
                                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 font-light">
                                  {b.description}
                                </p>
                              </div>

                              <div className="pt-4 border-t border-neutral-900/60 flex items-center justify-between">
                                <span className="font-mono text-[8px] text-neutral-600 uppercase">
                                  Managed by TheMainKeys
                                </span>
                                {!isSoon && (
                                  <span className="text-gold-400 hover:text-white font-sans text-[10px] tracking-wider uppercase font-semibold">
                                    Explore Venture →
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });

                if (totalMatched === 0) {
                  return (
                    <div className="text-center py-20 border border-neutral-900 rounded-xl bg-neutral-950/20 max-w-lg mx-auto">
                      <Filter className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                      <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-2">No Ventures Found</h3>
                      <p className="text-neutral-500 text-xs max-w-xs mx-auto">There are currently no brands registered under this filtered category.</p>
                    </div>
                  );
                }

                return <>{groupsToRender}</>;
              })()}
            </motion.div>
          )}

          {/* DETAILED BRAND PAGE (CLÉ Paris, Pier St Barth, Cuffed Design, Sorority etc.) */}
          {view === 'brand-detail' && selectedBrand && (
            <motion.div
              key="brand-detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BrandDetailPage
                brand={selectedBrand}
                founders={founders}
                mediaItems={mediaItems}
                onBackClick={() => setView('brands')}
              />
            </motion.div>
          )}

          {/* FASHION PAGE VIEW */}
          {view === 'fashion' && (
            <motion.div
              key="fashion-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <FashionPage
                brands={brands}
                mediaItems={mediaItems}
                onBrandClick={handleBrandClick}
                setView={setView}
              />
            </motion.div>
          )}

          {/* MODELING PORTFOLIO VIEW */}
          {view === 'modeling' && (
            <motion.div
              key="modeling-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <ModelingPage modelingItems={modelingItems} />
            </motion.div>
          )}

          {/* FOUNDERS & LEADERS VIEW */}
          {view === 'founders' && (
            <motion.div
              key="founders-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <FoundersPage
                founders={founders}
                brands={brands}
                onBrandClick={handleBrandClick}
              />
            </motion.div>
          )}

          {/* PROJECTS PORTFOLIO VIEW */}
          {view === 'projects' && (
            <motion.div
              key="projects-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <ProjectsPage
                projects={projects}
                brands={brands}
                onBrandClick={handleBrandClick}
              />
            </motion.div>
          )}

          {/* MEDIA LIBRARY PUBLIC VIEW */}
          {view === 'media' && (
            <motion.div
              key="media-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <MediaPage mediaItems={mediaItems} />
            </motion.div>
          )}

          {/* CONTACT INTAKE VIEW */}
          {view === 'contact' && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <ContactPage />
            </motion.div>
          )}

          {/* BOUTIQUE VIEW */}
          {view === 'boutique' && (
            <motion.div
              key="boutique-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <BoutiquePage
                products={products}
                setProducts={setProducts}
                orders={orders}
                setOrders={setOrders}
                promoCodes={promoCodes}
              />
            </motion.div>
          )}

          {/* JOURNAL EDITORIAL VIEW */}
          {view === 'journal' && (
            <motion.div
              key="journal-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <JournalPage />
            </motion.div>
          )}

          {/* ADMIN CMS DASHBOARD */}
          {view === 'admin' && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AdminDashboard
                brands={brands}
                founders={founders}
                mediaItems={mediaItems}
                modelingItems={modelingItems}
                projects={projects}
                setBrands={setBrands}
                setFounders={setFounders}
                setMediaItems={setMediaItems}
                setModelingItems={setModelingItems}
                setProjects={setProjects}
                pageSeo={pageSeo}
                setPageSeo={setPageSeo}
                products={products}
                setProducts={setProducts}
                orders={orders}
                setOrders={setOrders}
                promoCodes={promoCodes}
                setPromoCodes={setPromoCodes}
                onExit={() => setView('home')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Global Footer (hidden on Admin view) */}
      {view !== 'admin' && (
        <Footer
          setView={setView}
          setSelectedBrandId={setSelectedBrandId}
          setSelectedFounderId={setSelectedFounderId}
        />
      )}

      {/* Cinematic Showreel Lightbox Modal */}
      <AnimatePresence>
        {isShowreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-neutral-900 flex justify-between items-center">
                <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current text-gold-400" />
                  THEMAINKEYS VENTURES SHOWREEL
                </h3>
                <button
                  onClick={() => setIsShowreelOpen(false)}
                  className="text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>
              
              {/* Cinematic player slate */}
              <div className="aspect-video bg-black flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full border border-gold-500/20 bg-gold-500/5 flex items-center justify-center">
                  <Play className="w-5 h-5 text-gold-400 fill-current" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-gold-400 tracking-widest uppercase block">STREAMING CONNECTIVITY</span>
                  <p className="text-neutral-400 text-xs max-w-md mx-auto">
                    Simulating cinematic creative showcase for <strong>TheMainKeys Ventures 2026 Compilation</strong>. Media files are encrypted to preserve direct visual rights.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Luxury Toast Notification System */}
      <Toast message={toast} onClose={() => setToast(null)} />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
