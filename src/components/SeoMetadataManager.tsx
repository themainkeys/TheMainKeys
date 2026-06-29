/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Brand, PageSeo } from '../types';
import { 
  Globe, 
  Sparkles, 
  Layers, 
  Monitor, 
  Share2, 
  Check, 
  Upload, 
  RefreshCw, 
  Eye, 
  AlertCircle 
} from 'lucide-react';

interface SeoMetadataManagerProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  pageSeo: PageSeo[];
  setPageSeo: React.Dispatch<React.SetStateAction<PageSeo[]>>;
}

export default function SeoMetadataManager({
  brands,
  setBrands,
  pageSeo,
  setPageSeo,
}: SeoMetadataManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'brands' | 'pages'>('brands');
  
  // Selection states
  const [selectedBrandId, setSelectedBrandId] = useState<string>(brands[0]?.id || '');
  const [selectedPageKey, setSelectedPageKey] = useState<string>(pageSeo[0]?.view || '');

  // Upload/simulation states
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Retrieve currently active targets
  const currentBrand = brands.find(b => b.id === selectedBrandId);
  const currentPage = pageSeo.find(p => p.view === selectedPageKey);

  // Form local state to allow fine-tuning before saving
  const [brandTitle, setBrandTitle] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [brandOgImage, setBrandOgImage] = useState('');

  const [pageTitle, setPageTitle] = useState('');
  const [pageDesc, setPageDesc] = useState('');
  const [pageOgImage, setPageOgImage] = useState('');

  // Sync state whenever selection changes
  React.useEffect(() => {
    if (currentBrand) {
      setBrandTitle(currentBrand.metaTitle || `${currentBrand.name} | TheMainKeys Ventures`);
      setBrandDesc(currentBrand.metaDesc || currentBrand.description || '');
      setBrandOgImage(currentBrand.ogImage || currentBrand.coverImage || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200');
    }
  }, [selectedBrandId, currentBrand]);

  React.useEffect(() => {
    if (currentPage) {
      setPageTitle(currentPage.title);
      setPageDesc(currentPage.description);
      setPageOgImage(currentPage.ogImage || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200');
    }
  }, [selectedPageKey, currentPage]);

  const handleSaveBrandSeo = () => {
    if (!selectedBrandId) return;
    
    setBrands(prevBrands => 
      prevBrands.map(b => 
        b.id === selectedBrandId 
          ? { 
              ...b, 
              metaTitle: brandTitle, 
              metaDesc: brandDesc, 
              ogImage: brandOgImage 
            } 
          : b
      )
    );

    if (window.showLuxuryToast) {
      window.showLuxuryToast(`SEO metadata updated for ${currentBrand?.name}.`);
    } else {
      alert(`Success: Brand SEO updated!`);
    }
  };

  const handleSavePageSeo = () => {
    if (!selectedPageKey) return;

    setPageSeo(prevPages => 
      prevPages.map(p => 
        p.view === selectedPageKey 
          ? { 
              ...p, 
              title: pageTitle, 
              description: pageDesc, 
              ogImage: pageOgImage 
            } 
          : p
      )
    );

    if (window.showLuxuryToast) {
      window.showLuxuryToast(`SEO metadata updated for ${selectedPageKey.toUpperCase()} page.`);
    } else {
      alert(`Success: Page SEO updated!`);
    }
  };

  // Drag and drop simulations
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadSuccess(false);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Preset premium simulated og:image URLs
      const mockImages = [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
        'https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=1200',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200'
      ];
      const randomUrl = mockImages[Math.floor(Math.random() * mockImages.length)];
      
      if (activeSubTab === 'brands') {
        setBrandOgImage(randomUrl);
      } else {
        setPageOgImage(randomUrl);
      }

      if (window.showLuxuryToast) {
        window.showLuxuryToast('Open Graph luxury asset parsed and optimized (1200x630px).');
      }
    }, 1200);
  };

  return (
    <div className="p-8 space-y-8 text-neutral-300">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase flex items-center gap-2">
            <Globe className="w-6 h-6 text-gold-400" />
            SEO & Platform Discoverability
          </h1>
          <p className="text-neutral-500 text-xs">
            Directly optimize header tags, dynamic description meta markers, and open-graph imagery for crawlers, social platforms, and digital indexes.
          </p>
        </div>

        {/* Custom Segmented Tab */}
        <div className="flex bg-neutral-950 border border-neutral-900 rounded p-1 shrink-0">
          <button
            onClick={() => setActiveSubTab('brands')}
            className={`px-4 py-1.5 rounded text-[10px] tracking-wider font-mono transition-all uppercase cursor-pointer ${
              activeSubTab === 'brands'
                ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-semibold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Brand Portfolios
          </button>
          <button
            onClick={() => setActiveSubTab('pages')}
            className={`px-4 py-1.5 rounded text-[10px] tracking-wider font-mono transition-all uppercase cursor-pointer ${
              activeSubTab === 'pages'
                ? 'bg-gradient-to-r from-[#f27d26] to-[#b3913b] text-black font-semibold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            System Pages
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Target Selector (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-neutral-900 bg-[#0a0a0a] rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-400" />
              <h3 className="font-sans font-bold text-xs tracking-wider text-white uppercase">
                {activeSubTab === 'brands' ? 'SELECT BRAND PROFILE' : 'SELECT PLATFORM PAGE'}
              </h3>
            </div>
            
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Choose a specific target below to review and customize its dedicated tags. Modified tags are injected dynamically.
            </p>

            {activeSubTab === 'brands' ? (
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrandId(b.id)}
                    className={`w-full text-left p-3 rounded border text-xs transition-all flex justify-between items-center cursor-pointer ${
                      selectedBrandId === b.id
                        ? 'bg-neutral-900/80 border-gold-400 text-white'
                        : 'bg-neutral-950 border-neutral-900/60 hover:bg-neutral-900/40 text-neutral-400'
                    }`}
                  >
                    <div>
                      <span className="font-semibold block">{b.name}</span>
                      <span className="text-[9px] text-neutral-500 font-mono tracking-wider">{b.category}</span>
                    </div>
                    {b.metaTitle && b.metaDesc && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {pageSeo.map(p => (
                  <button
                    key={p.view}
                    onClick={() => setSelectedPageKey(p.view)}
                    className={`w-full text-left p-3 rounded border text-xs transition-all flex justify-between items-center cursor-pointer ${
                      selectedPageKey === p.view
                        ? 'bg-neutral-900/80 border-gold-400 text-white'
                        : 'bg-neutral-950 border-neutral-900/60 hover:bg-neutral-900/40 text-neutral-400'
                    }`}
                  >
                    <div className="capitalize">
                      <span className="font-semibold block">{p.view === 'home' ? 'Home Portal' : p.view} Page</span>
                      <span className="text-[9px] text-neutral-500 font-mono tracking-wider">/{p.view === 'home' ? '' : p.view}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="border border-neutral-900 bg-[#0a0a0a]/50 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-gold-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-sans font-bold text-[10px] tracking-wider uppercase">Venture SEO Rulebook</span>
            </div>
            <ul className="space-y-2 text-[10px] text-neutral-500 leading-relaxed list-disc list-inside">
              <li>Keep title tags between 50-60 characters. Avoid repetitive keyword stuffing.</li>
              <li>Limit meta descriptions to 155 characters for complete desktop readability.</li>
              <li>Ensure Open Graph images use the optimal <span className="text-neutral-300">1200x630</span> resolution format for Slack, WhatsApp, and Twitter card previews.</li>
            </ul>
          </div>
        </div>

        {/* CENTER COLUMN: Fields & Visual Upload (8 cols split dynamically) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Metadata Forms (7 cols) */}
          <div className="md:col-span-7 border border-neutral-900 bg-[#0a0a0a] rounded-lg p-6 space-y-6">
            <div className="border-b border-neutral-900 pb-4">
              <h2 className="font-sans font-bold text-sm tracking-wider text-white uppercase">
                {activeSubTab === 'brands' ? `${currentBrand?.name} Parameters` : `${selectedPageKey.toUpperCase()} Page Parameters`}
              </h2>
              <p className="text-[10px] text-neutral-500">Fine-tune index values below. Changes apply upon clicking save.</p>
            </div>

            {activeSubTab === 'brands' ? (
              // BRAND FORM
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Title Tag</label>
                    <span className={`font-mono text-[9px] ${brandTitle.length > 60 || brandTitle.length < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {brandTitle.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={brandTitle}
                    onChange={(e) => setBrandTitle(e.target.value)}
                    placeholder="Enter meta title tag..."
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Meta Description</label>
                    <span className={`font-mono text-[9px] ${brandDesc.length > 155 || brandDesc.length < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {brandDesc.length} / 155 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={brandDesc}
                    onChange={(e) => setBrandDesc(e.target.value)}
                    placeholder="Enter short description tag..."
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-xs text-white resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Open Graph Image (OG Image) URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={brandOgImage}
                      onChange={(e) => setBrandOgImage(e.target.value)}
                      placeholder="Paste image asset URL..."
                      className="flex-1 bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-xs text-white font-mono"
                    />
                    {currentBrand?.coverImage && (
                      <button
                        onClick={() => setBrandOgImage(currentBrand.coverImage || '')}
                        className="px-3 border border-neutral-800 hover:border-gold-400 rounded text-[9px] font-mono hover:text-white uppercase shrink-0 cursor-pointer"
                        title="Use cover image"
                      >
                        Reset Cover
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulated file upload area */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Upload Custom OG Card</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={simulateUpload}
                    className={`border border-dashed rounded p-5 text-center cursor-pointer transition-all ${
                      dragActive ? 'border-gold-400 bg-gold-950/10' : 'border-neutral-900 hover:border-neutral-800 bg-neutral-950/20'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <RefreshCw className="w-5 h-5 text-gold-400 animate-spin" />
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">Uploading luxury image asset...</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="w-5 h-5 text-gold-400 mx-auto" />
                        <span className="block font-sans text-[10px] text-neutral-400">
                          Click to upload or drag files
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveBrandSeo}
                  className="w-full py-3 bg-gradient-to-r from-[#f27d26] to-[#b3913b] hover:from-[#e06f1d] hover:to-[#a38031] text-black font-sans font-bold text-xs tracking-widest uppercase transition-all rounded shadow-md cursor-pointer flex justify-center items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Brand SEO Metadata
                </button>
              </div>
            ) : (
              // PAGE FORM
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Page Title Tag</label>
                    <span className={`font-mono text-[9px] ${pageTitle.length > 60 || pageTitle.length < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {pageTitle.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Enter page meta title tag..."
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Meta Description</label>
                    <span className={`font-mono text-[9px] ${pageDesc.length > 155 || pageDesc.length < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {pageDesc.length} / 155 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={pageDesc}
                    onChange={(e) => setPageDesc(e.target.value)}
                    placeholder="Enter page description tag..."
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-xs text-white resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">OG Image URL</label>
                  <input
                    type="text"
                    value={pageOgImage}
                    onChange={(e) => setPageOgImage(e.target.value)}
                    placeholder="Paste image asset URL..."
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-xs text-white font-mono"
                  />
                </div>

                {/* Simulated file upload area */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Upload Custom OG Card</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={simulateUpload}
                    className={`border border-dashed rounded p-5 text-center cursor-pointer transition-all ${
                      dragActive ? 'border-gold-400 bg-gold-950/10' : 'border-neutral-900 hover:border-neutral-800 bg-neutral-950/20'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <RefreshCw className="w-5 h-5 text-gold-400 animate-spin" />
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">Uploading luxury image asset...</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="w-5 h-5 text-gold-400 mx-auto" />
                        <span className="block font-sans text-[10px] text-neutral-400">
                          Click to upload or drag files
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSavePageSeo}
                  className="w-full py-3 bg-gradient-to-r from-[#f27d26] to-[#b3913b] hover:from-[#e06f1d] hover:to-[#a38031] text-black font-sans font-bold text-xs tracking-widest uppercase transition-all rounded shadow-md cursor-pointer flex justify-center items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Page SEO Metadata
                </button>
              </div>
            )}
          </div>

          {/* Dynamic real-time previewers (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Google Search Snippet Card */}
            <div className="border border-neutral-900 bg-[#0a0a0a] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-neutral-500">
                <Monitor className="w-3.5 h-3.5" />
                <span className="font-sans font-bold text-[9px] uppercase tracking-wider">Google Snippet Preview</span>
              </div>

              <div className="p-4 bg-white rounded text-left font-sans text-xs space-y-1 shadow">
                <div className="text-[11px] text-[#202124] flex items-center gap-1 truncate font-sans">
                  <span>themainkeys.com</span>
                  <span className="text-[#5f6368] text-[9px]">›</span>
                  <span className="text-[#5f6368] text-[9px] font-sans">
                    {activeSubTab === 'brands' ? `brands` : `portal`}
                  </span>
                </div>
                <h4 className="text-[#1a0dab] hover:underline text-base leading-tight font-sans truncate cursor-pointer font-medium">
                  {activeSubTab === 'brands' ? brandTitle : pageTitle}
                </h4>
                <p className="text-[#4d5156] text-[11px] leading-relaxed font-sans line-clamp-2">
                  {activeSubTab === 'brands' ? brandDesc || 'No meta description tag written yet. Search engines will fallback to random page content.' : pageDesc}
                </p>
              </div>
            </div>

            {/* Social Share / Open Graph Card */}
            <div className="border border-neutral-900 bg-[#0a0a0a] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-neutral-500">
                <Share2 className="w-3.5 h-3.5" />
                <span className="font-sans font-bold text-[9px] uppercase tracking-wider">Social Link Preview (Facebook/iMessage/X)</span>
              </div>

              <div className="rounded-lg border border-neutral-900 bg-neutral-950 overflow-hidden text-left text-xs text-neutral-400">
                <div className="h-28 overflow-hidden relative bg-neutral-900">
                  <img
                    src={activeSubTab === 'brands' ? brandOgImage : pageOgImage}
                    alt="Open Graph Previews"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-neutral-950/80 rounded font-mono text-[8px] uppercase text-gold-400">
                    OG:IMAGE 1200x630
                  </div>
                </div>
                
                <div className="p-3.5 space-y-1 border-t border-neutral-900 bg-neutral-950">
                  <span className="font-mono text-[8px] text-neutral-600 block uppercase tracking-wider">THEMAINKEYS.COM</span>
                  <h4 className="text-[11px] font-bold text-neutral-200 line-clamp-1">
                    {activeSubTab === 'brands' ? brandTitle : pageTitle}
                  </h4>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {activeSubTab === 'brands' ? brandDesc || 'TheMainKeys luxury venture studio portal...' : pageDesc}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
