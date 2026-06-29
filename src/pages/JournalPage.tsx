/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowRight, BookOpen, Clock, Heart, MessageSquare, Share2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
  author: string;
  authorRole: string;
  likes: number;
}

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_1',
    title: 'THE GEOMETRY OF DESIGN: AN INSIDE LOOK AT CLÉ PARIS ATELIER',
    category: 'Creative Direction',
    date: '2026-06-25',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800',
    summary: 'Lead designer Qayim Correa discusses the fusion of historic French architecture and modern titanium metallurgy in their debut capsule collection.',
    content: [
      'In the heart of Paris, where cobblestone streets meet the sharp angles of modern glass facades, lies the CLÉ Paris design atelier. It is here that Qayim Correa and his team of master goldsmiths are quietely orchestrating a revolution in luxury jewelry.',
      '“We do not look at jewelry as simple adornment,” Qayim notes, gesturing to technical blue-prints taped to the concrete walls. “For us, a bracelet is a piece of portable architecture. It requires structural integrity, calculated tolerances, and an honest relationship with the materials.”',
      'The upcoming capsule series, featuring the La Clé Signature Link, utilizes a composite structure. A solid aerospace-grade titanium core provides immense bending resistance, while a heavy 24-karat gold plating provides the classic luster. It is an engineering feat that bypasses the softness of pure gold while maintaining its rich aesthetic properties.',
      'This marriage of high-computational geometry and traditional handcrafting is the signature of TheMainKeys ecosystem. Every clasp must engage with a satisfying mechanical click—a sensory validation of quality.'
    ],
    author: 'Qayim Correa',
    authorRole: 'Founder & Designer, CLÉ Paris',
    likes: 84
  },
  {
    id: 'art_2',
    title: 'COASTAL COUTURE: REINVENTING RESORT WEAR IN THE CARIBBEAN',
    category: 'Fashion Philosophy',
    date: '2026-06-18',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
    summary: 'How Pier St Barth is using organic pre-washed French linen and modular patterns to define modern maritime luxury.',
    content: [
      'The concept of resort wear has long been stagnant—dominated by uninspired prints and rigid cuts that fail to breathe in warm coastal climates. Pier St Barth, incubated by the Miami Design District wing of TheMainKeys, is challenging this convention.',
      'By working exclusively with small-scale weavers in Normandy, Pier St Barth has developed a bespoke linen yarn that undergoes a natural stone-wash process. The result is a shirt that possesses a substantial drape yet flows like water in the Caribbean breeze.',
      '“Modern luxury is about friction-free living,” says Anderson Djeemo, Venture Lead. “When you transition from a yacht deck in Gustavia to an elite dinner at the harbour, your wardrobe should not require an intermission. It must be effortless, breathable, and structurally elegant.”'
    ],
    author: 'Anderson Djeemo',
    authorRole: 'Managing Partner, TheMainKeys',
    likes: 62
  },
  {
    id: 'art_3',
    title: 'THE INDUSTRIAL ACCIDENT: WINSTRON LEE’S CUFFED LOGBOOK',
    category: 'Materials Science',
    date: '2026-05-30',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=800',
    summary: 'Winston Lee shares the raw, industrial inspirations behind Cuffed Design’s aerospace titanium bolt collection.',
    content: [
      '“I was walking through a decommissioned aircraft hangar in Opa-locka when I saw these massive high-tensile titanium bolts holding a turbine mount together,” Winston Lee recalls. “There was an brutalist honesty to that connection. No adhesive, no decorative casing. Just raw mechanical clamping force.”',
      'That afternoon, the concept of Cuffed Design was born. Lee began experimenting with raw titanium rods, hand-bending them and using custom-tapped bolts as the locking cuffs. It was jewelry that wore its structure on its sleeve—literally.',
      'Each cuff is laser-etched with the latitude and longitude of the exact Miami atelier where it was hammered. “Our audience values authenticity above all else. They want to feel the weight of the metal and understand the structural narrative.”'
    ],
    author: 'Winston Lee',
    authorRole: 'Lead Designer, Cuffed Design',
    likes: 112
  }
];

export default function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    if (window.showLuxuryToast) {
      window.showLuxuryToast('Your appreciation has been recorded in the editorial registry.');
    }
  };

  return (
    <div id="journal-page-root" className="pt-28 pb-24 bg-black min-h-screen text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            TheMainKeys Editorial Portal
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            THE <span className="font-serif italic font-light text-gold-200">JOURNAL</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Delve into behind-the-scenes logs, material research studies, design blueprints, and strategic insights curated directly by our co-founders and venture leaders.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_ARTICLES.map((art) => {
            const currentLikes = art.likes + (likes[art.id] || 0);
            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="group border border-neutral-900 bg-neutral-950/40 hover:bg-neutral-950 rounded-lg overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-gold-500/20"
              >
                <div className="space-y-4">
                  {/* Photo Frame */}
                  <div className="h-56 bg-neutral-900 overflow-hidden relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-neutral-900 rounded font-mono text-[8px] tracking-widest text-gold-400 uppercase">
                      {art.category}
                    </span>
                  </div>

                  {/* Text Container */}
                  <div className="px-6 space-y-3">
                    <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.readTime}</span>
                      <span>{art.date}</span>
                    </div>

                    <h3 className="font-sans font-bold text-sm text-white group-hover:text-gold-300 transition-colors uppercase leading-snug tracking-tight">
                      {art.title}
                    </h3>

                    <p className="text-neutral-400 text-xs font-light leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="px-6 py-4 border-t border-neutral-900 mt-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-medium">{art.author}</span>
                    <span className="text-[8px] text-neutral-500 font-mono uppercase tracking-wider">{art.authorRole}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLike(art.id, e)}
                      className="flex items-center gap-1.5 text-neutral-500 hover:text-pink-500 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span className="font-mono text-[10px]">{currentLikes}</span>
                    </button>
                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* FULL READ MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-3xl bg-[#030303] border border-neutral-900 rounded-lg overflow-hidden my-8 shadow-2xl">
              
              <div className="p-6 border-b border-neutral-900 bg-[#070707] flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-widest text-gold-400 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Editorial Dispatch
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-neutral-500 hover:text-white font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                    <span className="text-gold-400 uppercase">{selectedArticle.category}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>

                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase leading-snug">
                    {selectedArticle.title}
                  </h2>

                  <div className="flex items-center gap-3 py-3 border-y border-neutral-900">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center font-serif text-gold-400 font-bold text-xs border border-neutral-800">
                      {selectedArticle.author[0]}
                    </div>
                    <div>
                      <span className="block text-xs text-white font-bold">{selectedArticle.author}</span>
                      <span className="block text-[9px] text-neutral-500 font-mono uppercase tracking-wider">{selectedArticle.authorRole}</span>
                    </div>
                  </div>
                </div>

                {/* Banner Photo */}
                <div className="h-72 rounded overflow-hidden">
                  <img src={selectedArticle.image} alt="banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Article Content paragraphs */}
                <div className="space-y-4 text-neutral-300 text-sm leading-relaxed font-light font-sans">
                  {selectedArticle.content.map((p, index) => (
                    <p key={index}>{p}</p>
                  ))}
                </div>

                <div className="pt-6 border-t border-neutral-900 flex items-center justify-between">
                  <button
                    onClick={(e) => handleLike(selectedArticle.id, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-950 border border-neutral-900 hover:border-pink-500/20 text-neutral-400 hover:text-pink-500 rounded font-mono text-xs transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Appreciate ({selectedArticle.likes + (likes[selectedArticle.id] || 0)})</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      if (window.showLuxuryToast) window.showLuxuryToast('Article editorial link copied to private clipboard.');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-white rounded font-mono text-xs cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Log</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
