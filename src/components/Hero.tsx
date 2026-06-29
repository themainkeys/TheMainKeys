/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Play, ArrowDown } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onWatchShowreelClick: () => void;
}

export default function Hero({ onExploreClick, onWatchShowreelClick }: HeroProps) {
  return (
    <section id="homepage-hero-root" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      {/* Background Cinematic Image Overlaid with Vignettes */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1800"
          alt="TheMainKeys Skyline Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 scale-105"
        />
        {/* Absolute Gradients for Luxury Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/40"></div>
      </div>

      {/* Floating Graphic Assets for Premium Feel */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-left w-full">
        <div className="max-w-4xl space-y-8">
          
          {/* Subheading Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-gold-500/20 bg-gold-950/20 rounded-full text-gold-300 text-[10px] tracking-[0.25em] font-semibold uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
            The Parent Venture Studio
          </motion.div>

          {/* Main Massive Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white uppercase"
          >
            Building <span className="gold-gradient">Brands</span>.<br />
            Creating <span className="text-neutral-100 font-serif italic font-medium">Experiences</span>.<br />
            Developing <span className="gold-gradient">Technology</span>.<br />
            Driving <span className="text-gold-300">Impact</span>.
          </motion.h1>

          {/* Body Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-neutral-400 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl"
          >
            TheMainKeys is a venture studio and creative company that transforms ideas into brands, products, technology, and experiences that create long-term value.
          </motion.p>

          {/* Interactive Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-5 pt-4"
          >
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="group flex items-center gap-3 px-8 py-4 bg-transparent border border-gold-400 hover:bg-gold-500 hover:text-black hover:border-gold-500 text-gold-300 text-xs tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer"
            >
              EXPLORE OUR WORLD
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              id="hero-watch-btn"
              onClick={onWatchShowreelClick}
              className="flex items-center gap-3 px-6 py-4 text-white hover:text-gold-300 text-xs tracking-[0.2em] font-bold transition-colors group cursor-pointer"
            >
              <span className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-gold-400 rounded-full transition-colors">
                <Play className="w-3.5 h-3.5 fill-current" />
              </span>
              WATCH SHOWREEL
            </button>
          </motion.div>
        </div>
      </div>

      {/* Partners Banner Mock Segment - Forbes, Hypebeast, etc. */}
      <div className="absolute bottom-0 left-0 w-full z-10 bg-gradient-to-t from-black to-transparent py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-neutral-900/30 pt-6">
          <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase">Featured In:</span>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-40">
            <span className="font-sans font-extrabold text-white text-base tracking-[0.1em]">Forbes</span>
            <span className="font-serif italic font-bold text-white text-lg tracking-[0.05em]">HYPEBEAST</span>
            <span className="font-sans font-medium text-white text-sm tracking-[0.15em]">Business Insider</span>
            <span className="font-serif font-semibold text-white text-sm tracking-[0.05em]">Men's Health</span>
            <span className="font-sans italic font-bold text-white text-sm tracking-[0.2em]">VoyageMIA</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="font-mono text-[8px] tracking-[0.25em] text-neutral-400">SCROLL TO DISCOVER</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="w-3.5 h-3.5 text-gold-400" />
        </motion.div>
      </div>
    </section>
  );
}
