/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      id="not-found-page"
      className="min-h-screen bg-[#050505] flex items-center justify-center px-4 pt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-lg mx-auto space-y-8"
      >
        {/* Monogram */}
        <div className="relative w-16 h-16 flex items-center justify-center border border-gold-400/30 rounded mx-auto">
          <span className="font-serif font-bold text-gold-400/60 text-2xl">TT</span>
          <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-gold-400/30 rotate-45" />
        </div>

        {/* 404 number */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-[0.5em] text-gold-400/60 uppercase block">
            Error 404
          </span>
          <h1 className="font-sans font-extrabold text-7xl sm:text-9xl tracking-tighter text-white/10 leading-none select-none">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="font-sans font-bold text-xl text-white uppercase tracking-wider">
            Page Not Found
          </h2>
          <p className="text-neutral-500 text-sm font-light leading-relaxed max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved. Return to the studio
            and explore our curated ventures.
          </p>
        </div>

        {/* Separator */}
        <div className="w-16 h-px bg-gold-400/20 mx-auto" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="not-found-back-btn"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 font-mono text-[10px] tracking-widest uppercase rounded transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
          <button
            id="not-found-home-btn"
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-mono text-[10px] tracking-widest uppercase font-bold rounded cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Home className="w-3.5 h-3.5" />
            Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
