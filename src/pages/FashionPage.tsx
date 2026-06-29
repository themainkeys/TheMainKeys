/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brand, MediaItem } from '../types';
import { FileText, Download, Play, Eye, Tag, ArrowRight, Sparkles } from 'lucide-react';

interface FashionPageProps {
  brands: Brand[];
  mediaItems: MediaItem[];
  onBrandClick: (id: string) => void;
  setView: (view: string) => void;
}

export default function FashionPage({ brands, mediaItems, onBrandClick, setView }: FashionPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'campaigns' | 'catalogs' | 'videos' | 'behind'>('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Filter fashion brands: CLÉ Paris, Pier St Barth, Cuffed Design, Sorority
  const fashionBrands = brands.filter((b) =>
    ['cle_paris', 'pier_st_barth', 'cuffed_design', 'sorority'].includes(b.id)
  );

  // Filter relevant media library entries
  const fashionMedia = mediaItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'campaigns') return item.category === 'Campaigns' || item.category === 'Lookbooks';
    if (activeTab === 'catalogs') return item.type === 'pdf';
    if (activeTab === 'videos') return item.type === 'video';
    if (activeTab === 'behind') return item.category === 'Behind-the-scenes';
    return true;
  });

  return (
    <div id="fashion-page-root" className="pt-28 pb-24 bg-black min-h-screen">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Title Block */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            The Haute Couture Circle
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            FASHION <span className="font-serif italic font-light text-gold-200">HOUSE</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            TheMainKeys represents design elevation. Through structured developer alliances and elite creative direction, we bring luxury garments, custom jewellery, resort-wear lifestyle campaigns, and architectural hardware directly to global runways.
          </p>
        </div>

        {/* Featured Brands Grid (CLÉ Paris, Pier St Barth, Cuffed Design, Sorority) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {fashionBrands.map((brand) => {
            const isSoon = brand.status === 'Coming Soon';
            return (
              <motion.div
                key={brand.id}
                id={`fashion-brand-card-${brand.id}`}
                whileHover={{ y: -6 }}
                className="group relative border border-neutral-900 bg-neutral-950/40 rounded-lg p-6 flex flex-col justify-between h-[340px] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative h-32 w-full bg-neutral-900/50 overflow-hidden rounded">
                    {brand.coverImage ? (
                      <img
                        src={brand.coverImage}
                        alt={brand.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-neutral-600 uppercase">
                        Coming Soon Studio
                      </div>
                    )}
                    {isSoon && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 border border-gold-500/10 bg-black/80 rounded text-[8px] text-gold-400 font-mono tracking-widest uppercase">
                        COMING SOON
                      </div>
                    )}
                  </div>

                  <h3 className="font-sans font-bold text-lg tracking-tight text-white group-hover:text-gold-300 transition-colors uppercase">
                    {brand.name}
                  </h3>
                  <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-3">
                    {brand.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-900/50">
                  {isSoon ? (
                    <span className="text-[10px] font-mono tracking-widest text-neutral-600 block uppercase">
                      In Development
                    </span>
                  ) : (
                    <button
                      id={`fashion-explore-${brand.id}`}
                      onClick={() => onBrandClick(brand.id)}
                      className="flex items-center gap-2 text-gold-300 group-hover:text-white transition-colors text-[10px] tracking-widest uppercase font-semibold cursor-pointer"
                    >
                      EXPLORE BRAND
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Campaign Assets Navigation Hub */}
        <div className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-900 pb-4 gap-4">
            <h2 className="font-sans font-bold text-xl tracking-wider text-white uppercase">
              Campaigns, Editorial & PDF Catalogs
            </h2>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'campaigns', 'catalogs', 'videos', 'behind'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`fashion-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-[10px] tracking-wider transition-all cursor-pointer uppercase ${
                    activeTab === tab
                      ? 'bg-gold-500 text-black font-bold'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {tab === 'behind' ? 'BEHIND THE SCENES' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Asset List/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {fashionMedia.map((item) => (
                <motion.div
                  key={item.id}
                  id={`fashion-media-card-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group relative border border-neutral-900/70 bg-neutral-950/20 rounded overflow-hidden"
                >
                  {/* Image/Placeholder render */}
                  <div className="relative h-64 bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : item.type === 'video' ? (
                      <div className="relative w-full h-full bg-neutral-950 flex flex-col items-center justify-center">
                        {/* Custom video slate */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/30 z-10"></div>
                        <img
                          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600"
                          alt="Video Cover"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-45"
                        />
                        <button
                          id={`play-video-${item.id}`}
                          onClick={() => setSelectedVideo(item.name)}
                          className="absolute z-20 w-12 h-12 flex items-center justify-center bg-gold-500 rounded-full text-black hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-neutral-950/80 p-8 flex flex-col justify-between">
                        <div className="w-12 h-12 rounded border border-gold-500/20 bg-gold-500/5 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gold-400" />
                        </div>
                        <div className="space-y-2">
                          <span className="font-mono text-[9px] text-gold-400 tracking-widest uppercase">
                            PDF LUXURY CATALOG
                          </span>
                          <h4 className="font-sans font-bold text-sm text-white line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          id={`download-pdf-${item.id}`}
                          onClick={() => window.showLuxuryToast ? window.showLuxuryToast(`Securing download request for: ${item.name} (${item.size || '3.2 MB'})`) : alert(`Starting simulated download: ${item.name} (${item.size})`)}
                          className="w-full py-2 border border-neutral-800 hover:border-gold-400 text-[10px] tracking-widest text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          DOWNLOAD CATALOG ({item.size})
                        </button>
                      </div>
                    )}

                    {/* Image / Video Category Overlay */}
                    {item.type !== 'pdf' && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 border border-neutral-800 bg-black/75 rounded text-[8px] text-neutral-300 font-mono tracking-wider uppercase">
                        {item.category}
                      </div>
                    )}
                  </div>

                  {/* Meta text for Images/Videos */}
                  {item.type !== 'pdf' && (
                    <div className="p-4 space-y-2 bg-neutral-950 border-t border-neutral-900/50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-sans font-semibold text-xs text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="font-mono text-[8px] text-neutral-500">
                          {item.size || '3.5 MB'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map((tag) => (
                          <span key={tag} className="text-[8px] font-mono text-gold-400 bg-gold-950/20 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Call to Modeling Portfolio */}
        <div className="mt-28 p-8 md:p-12 border border-neutral-900 bg-neutral-950/40 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono tracking-widest text-[9px] uppercase">Haute Couture Casting</span>
            </div>
            <h3 className="font-sans font-bold text-xl md:text-2xl tracking-tight text-white uppercase">
              View Our Modeling Portfolio
            </h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Explore professional client campaigns, runaway looks, commercial bookings, and lifestyle editorials shot in metropolitan centers across Paris, Milan, and St Barth. Fully editable directly from the CMS.
            </p>
          </div>
          <button
            id="view-modeling-portfolio-btn"
            onClick={() => setView('modeling')}
            className="w-full md:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest transition-colors cursor-pointer"
          >
            VIEW PORTFOLIO
          </button>
        </div>

      </div>

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-900 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{selectedVideo}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>
            <div className="aspect-video bg-black flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-gold-500/20 bg-gold-500/5 flex items-center justify-center">
                <Play className="w-6 h-6 text-gold-400 fill-current" />
              </div>
              <p className="text-xs text-neutral-400 max-w-md">
                Simulating secure stream for <strong>{selectedVideo}</strong>. High definition media is linked server-side to prevent public theft.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
