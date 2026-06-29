/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  setSelectedBrandId: (id: string | null) => void;
  setSelectedFounderId: (id: string | null) => void;
}

export default function Header({
  currentView,
  setView,
  setSelectedBrandId,
  setSelectedFounderId,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav.home'), view: 'home' },
    { label: t('nav.brands'), view: 'brands' },
    { label: t('nav.projects'), view: 'projects' },
    { label: t('nav.fashion'), view: 'fashion' },
    { label: t('nav.media'), view: 'media' },
    { label: t('nav.boutique'), view: 'boutique' },
    { label: t('nav.journal'), view: 'journal' },
    { label: t('nav.modeling'), view: 'modeling' },
    { label: t('nav.founders'), view: 'founders' },
    { label: t('nav.contact'), view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    setView(view);
    setSelectedBrandId(null);
    setSelectedFounderId(null);
    setIsOpen(false);
  };

  return (
    <header id="header-root" className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          id="brand-logo-container"
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          {/* Custom Elegant TM Logo Icon */}
          <div className="relative w-8 h-8 flex items-center justify-center border border-gold-400 rounded">
            <span className="font-serif font-bold text-gold-400 text-lg tracking-wider">TT</span>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-gold-400 rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-lg tracking-[0.25em] text-white">THEMAINKEYS</span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-gold-400">VENTURES & CREATIVE</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                id={`nav-item-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`relative font-sans text-xs tracking-[0.2em] transition-colors duration-300 py-2 cursor-pointer uppercase ${
                  isActive ? 'text-gold-300 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button: Admin Access Portal */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            id="admin-portal-button"
            onClick={() => handleNavClick('admin')}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] tracking-widest transition-all duration-300 cursor-pointer uppercase ${
              currentView === 'admin'
                ? 'bg-gold-500 border-gold-400 text-black font-semibold shadow-[0_0_15px_rgba(179,145,59,0.3)]'
                : 'border-neutral-800 text-gold-300 hover:border-gold-400 hover:bg-gold-500/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {t('nav.admin')}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            id="admin-portal-button-mobile"
            onClick={() => handleNavClick('admin')}
            className={`p-2 border rounded-full cursor-pointer ${
              currentView === 'admin'
                ? 'bg-gold-500 border-gold-400 text-black shadow-[0_0_10px_rgba(179,145,59,0.3)]'
                : 'border-neutral-800 text-gold-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-400 hover:text-white focus:outline-none p-1 cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-20 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-neutral-900 py-6 px-4 space-y-4"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`mobile-nav-item-${item.view}`}
                    onClick={() => handleNavClick(item.view)}
                    className={`text-left font-sans text-xs tracking-[0.2em] py-2 border-b border-neutral-900/50 cursor-pointer uppercase ${
                      isActive ? 'text-gold-300 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <button
                id="mobile-admin-access-button"
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 rounded text-gold-300 font-semibold text-xs tracking-widest cursor-pointer uppercase"
              >
                <Sliders className="w-4 h-4" />
                {t('nav.admin')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
