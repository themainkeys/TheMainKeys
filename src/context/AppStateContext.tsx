/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Brand, Founder, MediaItem, ModelingItem, ProjectItem, PageSeo, Product, Order, PromoCode } from '../types';
import {
  INITIAL_BRANDS,
  INITIAL_FOUNDERS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_MODELING_ITEMS,
  INITIAL_PROJECTS,
  INITIAL_PRODUCTS,
  INITIAL_PROMO_CODES,
} from '../data';

// ---------------------------------------------------------------------------
// Initial SEO data — moved here from App.tsx so it persists with state
// ---------------------------------------------------------------------------
export const INITIAL_PAGE_SEO: PageSeo[] = [
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

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface AppStateContextType {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  founders: Founder[];
  setFounders: React.Dispatch<React.SetStateAction<Founder[]>>;
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  modelingItems: ModelingItem[];
  setModelingItems: React.Dispatch<React.SetStateAction<ModelingItem[]>>;
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  pageSeo: PageSeo[];
  setPageSeo: React.Dispatch<React.SetStateAction<PageSeo[]>>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_brands');
      return saved ? JSON.parse(saved) : INITIAL_BRANDS;
    } catch { return INITIAL_BRANDS; }
  });

  const [founders, setFounders] = useState<Founder[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_founders');
      return saved ? JSON.parse(saved) : INITIAL_FOUNDERS;
    } catch { return INITIAL_FOUNDERS; }
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_media_items');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
    } catch { return INITIAL_MEDIA_ITEMS; }
  });

  const [modelingItems, setModelingItems] = useState<ModelingItem[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_modeling_items');
      return saved ? JSON.parse(saved) : INITIAL_MODELING_ITEMS;
    } catch { return INITIAL_MODELING_ITEMS; }
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch { return INITIAL_PROJECTS; }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch { return INITIAL_PRODUCTS; }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_promo_codes');
      return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
    } catch { return INITIAL_PROMO_CODES; }
  });

  const [pageSeo, setPageSeo] = useState<PageSeo[]>(() => {
    try {
      const saved = localStorage.getItem('tmk_page_seo');
      return saved ? JSON.parse(saved) : INITIAL_PAGE_SEO;
    } catch { return INITIAL_PAGE_SEO; }
  });

  // Sync all state to localStorage
  // NOTE: In Phase 2 these will be replaced by Supabase mutations
  useEffect(() => { localStorage.setItem('tmk_brands', JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem('tmk_founders', JSON.stringify(founders)); }, [founders]);
  useEffect(() => { localStorage.setItem('tmk_media_items', JSON.stringify(mediaItems)); }, [mediaItems]);
  useEffect(() => { localStorage.setItem('tmk_modeling_items', JSON.stringify(modelingItems)); }, [modelingItems]);
  useEffect(() => { localStorage.setItem('tmk_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('tmk_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('tmk_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('tmk_promo_codes', JSON.stringify(promoCodes)); }, [promoCodes]);
  useEffect(() => { localStorage.setItem('tmk_page_seo', JSON.stringify(pageSeo)); }, [pageSeo]);

  return (
    <AppStateContext.Provider
      value={{
        brands, setBrands,
        founders, setFounders,
        mediaItems, setMediaItems,
        modelingItems, setModelingItems,
        projects, setProjects,
        products, setProducts,
        orders, setOrders,
        promoCodes, setPromoCodes,
        pageSeo, setPageSeo,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
