/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brand } from '../types';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';

interface VenturesGridProps {
  brands: Brand[];
  onBrandClick: (id: string) => void;
}

export default function VenturesGrid({ brands, onBrandClick }: VenturesGridProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'soon' | 'client'>('all');

  // Sort brands by order
  const sortedBrands = [...brands].sort((a, b) => a.order - b.order);

  // We want to feature: TheMainKeys, Wingman, Fashion Meetz Fitness, Fitness Power Hour, Mike Water Fitness, CLÉ Paris, Pier St Barth, Cuffed Design, Sorority
  const homepageBrands = sortedBrands.filter(b => 
    ['the_main_keys', 'wingman', 'fashion_meetz_fitness', 'fitness_power_hour', 'mike_water_fitness', 'cle_paris', 'pier_st_barth', 'cuffed_design', 'sorority'].includes(b.id)
  );

  // Filter items based on selected tab
  const displayedBrands = sortedBrands.filter(brand => {
    if (filter === 'all') {
      // By default show featured homepage brands, or any custom client projects if available
      return ['the_main_keys', 'wingman', 'fashion_meetz_fitness', 'fitness_power_hour', 'mike_water_fitness', 'cle_paris', 'pier_st_barth', 'cuffed_design', 'sorority'].includes(brand.id) || brand.category === 'Client Projects';
    }
    if (filter === 'active') {
      return brand.status === 'Active' && brand.category !== 'Client Projects';
    }
    if (filter === 'soon') {
      return brand.status === 'Coming Soon';
    }
    if (filter === 'client') {
      return brand.category === 'Client Projects';
    }
    return true;
  });

  return (
    <section id="ventures-grid-section" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-neutral-900/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] tracking-[0.35em] text-gold-400 uppercase"
          >
            Venture Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-white uppercase"
          >
            Our Ventures & Collaborations
          </motion.h2>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            We build. We launch. We scale. Our cohesive portfolio spans elite technology, luxury couture, private concierge solutions, and wellness initiatives.
          </p>
        </div>

        {/* Luxury Filter Toggle Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-20">
          {[
            { id: 'all', label: 'All Ventures' },
            { id: 'active', label: 'Active Ventures' },
            { id: 'soon', label: 'Coming Soon' },
            { id: 'client', label: 'Client Projects' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-home-${tab.id}`}
              onClick={() => setFilter(tab.id as any)}
              className={`px-5 py-2.5 rounded font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-bold border-transparent shadow-[0_4px_20px_rgba(242,125,38,0.25)]'
                  : 'bg-neutral-950 border-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Animated Grid */}
        {displayedBrands.length === 0 ? (
          <div className="text-center py-16 border border-neutral-900/60 rounded-xl bg-neutral-950/20">
            <Filter className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-wider">No ventures found matching this criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedBrands.map((brand, idx) => {
              const isComingSoon = brand.status === 'Coming Soon';
              
              return (
                <motion.div
                  key={brand.id}
                  id={`brand-card-${brand.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => !isComingSoon && onBrandClick(brand.id)}
                  className={`relative group flex flex-col justify-between h-[360px] p-8 border rounded-lg bg-neutral-950/60 transition-all duration-300 ${
                    isComingSoon
                      ? 'border-neutral-900/50 cursor-not-allowed opacity-80'
                      : 'border-neutral-900 hover:border-gold-400/40 hover:bg-neutral-950 hover:shadow-[0_10px_30px_rgba(179,145,59,0.08)] cursor-pointer'
                  }`}
                >
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    {/* Brand Category Tag */}
                    <span className="font-mono text-[8px] tracking-[0.2em] text-neutral-500 uppercase">
                      {brand.category}
                    </span>
                    {/* Status Badge */}
                    {isComingSoon ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 border border-gold-500/10 bg-gold-950/20 rounded text-[8px] text-gold-400 font-mono tracking-widest uppercase">
                        COMING SOON
                      </span>
                    ) : brand.id === 'the_main_keys' ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 border border-blue-500/10 bg-blue-950/20 rounded text-[8px] text-blue-400 font-mono tracking-widest uppercase">
                        PARENT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 border border-green-500/10 bg-green-950/20 rounded text-[8px] text-green-400 font-mono tracking-widest uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Brand Name */}
                  <h3 className="font-sans font-bold text-xl tracking-tight text-white group-hover:text-gold-300 transition-colors">
                    {brand.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                    {brand.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-neutral-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={`${brand.name} Icon`}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded bg-neutral-900 object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded bg-neutral-900 flex items-center justify-center font-serif text-[10px] text-gold-400 font-bold">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-mono text-[8px] text-neutral-600 tracking-wider">
                      DEVELOPED BY TMK
                    </span>
                  </div>

                  {isComingSoon ? (
                    <span className="font-sans text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
                      STAY TUNED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.25em] text-gold-400 group-hover:text-white transition-colors uppercase font-semibold">
                      LEARN MORE
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </div>

                {/* Ambient glow decoration */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/0 to-transparent group-hover:via-gold-400/40 transition-all duration-700"></div>
              </motion.div>
            );
          })}
        </div>
        )}

        {/* What We Do segment matching second home screen */}
        <div className="mt-28 pt-20 border-t border-neutral-900">
          <div className="text-center mb-16 space-y-2">
            <h3 className="font-sans font-extrabold text-2xl tracking-tight text-white uppercase">What We Do</h3>
            <p className="text-neutral-500 text-xs">A full-service creative and technology studio building brands and digital experiences.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'BRAND DEVELOPMENT', desc: 'Identity, storytelling, positioning' },
              { title: 'WEBSITE & APP DEVELOPMENT', desc: 'Custom apps, commerce, WebGL' },
              { title: 'CREATIVE DIRECTION', desc: 'Campaign design, visual catalogs' },
              { title: 'MEDIA PRODUCTION', desc: 'Video, reels, lifestyle capture' },
              { title: 'VENTURE BUILDING', desc: 'Go-to-market, ops formulation' },
              { title: 'STRATEGY & CONSULTING', desc: 'Hospitality partnerships, tech advisory' }
            ].map((serv, index) => (
              <div key={index} className="p-5 border border-neutral-900 bg-neutral-950/20 text-center hover:border-gold-400/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gold-500/5 mx-auto mb-4 flex items-center justify-center border border-gold-500/15">
                  <span className="font-mono text-[9px] text-gold-400 font-bold">0{index+1}</span>
                </div>
                <h4 className="font-sans font-semibold text-[10px] tracking-wider text-white uppercase mb-2">
                  {serv.title}
                </h4>
                <p className="text-neutral-500 text-[9px] leading-relaxed">
                  {serv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
