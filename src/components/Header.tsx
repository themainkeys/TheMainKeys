/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sliders } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.brands'), path: '/brands' },
    { label: t('nav.projects'), path: '/projects' },
    { label: t('nav.fashion'), path: '/fashion' },
    { label: t('nav.media'), path: '/media' },
    { label: t('nav.boutique'), path: '/boutique' },
    { label: t('nav.journal'), path: '/journal' },
    { label: t('nav.modeling'), path: '/modeling' },
    { label: t('nav.founders'), path: '/founders' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <header id="header-root" className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <div
          id="brand-logo-container"
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavClick('/')}
        >
          {/* Custom Elegant TM Logo Icon */}
          <div className="relative w-8 h-8 flex items-center justify-center border border-gold-400 rounded">
            <span className="font-serif font-bold text-gold-400 text-lg tracking-wider">TT</span>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-gold-400 rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-lg tracking-[0.25em] text-white">THEMAINKEYS</span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-gold-400">VENTURES &amp; CREATIVE</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                id={`nav-item-${item.path.replace('/', '') || 'home'}`}
                onClick={() => handleNavClick(item.path)}
                className={`relative font-sans text-xs tracking-[0.2em] transition-colors duration-300 py-2 cursor-pointer uppercase ${
                  active ? 'text-gold-300 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
                {active && (
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
            onClick={() => handleNavClick(isAdminActive ? '/' : '/admin')}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] tracking-widest transition-all duration-300 cursor-pointer uppercase ${
              isAdminActive
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
            onClick={() => handleNavClick(isAdminActive ? '/' : '/admin')}
            className={`p-2 border rounded-full cursor-pointer ${
              isAdminActive
                ? 'bg-gold-500 border-gold-400 text-black shadow-[0_0_10px_rgba(179,145,59,0.3)]'
                : 'border-neutral-800 text-gold-300'
            }`}
            aria-label="Admin dashboard"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-400 hover:text-white focus:outline-none p-1 cursor-pointer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
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
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    id={`mobile-nav-item-${item.path.replace('/', '') || 'home'}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`text-left font-sans text-xs tracking-[0.2em] py-2 border-b border-neutral-900/50 cursor-pointer uppercase ${
                      active ? 'text-gold-300 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <button
                id="mobile-admin-access-button"
                onClick={() => handleNavClick('/admin')}
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
