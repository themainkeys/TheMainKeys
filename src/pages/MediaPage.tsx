/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types';
import { FileText, Download, Play, Search, Folder, Tag, Layers, FileImage } from 'lucide-react';

interface MediaPageProps {
  mediaItems: MediaItem[];
}

export default function MediaPage({ mediaItems }: MediaPageProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Categories supporting tags, catalogs, and media libraries
  const mediaCategories = [
    'All',
    'Images',
    'Videos',
    'PDFs',
    'Lookbooks',
    'Catalogs',
    'Campaigns',
    'Press Kits',
    'Brand Assets',
  ];

  // Extract all unique tags
  const allTags = Array.from(new Set(mediaItems.flatMap((item) => item.tags || [])));

  // Filter media items
  const filteredMedia = mediaItems.filter((item) => {
    // Search match
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.collection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tag match
    const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;

    // Tab match
    if (activeTab === 'All') return matchesSearch && matchesTag;
    if (activeTab === 'Images') return item.type === 'image' && matchesSearch && matchesTag;
    if (activeTab === 'Videos') return item.type === 'video' && matchesSearch && matchesTag;
    if (activeTab === 'PDFs') return item.type === 'pdf' && matchesSearch && matchesTag;
    
    // Category text match
    return item.category?.toLowerCase() === activeTab.toLowerCase() && matchesSearch && matchesTag;
  });

  return (
    <div id="media-library-public-root" className="pt-28 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            Digital Assets & Catalogs
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            MEDIA <span className="font-serif italic font-light text-gold-200">LIBRARY</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            The consolidated repository of high-fidelity campaign catalogs, seasonal lookbooks, luxury photography reels, and press kit resources maintained by TheMainKeys.
          </p>
        </div>

        {/* Filter bar, search & tag index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Controls */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search digital assets, folders, campaigns, tags..."
                className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded-lg py-3.5 pl-12 pr-4 text-xs tracking-wider text-white placeholder-neutral-600 transition-colors"
              />
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-950 whitespace-nowrap scrollbar-none">
              {mediaCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    setSelectedTag(null); // Clear tag filter
                  }}
                  className={`px-4 py-2 rounded text-[10px] tracking-wider transition-all cursor-pointer uppercase ${
                    activeTab === cat
                      ? 'bg-gold-500 text-black font-semibold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags sidebar index */}
          <div className="lg:col-span-3 space-y-4 border border-neutral-900/40 p-5 rounded-lg bg-neutral-950/20">
            <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gold-400" /> Filter by Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`text-[8px] font-mono px-2 py-1 rounded transition-colors cursor-pointer uppercase ${
                      isSelected
                        ? 'bg-gold-400 text-black font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[8px] font-mono px-2 py-1 bg-red-950 text-red-400 rounded cursor-pointer uppercase"
                >
                  Clear Tag [x]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Media items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                id={`media-item-public-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group border border-neutral-900/60 bg-neutral-950/30 rounded overflow-hidden flex flex-col justify-between"
              >
                {/* Preview Window */}
                <div className="relative h-48 bg-neutral-900 flex items-center justify-center overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : item.type === 'video' ? (
                    <div className="relative w-full h-full bg-neutral-950 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400"
                        alt="video preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-35"
                      />
                      <div className="absolute inset-0 bg-black/30 z-10"></div>
                      <div className="absolute z-20 w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black">
                        <Play className="w-4.5 h-4.5 fill-current" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <div className="w-10 h-10 rounded bg-gold-500/5 border border-gold-500/20 mx-auto flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gold-400" />
                      </div>
                      <span className="font-mono text-[8px] text-neutral-500 tracking-wider block uppercase">
                        ADOBE PDF DOCUMENT
                      </span>
                    </div>
                  )}

                  {/* Top-right corner size indicator */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 text-[8px] font-mono text-neutral-400 border border-neutral-900/85 rounded">
                    {item.size || '3.5 MB'}
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-4 bg-neutral-950 border-t border-neutral-900/40 space-y-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[8px] text-gold-400 tracking-widest uppercase">
                      Category: {item.category || 'Asset'}
                    </span>
                    <h4 className="font-sans font-bold text-xs text-white line-clamp-1 group-hover:text-gold-300 transition-colors uppercase">
                      {item.name}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-neutral-900/60 text-[9px] font-mono text-neutral-500">
                    <span>DATE: {item.date}</span>
                    <button
                      onClick={() => window.showLuxuryToast ? window.showLuxuryToast(`Initiating catalog download stream for: ${item.name}`) : alert(`Initiating direct catalog download for ${item.name}`)}
                      className="text-gold-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> DOWNLOAD
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredMedia.length === 0 && (
          <div className="py-24 text-center space-y-4 border border-neutral-900 rounded-lg bg-neutral-950/20">
            <Folder className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 text-xs tracking-wider uppercase font-mono">No digital assets matched criteria</p>
            <p className="text-neutral-600 text-[11px]">Refine your keywords, clear tags, or check the Admin Portal to upload a direct brand lookbook catalog!</p>
          </div>
        )}

      </div>
    </div>
  );
}
