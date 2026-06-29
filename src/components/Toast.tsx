/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Bell } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="global-luxury-toast"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-[100] max-w-md w-full bg-neutral-950/95 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-3.5"
        >
          {/* Accent Indicator Bar */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#f27d26] to-[#b3913b] rounded-l-lg"></div>
          
          {/* Icon */}
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#f27d26] shrink-0 border border-white/5 ml-1">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>

          {/* Text Content */}
          <div className="flex-grow space-y-1">
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#f27d26] uppercase font-bold block">
              SYSTEM CONCIERGE
            </span>
            <p className="font-sans text-xs text-neutral-200 leading-relaxed font-light">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
