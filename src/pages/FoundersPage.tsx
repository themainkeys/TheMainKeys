/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../components/LanguageContext';
import { Founder, Brand } from '../types';
import { Star, ArrowRight, Instagram, Linkedin, Twitter, Sparkles, Calendar, BookOpen, Layers, FileText } from 'lucide-react';

interface FoundersPageProps {
  founders: Founder[];
  brands: Brand[];
  onBrandClick: (id: string) => void;
}

export default function FoundersPage({ founders, brands, onBrandClick }: FoundersPageProps) {
  const { language, t } = useLanguage();
  const [selectedFounderId, setSelectedFounderId] = useState<string>(founders[0]?.id || '');

  // Sort founders by order
  const sortedFounders = [...founders].sort((a, b) => a.order - b.order);
  const selectedFounder = founders.find((f) => f.id === selectedFounderId) || founders[0];

  // Find brands related to the selected founder
  const relatedBrands = brands.filter((b) => {
    // Check if founderId matches, or is in the founderIds array
    return b.founderIds.includes(selectedFounder.id);
  });

  const handleGenerateFounderPdf = () => {
    if (!selectedFounder) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const isFr = language === 'fr';

    // 1. Draw rich dark luxury background
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');

    // 2. Beautiful gold dual-border framing the page
    doc.setDrawColor(179, 145, 59); // gold
    doc.setLineWidth(0.6);
    doc.rect(8, 8, 194, 281, 'S'); // outer gold line

    doc.setDrawColor(179, 145, 59);
    doc.setLineWidth(0.2);
    doc.rect(10, 10, 190, 277, 'S'); // inner gold line

    // 3. Watermark/Accent rings
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.1);
    doc.circle(200, 280, 50, 'S');
    doc.circle(10, 20, 60, 'S');

    // 4. Header Section
    doc.setFillColor(20, 20, 20);
    doc.rect(11, 11, 188, 30, 'F');

    doc.setTextColor(179, 145, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(
      isFr 
        ? 'THEMAINKEYS ENTERPRISES  //  PORTFOLIO DES DIRIGEANTS & FONDATEURS' 
        : 'THEMAINKEYS ENTERPRISES  //  FOUNDER & EXECUTIVE REPERTOIRE', 
      20, 
      22
    );

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(
      isFr 
        ? 'FICHE DE PRESENTATION OFFICIELLE' 
        : 'OFFICIAL EXECUTIVE BIO CARD', 
      20, 
      32
    );

    // Seal text in header
    doc.setDrawColor(179, 145, 59);
    doc.setLineWidth(0.3);
    doc.rect(155, 18, 32, 16, 'S');
    doc.setFontSize(6);
    doc.setTextColor(179, 145, 59);
    doc.text('APPROVED BY BOARD', 157, 24);
    doc.text('REPERTOIRE 2026', 157, 28);

    // 5. Founder Basic Profile (Two Columns below header)
    let y = 55;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    // Draw Name
    doc.text(selectedFounder.name.toUpperCase(), 20, y);
    y += 8;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(179, 145, 59);
    doc.text(selectedFounder.role, 20, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(`${selectedFounder.company.toUpperCase()}  |  COUNCIL STATUS: ACTIVE MEMBER`, 20, y);
    y += 12;

    // Biography Section
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.3);
    doc.line(20, y - 4, 190, y - 4); // separator

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(179, 145, 59);
    doc.text(isFr ? 'BIOGRAPHIE PROFESSIONNELLE' : 'PROFESSIONAL BIOGRAPHY', 20, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(210, 210, 210);
    const bioText = selectedFounder.biography || '';
    const bioLines = doc.splitTextToSize(bioText, 170);
    doc.text(bioLines, 20, y);
    y += bioLines.length * 5 + 10;

    // Milestones Section (Timeline)
    if (selectedFounder.timeline && selectedFounder.timeline.length > 0) {
      doc.setDrawColor(40, 40, 40);
      doc.setLineWidth(0.3);
      doc.line(20, y - 4, 190, y - 4); // separator

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(179, 145, 59);
      doc.text(isFr ? 'JALONS PROFESSIONNELS & TIMELINE' : 'KEY PROFESSIONAL MILESTONES', 20, y);
      y += 8;

      selectedFounder.timeline.forEach((mile) => {
        // Year circle & timeline vertical tick
        doc.setFillColor(179, 145, 59);
        doc.circle(22, y - 1, 1, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(179, 145, 59);
        doc.text(mile.year.toString(), 26, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(190, 190, 190);
        const eventLines = doc.splitTextToSize(mile.event, 145);
        doc.text(eventLines, 45, y);
        y += eventLines.length * 4.5 + 4;
      });
      y += 4;
    }

    // Associated Brands Section
    if (relatedBrands.length > 0) {
      doc.setDrawColor(40, 40, 40);
      doc.setLineWidth(0.3);
      doc.line(20, y - 4, 190, y - 4); // separator

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(179, 145, 59);
      doc.text(isFr ? 'ENTREPRISES & PORTFEUILLE DE MARQUES' : 'ASSOCIATED BRANDS & VENTURES', 20, y);
      y += 8;

      let brandX = 20;
      relatedBrands.forEach((b) => {
        // Draw a neat gold-accented capsule for each brand
        doc.setFillColor(18, 18, 18);
        doc.rect(brandX, y - 4, 52, 14, 'F');
        doc.setDrawColor(179, 145, 59);
        doc.setLineWidth(0.15);
        doc.rect(brandX, y - 4, 52, 14, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text(b.name, brandX + 4, y + 1);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(150, 150, 150);
        doc.text(b.category, brandX + 4, y + 6);

        brandX += 56;
        if (brandX > 170) {
          brandX = 20;
          y += 18;
        }
      });
      if (brandX !== 20) {
        y += 14;
      }
    }

    // Social Links Section
    if (selectedFounder.socialLinks && selectedFounder.socialLinks.length > 0) {
      doc.setDrawColor(40, 40, 40);
      doc.setLineWidth(0.3);
      doc.line(20, y - 4, 190, y - 4); // separator

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(179, 145, 59);
      doc.text(isFr ? 'LIENS DE CONTACT NUMÉRIQUE' : 'DIGITAL CONNECTIONS', 20, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      const socialTexts = selectedFounder.socialLinks.map(s => `${s.platform}: ${s.url}`).join('  |  ');
      doc.text(socialTexts, 20, y);
    }

    // 6. Signature / Footer area
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.3);
    doc.line(20, 272, 190, 272); // bottom separator

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text(
      isFr 
        ? 'DOCUMENT DE CONCIERGERIE SÉCURISÉ // © 2026 THEMAINKEYS REPERTOIRE CORP' 
        : 'SECURE CONCIERGE DOCUMENT // © 2026 THEMAINKEYS REPERTOIRE CORP', 
      20, 
      277
    );
    doc.text(
      isFr 
        ? 'DISTRICT DU DESIGN DE MIAMI & PARIS, FRANCE // CLASSIFIÉ CONFIDENTIEL' 
        : 'MIAMI DESIGN DISTRICT & PARIS, FRANCE // HIGH-PRIORITY CONFIDENTIAL', 
      20, 
      281
    );

    // Save the PDF
    const filename = `founder_${selectedFounder.name.toLowerCase().replace(/\s+/g, '_')}_bio.pdf`;
    doc.save(filename);

    if (window.showLuxuryToast) {
      window.showLuxuryToast(
        isFr 
          ? `Carte de présentation d'élite exportée avec succès pour ${selectedFounder.name}.` 
          : `Executive Bio Card successfully generated for ${selectedFounder.name}.`
      );
    }
  };

  return (
    <div id="founders-page-root" className="pt-28 pb-24 bg-black min-h-screen relative">
      {/* Ambient background blur */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            {language === 'fr' ? 'LES PIONNIERS DU LUXE & DE LA TECH' : 'The Pioneers of Luxury & Tech'}
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            {language === 'fr' ? (
              <>FONDATEURS & <span className="font-serif italic font-light text-gold-200">DIRIGEANTS</span></>
            ) : (
              <>FOUNDERS & <span className="font-serif italic font-light text-gold-200">LEADERS</span></>
            )}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            {t('founders.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Navigation: List of Founders */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-mono text-[10px] text-neutral-500 tracking-wider uppercase mb-6 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Leadership Council
            </h3>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
              {sortedFounders.map((founder) => {
                const isActive = founder.id === selectedFounderId;
                return (
                  <button
                    key={founder.id}
                    id={`founder-btn-${founder.id}`}
                    onClick={() => setSelectedFounderId(founder.id)}
                    className={`flex items-center gap-4 p-4 rounded text-left shrink-0 lg:shrink transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? 'bg-neutral-950 border-gold-500/40 shadow-[0_4px_20px_rgba(179,145,59,0.05)]'
                        : 'bg-transparent border-transparent hover:border-neutral-900 hover:bg-neutral-950/20'
                    }`}
                  >
                    {/* Circle thumbnail */}
                    <div className={`w-10 h-10 rounded-full overflow-hidden border ${isActive ? 'border-gold-400' : 'border-neutral-900'}`}>
                      <img
                        src={founder.portrait}
                        alt={founder.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className={`font-sans font-bold text-sm tracking-tight ${isActive ? 'text-gold-300' : 'text-neutral-300'}`}>
                        {founder.name}
                      </h4>
                      <p className="font-mono text-[9px] text-neutral-500 uppercase">
                        {founder.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Main Profile View */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedFounder && (
                <motion.div
                  key={selectedFounder.id}
                  id={`founder-profile-${selectedFounder.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Portrait & Core Info card */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border border-neutral-900 bg-neutral-950/40 p-6 md:p-8 rounded-lg">
                    {/* Image */}
                    <div className="md:col-span-5 h-[320px] md:h-[380px] w-full rounded-md overflow-hidden bg-neutral-900 relative">
                      <img
                        src={selectedFounder.portrait}
                        alt={selectedFounder.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      {selectedFounder.featured && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 border border-gold-500/10 bg-black/85 rounded text-[8px] text-gold-400 font-mono tracking-widest uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Core Council
                        </div>
                      )}
                    </div>

                    {/* Metadata details */}
                    <div className="md:col-span-7 space-y-6 flex flex-col justify-between h-full">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-gold-400 tracking-widest uppercase">
                            {selectedFounder.company}
                          </span>
                          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-white tracking-tight uppercase leading-tight">
                            {selectedFounder.name}
                          </h2>
                          <p className="font-serif italic font-light text-neutral-400 text-sm">
                            {selectedFounder.role}
                          </p>
                        </div>

                        <div className="h-[1px] bg-neutral-900"></div>

                        <div className="space-y-2">
                          <h4 className="font-sans font-bold text-xs tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-gold-400" /> {t('founders.bio')}
                          </h4>
                          <p className="text-neutral-400 text-xs leading-relaxed font-light">
                            {selectedFounder.biography}
                          </p>
                        </div>
                      </div>
 
                      {/* Contact & PDF Export Actions */}
                      <div className="pt-4 border-t border-neutral-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {selectedFounder.socialLinks && selectedFounder.socialLinks.length > 0 ? (
                          <div className="space-y-2">
                            <h5 className="font-sans font-semibold text-[9px] tracking-widest text-neutral-500 uppercase">
                              Connect Directly
                            </h5>
                            <div className="flex flex-wrap gap-4">
                              {selectedFounder.socialLinks.map((link) => (
                                <a
                                  key={link.platform}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-gold-400 transition-colors uppercase font-mono"
                                >
                                  {link.platform === 'Instagram' && <Instagram className="w-3.5 h-3.5 text-gold-500" />}
                                  {link.platform === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
                                  {link.platform === 'Twitter' && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                                  {link.platform}
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}

                        <button
                          onClick={handleGenerateFounderPdf}
                          className="px-4 py-2 border border-gold-500 hover:border-gold-400 bg-gold-950/20 hover:bg-gold-500 hover:text-black text-gold-400 rounded text-[10px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-bold shrink-0 self-start md:self-center shadow-[0_2px_10px_rgba(179,145,59,0.1)]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {language === 'fr' ? 'Télécharger Carte Élite (PDF)' : 'Download Executive Card (PDF)'}
                        </button>
                      </div>
                    </div>
                  </div>
 
                  {/* Milestones / Timeline block if available */}
                  {selectedFounder.timeline && selectedFounder.timeline.length > 0 && (
                    <div className="border border-neutral-900 p-6 md:p-8 rounded-lg bg-neutral-950/20 space-y-6">
                      <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400" /> {t('founders.career')}
                      </h3>
                      <div className="relative border-l border-neutral-900 ml-3 space-y-6">
                        {selectedFounder.timeline.map((mile, i) => (
                          <div key={i} className="relative pl-6">
                            {/* Dot */}
                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gold-500 border border-black"></div>
                            <span className="font-mono text-xs font-bold text-gold-400 block mb-1">
                              {mile.year}
                            </span>
                            <p className="text-neutral-400 text-xs leading-relaxed font-light">
                              {mile.event}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Associated Brands Grid */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">
                      Associated Brands & support ventures
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relatedBrands.map((b) => (
                        <div
                          key={b.id}
                          id={`founder-brand-${b.id}`}
                          onClick={() => b.status !== 'Coming Soon' && onBrandClick(b.id)}
                          className={`p-5 border border-neutral-900 rounded-lg bg-neutral-950/60 flex items-center justify-between transition-all duration-300 ${
                            b.status === 'Coming Soon'
                              ? 'opacity-60 cursor-not-allowed'
                              : 'hover:border-gold-400/30 hover:bg-neutral-950 hover:shadow-lg cursor-pointer'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-sans font-bold text-sm text-white">
                              {b.name}
                            </h4>
                            <span className="font-mono text-[8px] text-neutral-500 uppercase">
                              {b.category}
                            </span>
                          </div>
                          {b.status === 'Coming Soon' ? (
                            <span className="font-mono text-[8px] text-gold-400 tracking-wider">
                              COMING SOON
                            </span>
                          ) : (
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-gold-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
