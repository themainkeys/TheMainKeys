/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModelingItem } from '../types';
import { Play, Sparkles, Filter, Eye, Camera, Heart } from 'lucide-react';

interface ModelingPageProps {
  modelingItems: ModelingItem[];
}

export default function ModelingPage({ modelingItems }: ModelingPageProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Campaigns' | 'Editorials' | 'Commercial' | 'Fashion' | 'Lifestyle' | 'Videos'>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ModelingItem | null>(null);

  // Filter items
  const filteredItems = modelingItems.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const categories = ['All', 'Campaigns', 'Editorials', 'Commercial', 'Fashion', 'Lifestyle', 'Videos'] as const;

  return (
    <div id="modeling-page-root" className="pt-28 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            Couture Casting & Bookings
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            MODELING <span className="font-serif italic font-light text-gold-200">PORTFOLIO</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Represented by elite alliances. Delivering campaigns, runway presentations, commercial booklets, and high-fashion lifestyle imagery for prominent luxury houses. Fully synchronized with our live content management engine.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-neutral-900 pb-6">
          <span className="font-mono text-[10px] text-neutral-500 mr-4 flex items-center gap-1.5 uppercase">
            <Filter className="w-3.5 h-3.5" /> Filter Portfolio:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`modeling-cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded text-[10px] tracking-wider transition-all cursor-pointer uppercase ${
                activeCategory === cat
                  ? 'bg-gold-500 text-black font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                id={`modeling-item-${item.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedItem(item)}
                className="group relative h-[440px] border border-neutral-900 bg-neutral-950 overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

                {/* Info Overlay (Always partially visible, fully on hover) */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end space-y-3 z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] tracking-wider text-gold-400 bg-gold-950/40 px-2.5 py-1 border border-gold-500/15 rounded uppercase">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="flex items-center gap-1 text-[8px] text-pink-400 font-mono tracking-widest uppercase">
                        <Sparkles className="w-3 h-3" /> FEATURED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[8px] tracking-widest text-neutral-500 uppercase">
                      Client: {item.client || 'General Portfolio'}
                    </span>
                    <h3 className="font-sans font-bold text-lg text-white group-hover:text-gold-300 transition-colors uppercase leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Hidden metadata showing on hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredId === item.id ? 1 : 0,
                      height: hoveredId === item.id ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-2 pt-2 border-t border-neutral-900/50"
                  >
                    <p className="text-neutral-400 text-xs leading-relaxed font-light">
                      {item.description || 'Campaign highlight presenting bespoke luxury styling and metropolitan lookbooks.'}
                    </p>
                    <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
                      <span>DATE: {item.date}</span>
                      <span className="text-gold-400 flex items-center gap-1 group-hover:underline">
                        <Eye className="w-3 h-3" /> VIEW DETAILS
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Play Badge Overlay for Videos */}
                {item.category === 'Videos' && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black shadow-lg">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="py-24 text-center space-y-4 border border-neutral-900 rounded-lg bg-neutral-950/20">
            <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 text-xs tracking-wider uppercase font-mono">No items found in this section</p>
            <p className="text-neutral-600 text-[11px] max-w-sm mx-auto">Go to the Admin Portal to create, upload, and publish a new modeling campaign asset!</p>
          </div>
        )}

      </div>

      {/* Lightbox Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden my-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Visual */}
                <div className="relative h-[400px] md:h-[600px] bg-neutral-900">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {selectedItem.category === 'Videos' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-gold-500/20 bg-gold-500/5 flex items-center justify-center">
                        <Play className="w-6 h-6 text-gold-400 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[9px] tracking-widest text-gold-300 border border-gold-500/20 bg-gold-950/20 px-2.5 py-1 rounded uppercase">
                        {selectedItem.category}
                      </span>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="text-neutral-500 hover:text-white font-mono text-xs cursor-pointer"
                      >
                        [CLOSE]
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                        CLIENT: {selectedItem.client || 'THEMAINKEYS PARTNER'}
                      </span>
                      <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-white tracking-tight uppercase leading-tight">
                        {selectedItem.title}
                      </h2>
                    </div>

                    <div className="h-[1px] bg-neutral-900"></div>

                    <div className="space-y-4">
                      <h4 className="font-sans font-semibold text-xs tracking-wider text-neutral-400 uppercase">
                        Project Overview
                      </h4>
                      <p className="text-neutral-400 text-xs leading-relaxed font-light">
                        {selectedItem.description || 'This modeling layout forms part of a cohesive collection of commercial campaign work orchestrated by TheMainKeys Ventures. Representing modern luxury values, each shoot undergoes meticulous pre-production planning and styling coordinates to highlight architectural silhouettes.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 text-[10px] font-mono text-neutral-500 border-t border-neutral-900">
                      <div>
                        <span className="block text-neutral-600 uppercase">Booking Agency</span>
                        <span className="text-white">TheMainKeys Creative</span>
                      </div>
                      <div>
                        <span className="block text-neutral-600 uppercase">Campaign Date</span>
                        <span className="text-white">{selectedItem.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.showLuxuryToast ? window.showLuxuryToast(`Booking inquiry successfully sent to our Miami concierge desk for: ${selectedItem.title}`) : alert(`Inquire Booking sent for Campaign: ${selectedItem.title}`)}
                      className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest transition-colors cursor-pointer"
                    >
                      INQUIRE ABOUT THIS LOOK
                    </button>
                    <button
                      onClick={() => window.showLuxuryToast ? window.showLuxuryToast(`Selected look has been added to your private lifestyle moodboard.`) : alert('Look added to moodboard')}
                      className="px-4 py-3 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-pink-500 fill-current" />
                      SAVE LOOK
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
