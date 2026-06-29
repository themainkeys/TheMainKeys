/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../components/LanguageContext';
import { Brand, Founder, MediaItem } from '../types';
import { Download, FileText, Play, ChevronLeft, Sparkles, LayoutGrid, Heart, BookOpen, Quote } from 'lucide-react';
import CampaignSlider from '../components/CampaignSlider';

interface BrandDetailPageProps {
  brand: Brand;
  founders: Founder[];
  mediaItems: MediaItem[];
  onBackClick: () => void;
}

export default function BrandDetailPage({ brand, founders, mediaItems, onBackClick }: BrandDetailPageProps) {
  const [activeSubSection, setActiveSubSection] = useState<'story' | 'gallery' | 'catalogs' | 'casestudy'>('story');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

  const { language, t } = useLanguage();

  // Find affiliated founders
  const brandFounders = founders.filter((f) => brand.founderIds.includes(f.id));

  const handlePdfAction = () => {
    if (brand.customPdfUrl) {
      const link = document.createElement('a');
      link.href = brand.customPdfUrl;
      link.target = '_blank';
      link.download = brand.customPdfName || `${brand.name.toLowerCase().replace(/\s+/g, '_')}_executive_summary.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (window.showLuxuryToast) {
        window.showLuxuryToast(
          language === 'fr'
            ? `Téléchargement du document d'executive summary attaché pour ${brand.name}`
            : `Downloading premium custom executive summary for ${brand.name}`
        );
      }
    } else {
      generateBrandPdf();
    }
  };

  const generateBrandPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const isFr = language === 'fr';

    // Luxury background header banner
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Thin gold accent bar
    doc.setFillColor(179, 145, 59);
    doc.rect(0, 45, 210, 2, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(
      isFr 
        ? 'THEMAINKEYS ENTERPRISES  //  REPERTOIRE DE CONCIERGERIE GENERALE' 
        : 'THEMAINKEYS ENTERPRISES  //  GLOBAL VENTURE DIRECTORY', 
      15, 
      18
    );

    doc.setFontSize(18);
    doc.setTextColor(179, 145, 59);
    doc.text(
      isFr 
        ? 'COMPTE RENDU EXECUTIF' 
        : 'EXECUTIVE SUMMARY', 
      15, 
      32
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text(
      isFr 
        ? 'PORTFOLIO DE MARQUES DE LUXE' 
        : 'PREMIUM LUXURY PORTFOLIO INTEL', 
      135, 
      32
    );

    let y = 60;

    // Brand Header Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(10, 10, 10);
    doc.text(brand.name.toUpperCase(), 15, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(150, 120, 50);
    doc.text(
      `${isFr ? 'CATEGORIE' : 'CATEGORY'}: ${brand.category.toUpperCase()}  |  STATUS: ${brand.status.toUpperCase()}`, 
      15, 
      y
    );
    y += 12;

    // Overview Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 10, 10);
    doc.text(isFr ? 'PRESENTATION GENERALE' : 'OVERVIEW', 15, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const descLines = doc.splitTextToSize(brand.description || '', 180);
    doc.text(descLines, 15, y);
    y += descLines.length * 5 + 8;

    // Story Block
    const storyText = brand.brandStory || brand.longDescription || '';
    if (storyText) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(10, 10, 10);
      doc.text(isFr ? 'HISTOIRE & ARCHITECTURE DE LA MARQUE' : 'BRAND STORY & ARCHITECTURE', 15, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      const storyLines = doc.splitTextToSize(storyText, 180);
      doc.text(storyLines, 15, y);
      y += storyLines.length * 5 + 10;
    }

    // Case Study & Performance Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 10, 10);
    doc.text(isFr ? 'ANALYSE DE CAS STRATEGIQUE' : 'STRATEGIC CASE STUDY', 15, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const caseText = brand.caseStudyContent || (
      isFr 
        ? 'TheMainKeys agit en tant que concepteur visuel strategique et partenaire de soutien numerique. En restructurant les modeles d’e-commerce et en produisant des campagnes editoriales de haute couture, nous accelerons l’engagement organique mondial.'
        : 'TheMainKeys serves as the strategic visual designer and digital support partner. By re-architecting e-commerce models and producing cinematic editorial catalogs, we accelerate global organic brand engagement and secure conversion rates.'
    );
    const caseLines = doc.splitTextToSize(caseText, 180);
    doc.text(caseLines, 15, y);
    y += caseLines.length * 5 + 12;

    // Affiliated Founders
    if (brandFounders.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(10, 10, 10);
      doc.text(isFr ? 'DIRIGEANTS AFFILIES' : 'AFFILIATED LEADERSHIP', 15, y);
      y += 6;

      brandFounders.forEach((founder) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(20, 20, 20);
        doc.text(`${founder.name} — ${founder.role}`, 15, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(80, 80, 80);
        const bioLines = doc.splitTextToSize(founder.biography || '', 180);
        doc.text(bioLines, 15, y);
        y += bioLines.length * 4 + 6;
      });
    }

    // Footer lines
    doc.setDrawColor(210, 210, 210);
    doc.line(15, 275, 195, 275);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      isFr 
        ? 'DOCUMENT DE CONCIERGERIE SECURISE // 2026 THEMAINKEYS VENTURES & STUDIO LLC' 
        : 'CONCIERGE DECRYPTED KEY DOCUMENT // 2026 THEMAINKEYS VENTURES & STUDIO LLC', 
      15, 
      281
    );
    doc.text(
      isFr 
        ? 'DISTRICT DU DESIGN DE MIAMI // PARIS, FRANCE // CONFIDENTIEL' 
        : 'MIAMI DESIGN DISTRICT // PARIS, FRANCE // CONFIDENTIAL & PROPRIETARY', 
      15, 
      285
    );

    // Save the PDF
    const filename = `${brand.name.toLowerCase().replace(/\s+/g, '_')}_fact_sheet.pdf`;
    doc.save(filename);

    if (window.showLuxuryToast) {
      window.showLuxuryToast(
        isFr 
          ? `Compte rendu executif compile avec succes pour ${brand.name}.` 
          : `Executive Summary Fact Sheet successfully compiled for ${brand.name}.`
      );
    }
  };

  // Find relevant media library files matching this brand tags/name
  const brandMedia = mediaItems.filter((item) => {
    const brandNameLower = brand.name.toLowerCase();
    const isMatched = item.tags?.some(tag => brandNameLower.includes(tag.toLowerCase()) || tag.toLowerCase().includes(brandNameLower)) 
      || item.name.toLowerCase().includes(brandNameLower)
      || (brand.id === 'cle_paris' && item.tags?.includes('CLÉ Paris'))
      || (brand.id === 'pier_st_barth' && item.tags?.includes('Pier St Barth'))
      || (brand.id === 'cuffed_design' && item.tags?.includes('Cuffed'));
    return isMatched;
  });

  // Extract catalog PDFs
  const pdfs = brandMedia.filter(item => item.type === 'pdf') || [];
  // Extract images
  const images = brandMedia.filter(item => item.type === 'image') || [];
  // Extract videos
  const videos = brandMedia.filter(item => item.type === 'video') || [];

  return (
    <div id={`brand-detail-${brand.id}`} className="pt-28 pb-24 bg-[#030303] min-h-screen relative">
      
      {/* Absolute Backdrop Cover Banner */}
      <div className="absolute top-0 left-0 w-full h-[500px] z-0 overflow-hidden">
        {brand.coverImage ? (
          <img
            src={brand.coverImage}
            alt={`${brand.name} Banner`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gold-500/5 to-transparent"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back navigation button */}
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-neutral-400 hover:text-white text-xs tracking-widest uppercase transition-colors mb-8 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO BRANDS
        </button>

        {/* Brand Headline Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end border-b border-neutral-900 pb-12 mb-12">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-[9px] tracking-[0.35em] text-gold-400 uppercase block">
              {brand.category}
            </span>
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
              {brand.name}
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
              {brand.description}
            </p>
            <div className="pt-2">
              <button
                id={`download-factsheet-${brand.id}`}
                onClick={handlePdfAction}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-gold-500/30 hover:border-gold-400 text-gold-400 hover:text-white rounded text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                <Download className="w-3.5 h-3.5 text-gold-400" />
                {t('brand.download_summary')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end gap-3">
            {brand.logo && (
              <img
                src={brand.logo}
                alt={`${brand.name} Logo`}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded border border-neutral-800 bg-neutral-950 p-2 object-cover"
              />
            )}
            <div className="text-right">
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-widest">ECOSYSTEM STATUS</span>
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase mt-1 ${
                brand.status === 'Coming Soon' 
                  ? 'border border-gold-500/20 bg-gold-950/20 text-gold-400' 
                  : 'border border-green-500/20 bg-green-950/20 text-green-400'
              }`}>
                {brand.status}
              </span>
            </div>
          </div>
        </div>

        {/* Subsection Selector Tabs */}
        <div className="flex border-b border-neutral-900 pb-1 mb-12 overflow-x-auto gap-8">
          {[
            { id: 'story', label: 'BRAND STORY & ARCHITECTURE' },
            { id: 'gallery', label: 'CAMPAIGNS & IMAGERY' },
            { id: 'catalogs', label: 'PDF LOOKBOOKS & CATALOGS' },
            { id: 'casestudy', label: 'CASE STUDY ANALYSIS' },
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubSection(sub.id as any)}
              className={`pb-4 font-sans text-xs tracking-widest transition-colors cursor-pointer relative whitespace-nowrap ${
                activeSubSection === sub.id ? 'text-gold-300 font-semibold' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {sub.label}
              {activeSubSection === sub.id && (
                <motion.div
                  layoutId="brandSubUnderline"
                  className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gold-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* Subsection Render Area */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeSubSection === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                {/* Brand Story Column */}
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold-400" /> Brand Story
                  </h3>
                  <div className="p-6 border border-neutral-900 bg-neutral-950/30 rounded-lg">
                    <p className="text-neutral-300 text-sm leading-relaxed font-light whitespace-pre-line">
                      {brand.brandStory || 'Conceived in central hubs of design and lifestyle elegance, this brand presents meticulous styling coordinates and artisan attention. Supported fully by the tech-stack, digital operations, and strategic advisory branches of TheMainKeys Ventures.'}
                    </p>
                  </div>

                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase mt-8 block">
                    Comprehensive Narrative
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed font-light">
                    {brand.longDescription || 'Designed to disrupt legacy frameworks, this venture integrates state of the art e-commerce platform solutions, high fidelity brand development assets, and digital strategy. Through direct distribution and digital curation pipelines, we bring fine craftsmanship closer to global tastemakers.'}
                  </p>
                </div>

                {/* Founder details column */}
                <div className="lg:col-span-4 space-y-6">
                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">
                    Affiliated Leadership
                  </h3>
                  {brandFounders.length > 0 ? (
                    brandFounders.map((founder) => (
                      <div key={founder.id} className="p-5 border border-neutral-900 bg-neutral-950/60 rounded-lg space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={founder.portrait}
                            alt={founder.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border border-gold-500/20"
                          />
                          <div>
                            <h4 className="font-sans font-bold text-sm text-white">
                              {founder.name}
                            </h4>
                            <span className="font-mono text-[8px] text-neutral-500 uppercase">
                              {founder.role}
                            </span>
                          </div>
                        </div>
                        <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-3">
                          {founder.biography}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 border border-dashed border-neutral-900 rounded-lg text-center">
                      <span className="font-mono text-[9px] text-neutral-600 uppercase">
                        Developed Collaboratively by TheMainKeys
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeSubSection === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Touch-Responsive Campaign Slider */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 pb-4 border-b border-neutral-900">
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[#f27d26] uppercase font-bold block mb-1">
                        FEATURED MEDIA
                      </span>
                      <h3 className="font-sans font-extrabold text-2xl tracking-tight text-white uppercase">
                        Cinematic Campaigns
                      </h3>
                    </div>
                    <p className="text-neutral-400 text-xs font-light max-w-md sm:text-right">
                      Interactive lookbook & loops captured on location by the creative production studio of TheMainKeys.
                    </p>
                  </div>
                  
                  <CampaignSlider 
                    brandId={brand.id} 
                    brandName={brand.name} 
                    mediaItems={brandMedia} 
                  />
                </div>

                {/* Supplementary Media Grid */}
                <div className="space-y-6 pt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-sans font-bold text-xs tracking-wider text-white uppercase">
                      Additional Curated Assets
                    </h4>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase">
                      {images.length} ARCHIVED SHOTS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Map over Brand Images */}
                    {images.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedMediaUrl(img.url)}
                        className="group relative h-72 border border-neutral-900 bg-neutral-950 rounded overflow-hidden cursor-pointer"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="font-mono text-[10px] tracking-widest text-white border border-white/20 bg-black/65 px-4 py-2 rounded">
                            VIEW IMAGE
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/80 border border-neutral-800 rounded text-[8px] text-neutral-400 font-mono">
                          {img.collection || 'Campaign'}
                        </div>
                      </div>
                    ))}

                    {/* Sample fallback images if empty */}
                    {images.length === 0 && (
                      <>
                        <div className="h-72 bg-neutral-950/40 border border-neutral-900 rounded p-6 flex flex-col justify-between">
                          <div className="w-8 h-8 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/15">
                            <LayoutGrid className="w-4 h-4 text-[#f27d26]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-sans font-semibold text-xs text-white uppercase">Campaign Mock Asset 1</h4>
                            <p className="text-neutral-500 text-[10px] leading-relaxed">Dynamic photography campaign captured by TheMainKeys Creative Production team.</p>
                          </div>
                          <span className="text-[8px] font-mono text-neutral-600">PRE-STAGED BY CMS</span>
                        </div>
                        <div className="h-72 bg-neutral-950/40 border border-neutral-900 rounded p-6 flex flex-col justify-between">
                          <div className="w-8 h-8 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/15">
                            <LayoutGrid className="w-4 h-4 text-[#f27d26]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-sans font-semibold text-xs text-white uppercase">Campaign Mock Asset 2</h4>
                            <p className="text-neutral-500 text-[10px] leading-relaxed">Product lookbook campaign shot on location.</p>
                          </div>
                          <span className="text-[8px] font-mono text-neutral-600">PRE-STAGED BY CMS</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubSection === 'catalogs' && (
              <motion.div
                key="catalogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">
                    Brand PDF Lookbooks, Seasonal Collections, & Catalogs
                  </h3>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">
                    Interactive PDF CMS Module
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Render brand catalogs */}
                  {brand.pdfCatalogs?.map((pdf, idx) => (
                    <div key={idx} className="p-6 border border-neutral-900 bg-neutral-950/40 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded border border-gold-500/20 bg-gold-500/5 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gold-400" />
                        </div>
                        <div>
                          <h4 className="font-sans font-bold text-sm text-white">
                            {pdf.name}
                          </h4>
                          <span className="font-mono text-[9px] text-neutral-500 uppercase">
                            Size: {pdf.size || '12.4 MB'} | File Type: Adobe PDF
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => window.showLuxuryToast ? window.showLuxuryToast(`Accessing secure download pipeline for Lookbook: ${pdf.name}`) : alert(`Initiating secure direct download for: ${pdf.name}`)}
                        className="p-3 border border-neutral-800 hover:border-gold-400 hover:bg-gold-500/5 rounded-full text-gold-300 hover:text-white transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Seeded general document */}
                  <div className="p-6 border border-neutral-900 bg-neutral-950/40 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded border border-neutral-800 bg-neutral-900/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-sm text-white">
                          {brand.name} Brand Overview Brochure.pdf
                        </h4>
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">
                          Size: 2.1 MB | File Type: Adobe PDF
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => window.showLuxuryToast ? window.showLuxuryToast(`Accessing secure download pipeline for: ${brand.name} Brand Overview Brochure.pdf`) : alert(`Initiating secure direct download for: ${brand.name} Brand Overview Brochure.pdf`)}
                      className="p-3 border border-neutral-800 hover:border-gold-400 hover:bg-gold-500/5 rounded-full text-gold-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubSection === 'casestudy' && (
              <motion.div
                key="casestudy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="p-8 border border-neutral-900 bg-neutral-950/60 rounded-lg space-y-6">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] tracking-widest text-gold-400 uppercase">
                      COLLABORATION INSIGHTS
                    </span>
                    <h3 className="font-sans font-extrabold text-2xl text-white uppercase">
                      {brand.caseStudyTitle || 'Developing Elite Digital Touchpoints'}
                    </h3>
                  </div>

                  <p className="text-neutral-400 text-xs leading-relaxed font-light whitespace-pre-line">
                    {brand.caseStudyContent || 'TheMainKeys serves as the strategic visual designer and backend digital support team. By re-architecting e-commerce models and producing cinematic editorial catalogs, we scaled our digital campaign reach, driving record organic interaction across global capitals.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-900">
                    <div className="p-4 border border-neutral-900 bg-neutral-950 rounded">
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase">DIGITAL PLATFORM SPEED</span>
                      <span className="font-sans font-bold text-xl text-white">SUB-SECOND</span>
                      <p className="text-[10px] text-neutral-600 mt-1">Built with high-efficiency Vite compilation structures.</p>
                    </div>
                    <div className="p-4 border border-neutral-900 bg-neutral-950 rounded">
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase">REACH ACCELERATION</span>
                      <span className="font-sans font-bold text-xl text-gold-400">+125% YOY</span>
                      <p className="text-[10px] text-neutral-600 mt-1">Driven by targeted fine arts campaigns.</p>
                    </div>
                    <div className="p-4 border border-neutral-900 bg-neutral-950 rounded">
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase">E-COMMERCE FLOWS</span>
                      <span className="font-sans font-bold text-xl text-white">INTEGRATED</span>
                      <p className="text-[10px] text-neutral-600 mt-1">Connected cleanly to custom luxury gateways.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox Modal for Large Image view */}
      {selectedMediaUrl && (
        <div
          onClick={() => setSelectedMediaUrl(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-screen">
            <img
              src={selectedMediaUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] object-contain border border-neutral-800"
            />
            <span className="absolute bottom-4 right-4 text-xs font-mono text-neutral-400 bg-black/80 px-3 py-1 border border-neutral-800 rounded">
              CLICK OUTSIDE TO CLOSE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
