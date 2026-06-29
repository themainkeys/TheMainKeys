/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FooterProps {
  setView: (view: string) => void;
  setSelectedBrandId: (id: string | null) => void;
  setSelectedFounderId: (id: string | null) => void;
}

export default function Footer({
  setView,
  setSelectedBrandId,
  setSelectedFounderId,
}: FooterProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleNavClick = (view: string) => {
    setView(view);
    setSelectedBrandId(null);
    setSelectedFounderId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-root" className="bg-[#030303] border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center border border-gold-400 rounded">
                <span className="font-serif font-bold text-gold-400 text-xs">TT</span>
              </div>
              <span className="font-sans font-bold text-sm tracking-[0.25em] text-white">THEMAINKEYS</span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 border border-neutral-900 rounded-full text-neutral-400 hover:text-gold-400 hover:border-gold-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-neutral-900 rounded-full text-neutral-400 hover:text-gold-400 hover:border-gold-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-neutral-900 rounded-full text-neutral-400 hover:text-gold-400 hover:border-gold-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-semibold text-xs tracking-widest text-gold-300 mb-6 uppercase">
              {t('footer.explorations')}
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNavClick('home')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('brands')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.brands')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('fashion')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.fashion')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('modeling')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.modeling')}
                </button>
              </li>
            </ul>
          </div>

          {/* Leadership & Work */}
          <div>
            <h4 className="font-sans font-semibold text-xs tracking-widest text-gold-300 mb-6 uppercase">
              {t('footer.foundations')}
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNavClick('founders')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.founders')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('projects')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.projects')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('media')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.media')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="text-neutral-400 hover:text-white text-xs tracking-wider cursor-pointer uppercase">
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-sans font-semibold text-xs tracking-widest text-gold-300 mb-6 uppercase">
              {t('footer.studios')}
            </h4>
            <ul className="space-y-4 text-xs text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{t('footer.hq_desc')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:contact@themainkeys.com" className="hover:text-white">contact@themainkeys.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+1 (305) 998-KEYS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900/50 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-neutral-600 text-[10px] tracking-wide">
            &copy; {t('footer.rights')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex gap-6 text-[10px] text-neutral-500 tracking-wider">
              <a href="#" className="hover:text-neutral-300 uppercase">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-neutral-300 uppercase">{t('footer.terms')}</a>
              <a href="#" className="hover:text-neutral-300 uppercase">{t('footer.concierge')}</a>
            </div>
            
            {/* Elegant Segmented Language Selector */}
            <div id="footer-language-switcher" className="flex items-center bg-neutral-950 border border-neutral-900/80 rounded-full p-1 shrink-0">
              <button
                id="lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full font-mono text-[9px] tracking-widest transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-semibold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-fr"
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-full font-mono text-[9px] tracking-widest transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-semibold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
