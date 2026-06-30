/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Play } from 'lucide-react';

// Layout components (not lazy — small and always needed)
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { LanguageProvider } from './components/LanguageContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import LoadingSkeleton from './components/ui/LoadingSkeleton';
import PageTransition from './components/ui/PageTransition';

// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute';

// ---------------------------------------------------------------------------
// Lazy-loaded pages (code splitting — each becomes its own JS chunk)
// ---------------------------------------------------------------------------
const HomePage       = lazy(() => import('./pages/HomePage'));
const BrandsPage     = lazy(() => import('./pages/BrandsPage'));
const FashionPage    = lazy(() => import('./pages/FashionPage'));
const ModelingPage   = lazy(() => import('./pages/ModelingPage'));
const FoundersPage   = lazy(() => import('./pages/FoundersPage'));
const ProjectsPage   = lazy(() => import('./pages/ProjectsPage'));
const MediaPage      = lazy(() => import('./pages/MediaPage'));
const BoutiquePage   = lazy(() => import('./pages/BoutiquePage'));
const JournalPage    = lazy(() => import('./pages/JournalPage'));
const ContactPage    = lazy(() => import('./pages/ContactPage'));
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'));

// Brand detail — needs URL params, handled by wrapper below
const BrandDetailPage = lazy(() => import('./pages/BrandDetailPage'));

// Admin — largest chunk, always lazy
const AdminDashboard  = lazy(() => import('./components/AdminDashboard'));
const AdminLoginPage  = lazy(() => import('./components/auth/AdminLoginPage'));

// ---------------------------------------------------------------------------
// Global window extension for the luxury toast system
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    showLuxuryToast?: (message: string) => void;
  }
}

// ---------------------------------------------------------------------------
// BrandDetailPage wrapper — resolves brand from URL param + context
// ---------------------------------------------------------------------------
function BrandDetailRoute() {
  const { brandId } = useParams<{ brandId: string }>();
  const { brands, founders, mediaItems } = useAppState();
  const navigate = useNavigate();

  const brand = brands.find((b) => b.id === brandId);

  if (!brand) {
    return <Navigate to="/brands" replace />;
  }

  return (
    <BrandDetailPage
      brand={brand}
      founders={founders}
      mediaItems={mediaItems}
      onBackClick={() => navigate('/brands')}
    />
  );
}

// ---------------------------------------------------------------------------
// Main application routes + layout
// ---------------------------------------------------------------------------
function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    brands, founders, mediaItems, modelingItems, projects,
    products, setProducts, orders, setOrders, promoCodes,
    setBrands, setFounders, setMediaItems, setModelingItems,
    setProjects, pageSeo, setPageSeo, setPromoCodes,
  } = useAppState();

  const [toast, setToast] = useState<string | null>(null);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  // Bind the global luxury toast notifier
  useEffect(() => {
    window.showLuxuryToast = (msg: string) => setToast(msg);
    return () => { window.showLuxuryToast = undefined; };
  }, []);

  // Scroll to top on every navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Dynamic SEO head injection (matching original App.tsx behaviour)
  useEffect(() => {
    let title = 'TheMainKeys - Venture Builder & Luxury Studio';
    let desc = 'Orchestrating the future of luxury and technology.';
    let ogImage = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200';

    // Derive the "view" name from the URL pathname for SEO lookup
    const pathSegment = location.pathname.split('/')[1] || 'home';
    const isBrandDetail = location.pathname.startsWith('/brands/') && location.pathname.split('/').length > 2;

    if (isBrandDetail) {
      const brandId = location.pathname.split('/')[2];
      const activeBrand = brands.find((b) => b.id === brandId);
      if (activeBrand) {
        title = activeBrand.metaTitle || `${activeBrand.name} - Brand System`;
        desc = activeBrand.metaDesc || activeBrand.description;
        ogImage = activeBrand.ogImage || activeBrand.coverImage || activeBrand.logo || ogImage;
      }
    } else {
      const match = pageSeo.find((p) => p.view === pathSegment);
      if (match) {
        title = match.title;
        desc = match.description;
        ogImage = match.ogImage || ogImage;
      }
    }

    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector.match(/\[([^=]+)="([^"]+)"\]/)?.slice(1) || [];
        if (attrName) el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:image"]', 'content', ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://themainkeys.com${location.pathname}`);

  }, [location.pathname, brands, pageSeo]);

  const isAdminPath = location.pathname.startsWith('/admin');

  // Helper passed to page wrappers so they can navigate to brand detail
  const goToBrand = (id: string) => navigate(`/brands/${id}`);

  return (
    <div
      id="app-viewport-container"
      className="min-h-screen bg-[#050505] text-neutral-300 font-sans flex flex-col justify-between selection:bg-gold-500 selection:text-black"
    >
      {/* Global navigation header — hidden inside Admin to preserve full-screen layout */}
      {!isAdminPath && <Header />}

      {/* Main page canvas */}
      <div id="main-content-canvas" className="flex-grow">
        <Suspense fallback={<LoadingSkeleton />}>
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
            <Routes location={location}>

              {/* Public routes */}
              <Route path="/" element={
                <HomePage onShowreelOpen={() => setIsShowreelOpen(true)} />
              } />

              <Route path="/brands" element={
                <PageTransition>
                  <BrandsPage />
                </PageTransition>
              } />

              <Route path="/brands/:brandId" element={
                <PageTransition variant="fade">
                  <BrandDetailRoute />
                </PageTransition>
              } />

              <Route path="/fashion" element={
                <PageTransition>
                  <FashionPage
                    brands={brands}
                    mediaItems={mediaItems}
                    onBrandClick={goToBrand}
                    setView={(view: string) => navigate(view === 'home' ? '/' : `/${view}`)}
                  />
                </PageTransition>
              } />

              <Route path="/modeling" element={
                <PageTransition>
                  <ModelingPage modelingItems={modelingItems} />
                </PageTransition>
              } />

              <Route path="/founders" element={
                <PageTransition>
                  <FoundersPage
                    founders={founders}
                    brands={brands}
                    onBrandClick={goToBrand}
                  />
                </PageTransition>
              } />

              <Route path="/projects" element={
                <PageTransition>
                  <ProjectsPage
                    projects={projects}
                    brands={brands}
                    onBrandClick={goToBrand}
                  />
                </PageTransition>
              } />

              <Route path="/media" element={
                <PageTransition>
                  <MediaPage mediaItems={mediaItems} />
                </PageTransition>
              } />

              <Route path="/boutique" element={
                <PageTransition>
                  <BoutiquePage
                    products={products}
                    setProducts={setProducts}
                    orders={orders}
                    setOrders={setOrders}
                    promoCodes={promoCodes}
                  />
                </PageTransition>
              } />

              <Route path="/journal" element={
                <PageTransition>
                  <JournalPage />
                </PageTransition>
              } />

              <Route path="/contact" element={
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              } />

              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected admin dashboard */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
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
                    onExit={() => navigate('/')}
                  />
                </ProtectedRoute>
              } />

              {/* 404 catch-all */}
              <Route path="*" element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              } />

            </Routes>
            </div>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* Global footer — hidden on admin */}
      {!isAdminPath && <Footer />}

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
                  aria-label="Close showreel"
                >
                  [CLOSE]
                </button>
              </div>
              <div className="aspect-video bg-black flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full border border-gold-500/20 bg-gold-500/5 flex items-center justify-center">
                  <Play className="w-5 h-5 text-gold-400 fill-current" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-gold-400 tracking-widest uppercase block">
                    STREAMING CONNECTIVITY
                  </span>
                  <p className="text-neutral-400 text-xs max-w-md mx-auto">
                    Simulating cinematic creative showcase for{' '}
                    <strong>TheMainKeys Ventures 2026 Compilation</strong>. Media files are
                    encrypted to preserve direct visual rights.
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

// ---------------------------------------------------------------------------
// Root App — providers + router
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppStateProvider>
    </LanguageProvider>
  );
}
