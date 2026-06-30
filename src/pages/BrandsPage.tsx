/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

type BrandFilter = 'all' | 'active' | 'soon' | 'client';

const CATEGORY_ORDER = [
  'TheMainKeys Ventures',
  'Brand Collaborations',
  'Fashion Collaborations',
  'Hospitality Partnerships',
  'Client Projects',
  'Technology Projects',
];

export default function BrandsPage() {
  const { brands } = useAppState();
  const navigate = useNavigate();
  const [brandFilter, setBrandFilter] = useState<BrandFilter>('all');

  const handleBrandClick = (id: string) => navigate(`/brands/${id}`);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
        <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
          Studio Ecosystem Portfolio
        </span>
        <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
          BRANDS &amp; <span className="font-serif italic font-light text-gold-200">VENTURES</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
          We distinguish clearly between self-owned studio Ventures, our physical Wellness programs, Brand
          Collaborations, and high-end fashion lines. Click on any venture card to access interactive case
          studies, brand lookbooks, and catalogs.
        </p>
      </div>

      {/* Luxury Filter Toggle Bar */}
      <div className="flex flex-wrap gap-3 mb-16 relative z-20">
        {([
          { id: 'all', label: 'All Ventures' },
          { id: 'active', label: 'Active Ventures' },
          { id: 'soon', label: 'Coming Soon' },
          { id: 'client', label: 'Client Projects' },
        ] as { id: BrandFilter; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            id={`filter-brand-${tab.id}`}
            onClick={() => setBrandFilter(tab.id)}
            className={`px-5 py-2.5 rounded font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
              brandFilter === tab.id
                ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-bold border-transparent shadow-[0_4px_20px_rgba(242,125,38,0.25)]'
                : 'bg-neutral-950 border-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Separate by distinct category groups */}
      {(() => {
        let totalMatched = 0;

        const groupsToRender = CATEGORY_ORDER.map((cat) => {
          const groupBrands = brands.filter((b) => {
            if (b.category !== cat) return false;
            if (brandFilter === 'active') return b.status === 'Active' && b.category !== 'Client Projects';
            if (brandFilter === 'soon') return b.status === 'Coming Soon';
            if (brandFilter === 'client') return b.category === 'Client Projects';
            return true;
          });

          totalMatched += groupBrands.length;
          if (groupBrands.length === 0) return null;

          return (
            <div key={cat} id={`brand-cat-group-${cat.replace(/\s+/g, '-').toLowerCase()}`} className="mb-20 space-y-8">
              <h2 className="font-sans font-bold text-lg tracking-wider text-white uppercase border-b border-neutral-900 pb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                {cat}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupBrands.map((b) => {
                  const isSoon = b.status === 'Coming Soon';
                  return (
                    <div
                      key={b.id}
                      id={`category-brand-${b.id}`}
                      onClick={() => !isSoon && handleBrandClick(b.id)}
                      className={`p-6 border border-neutral-900 bg-neutral-950/30 rounded-lg flex flex-col justify-between h-[280px] transition-all duration-300 ${
                        isSoon
                          ? 'opacity-65 cursor-not-allowed'
                          : 'hover:border-gold-400/40 hover:bg-neutral-950 hover:shadow-lg cursor-pointer'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                            {b.status}
                          </span>
                          {isSoon && (
                            <span className="px-2 py-0.5 border border-gold-500/20 bg-gold-950/20 text-[8px] font-mono text-gold-400 rounded uppercase">
                              COMING SOON
                            </span>
                          )}
                        </div>
                        <h3 className="font-sans font-bold text-lg text-white uppercase leading-snug">
                          {b.name}
                        </h3>
                        <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 font-light">
                          {b.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-900/60 flex items-center justify-between">
                        <span className="font-mono text-[8px] text-neutral-600 uppercase">
                          Managed by TheMainKeys
                        </span>
                        {!isSoon && (
                          <span className="text-gold-400 hover:text-white font-sans text-[10px] tracking-wider uppercase font-semibold">
                            Explore Venture →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        });

        if (totalMatched === 0) {
          return (
            <div className="text-center py-20 border border-neutral-900 rounded-xl bg-neutral-950/20 max-w-lg mx-auto">
              <Filter className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
              <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-2">
                No Ventures Found
              </h3>
              <p className="text-neutral-500 text-xs max-w-xs mx-auto">
                There are currently no brands registered under this filtered category.
              </p>
            </div>
          );
        }

        return <>{groupsToRender}</>;
      })()}
    </div>
  );
}
