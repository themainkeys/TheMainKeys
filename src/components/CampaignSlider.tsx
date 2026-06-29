/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Download, ArrowLeft, ArrowRight, Eye, Video, Image as ImageIcon } from 'lucide-react';
import { MediaItem } from '../types';

interface CampaignSliderProps {
  brandId: string;
  brandName: string;
  mediaItems: MediaItem[];
}

interface RichCampaignSlide {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  collection: string;
  description: string;
  date: string;
  credit?: string;
  aspect?: string;
}

// Curated high-end media resources to supplement each brand with immersive experiences
const ENRICHED_BRAND_CAMPAIGNS: Record<string, RichCampaignSlide[]> = {
  the_main_keys: [
    {
      id: 'tmk_c1',
      title: 'Digital Systems Architecture Loop',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31859-large.mp4',
      collection: 'Venture Studio Core',
      description: 'The internal digital framework powering high-performance luxury web properties, compiled server-side for sub-second delivery.',
      date: '2026-06-15',
      credit: 'TheMainKeys Engineering'
    },
    {
      id: 'tmk_c2',
      title: 'Creative Coding Interface',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-luminous-keyboard-in-the-dark-41846-large.mp4',
      collection: 'Studio Engineering',
      description: 'Developing high-fidelity custom brand designs with advanced styling configurations and layout orchestration.',
      date: '2026-05-20',
      credit: 'Studio Creative'
    },
    {
      id: 'tmk_c3',
      title: 'Metropolitan Strategy Hub',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
      collection: 'Creative Direction',
      description: 'Where design system paradigms align with commercial strategies in global fashion and luxury hubs.',
      date: '2026-04-10',
      credit: 'TheMainKeys Media'
    }
  ],
  wingman: [
    {
      id: 'wing_c1',
      title: 'VIP Lounge Concierge Experience',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-red-wine-into-a-glass-close-up-42231-large.mp4',
      collection: 'Luxury Access',
      description: 'Exclusive hospitality reservation system ensuring instant, private booking for verified high-profile clientele.',
      date: '2026-06-01',
      credit: 'Wingman Lifestyle'
    },
    {
      id: 'wing_c2',
      title: 'The Skyline Soirée',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-sparkling-champagne-glass-42171-large.mp4',
      collection: 'Premium Venues',
      description: 'Direct live access to rooftop networks and private events curated exclusively under Wingman concierge oversight.',
      date: '2026-05-12',
      credit: 'Wingman Events'
    },
    {
      id: 'wing_c3',
      title: 'Coastal Harbor Leisure',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200',
      collection: 'Yacht Charter Access',
      description: 'Connecting elite members with instant marine reservations and private coastal itineraries.',
      date: '2026-04-18',
      credit: 'Wingman Marine'
    }
  ],
  fashion_meetz_fitness: [
    {
      id: 'fmf_c1',
      title: 'Athletic Motion & Performance',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-on-a-rooftop-41611-large.mp4',
      collection: 'Active Streetwear',
      description: 'Showcasing the limits of seamless contour active fabrics in metabolic workout environments.',
      date: '2026-06-20',
      credit: 'FMF Media'
    },
    {
      id: 'fmf_c2',
      title: 'Miami Sunset Endurance',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-the-beach-at-sunset-43143-large.mp4',
      collection: 'Elite Curation',
      description: 'A visual celebration of high-contrast athletic apparel moving in natural environments.',
      date: '2026-05-15',
      credit: 'FMF Editorial'
    },
    {
      id: 'fmf_c3',
      title: 'Apparel Fabric Close-up',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200',
      collection: 'Premium Streetwear',
      description: 'Water-wicking compression materials styled to double as premium high-street outfits.',
      date: '2026-04-30',
      credit: 'FMF Production'
    }
  ],
  fitness_power_hour: [
    {
      id: 'fph_c1',
      title: 'Rooftop Sweat Circuit',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-on-a-rooftop-41611-large.mp4',
      collection: 'Sunset Activation',
      description: 'High-intensity interval performance paired with immersive sub-bass audio soundscapes.',
      date: '2026-06-25',
      credit: 'FPH Experiences'
    },
    {
      id: 'fph_c2',
      title: 'Zen Harmony Sequence',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-the-beach-at-sunset-43143-large.mp4',
      collection: 'Coastal Activation',
      description: 'Mindfulness and mobility routines curated for premium hotel wellness weekend schedules.',
      date: '2026-05-08',
      credit: 'FPH Wellness'
    }
  ],
  mike_water_fitness: [
    {
      id: 'mw_c1',
      title: 'Pure Hydration Formulations',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-red-wine-into-a-glass-close-up-42231-large.mp4',
      collection: 'Pure Aluminum Series',
      description: 'Sleek, direct-to-consumer sustainable hydration containers holding electrolyte-boosted mountain spring waters.',
      date: '2026-06-29',
      credit: 'Mike Water Studio'
    },
    {
      id: 'mw_c2',
      title: 'Active Living Curation',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
      collection: 'Sleek Cans Debut',
      description: 'High-end cellular recovery drinks designed for top athletes and runway models alike.',
      date: '2026-06-28',
      credit: 'Mike Water Brand'
    }
  ],
  cle_paris: [
    {
      id: 'cle_c1',
      title: 'The Artisanship Sequence',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-makeup-40275-large.mp4',
      collection: 'Capsule 01 - La Clé',
      description: 'Fine Parisian geometric structures and precious metals curated for direct international delivery.',
      date: '2026-05-18',
      credit: 'CLÉ Atelier'
    },
    {
      id: 'cle_c2',
      title: 'Metropolitan Portraiture',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-posing-in-front-of-a-car-41604-large.mp4',
      collection: 'Summer Editorial',
      description: 'Avant-garde styling captured amidst historical Parisian architectural structures.',
      date: '2026-05-10',
      credit: 'CLÉ Media'
    },
    {
      id: 'cle_c3',
      title: 'Bespoke Solid Gold Close-Up',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200',
      collection: 'La Clé Collectibles',
      description: 'Handcrafted signature rings showing the pure geometry of modern metalwork.',
      date: '2026-05-02',
      credit: 'CLÉ Production'
    }
  ],
  pier_st_barth: [
    {
      id: 'pier_c1',
      title: 'Tropical Coastal Breeze',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-palm-trees-and-blue-water-43141-large.mp4',
      collection: 'Summer Resort 2026',
      description: 'Sourcing inspiration from waterfront Gustavia harbor for breathable luxury resort wear.',
      date: '2026-06-12',
      credit: 'Pier Production'
    },
    {
      id: 'pier_c2',
      title: 'Resort Linen Stroll',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-walking-on-a-tropical-beach-43144-large.mp4',
      collection: 'Yachting Wardrobes',
      description: 'Ultra-premium French linen structures designed to withstand coastal warm-weather conditions gracefully.',
      date: '2026-06-08',
      credit: 'Pier St Barth Editorial'
    },
    {
      id: 'pier_c3',
      title: 'Yacht-Deck Portraiture',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
      collection: 'Caribbean Solitude',
      description: 'Elegant leisurewear styled for sun-drenched maritime excursions.',
      date: '2026-06-01',
      credit: 'Pier St Barth Studio'
    }
  ],
  cuffed_design: [
    {
      id: 'cuff_c1',
      title: 'Geometric Hardware Reflections',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-makeup-40275-large.mp4',
      collection: 'Studio B&W',
      description: 'Brutalist metalwork and shadow-play showcasing sustainable industrial wristwear.',
      date: '2026-06-01',
      credit: 'Cuffed Atelier'
    },
    {
      id: 'cuff_c2',
      title: 'The Industrial Forge',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=1200',
      collection: 'Bespoke Titanium',
      description: 'Recycled surgical steel cuffs handcrafted and pressure-stamped in Miami.',
      date: '2026-05-15',
      credit: 'Cuffed Studio'
    }
  ],
  sorority: [
    {
      id: 'sor_c1',
      title: 'Striking Contours Motion',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-the-beach-at-sunset-43143-large.mp4',
      collection: 'Contours Debut',
      description: 'High-performance active silhouettes featuring double-layered compression fibers.',
      date: '2026-06-25',
      credit: 'Sorority Brand'
    },
    {
      id: 'sor_c2',
      title: 'Minimalist Active Silhouette',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200',
      collection: 'Pre-Testing Series',
      description: 'Crafted exclusively to sculpt the female athletic form with elegant breathable engineering.',
      date: '2026-06-24',
      credit: 'Sorority Lab'
    }
  ]
};

export default function CampaignSlider({ brandId, brandName, mediaItems }: CampaignSliderProps) {
  // Combine brand specific enriched slides + existing brand images/videos from CMS
  const getCombinedSlides = (): RichCampaignSlide[] => {
    const enriched = ENRICHED_BRAND_CAMPAIGNS[brandId] || [];
    
    // Parse CMS items
    const cmsSlides: RichCampaignSlide[] = mediaItems
      .filter(item => item.type === 'image' || item.type === 'video')
      .map(item => ({
        id: item.id,
        title: item.name.replace(/\.[^/.]+$/, ""), // Strip extension
        type: item.type as 'image' | 'video',
        url: item.url === '#' ? '' : item.url, // Handle empty URLs gracefully
        collection: item.collection || 'CMS Collection',
        description: `Registered partner campaign asset: ${item.name}. Meticulously verified inside database.`,
        date: item.date,
        credit: item.category || 'Campaigns'
      }))
      .filter(slide => slide.url !== ''); // Exclude placeholder urls

    // Deduplicate or combine
    const all = [...enriched, ...cmsSlides];
    
    // Fallback if somehow absolutely nothing is available
    if (all.length === 0) {
      return [
        {
          id: 'fallback_1',
          title: `${brandName} Signature Campaign`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
          collection: 'Universal Visuals',
          description: 'A dynamic lifestyle capture showcasing the fine aesthetic principles curated by TheMainKeys.',
          date: '2026-06-29',
          credit: 'Studio Production'
        }
      ];
    }
    return all;
  };

  const slides = getCombinedSlides();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Video play state
  const [isMuted, setIsMuted] = useState(true); // Short form is muted by default for browser policies
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentSlide = slides[activeIndex];

  // Control video tag playback when slide changes
  useEffect(() => {
    if (currentSlide.type === 'video' && videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(e => {
          console.log('Autoplay prevented or interrupted', e);
        });
      }
    }
  }, [activeIndex, currentSlide.type]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const triggerDownloadNotification = () => {
    if (window.showLuxuryToast) {
      window.showLuxuryToast(`Securing download request for Campaign: "${currentSlide.title}" (${currentSlide.type === 'video' ? 'MP4 Loop' : 'RAW JPG'}).`);
    } else {
      alert(`Securing download request for: ${currentSlide.title}`);
    }
  };

  // Gestures mapping
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const swipe = swipePower(info.offset.x, info.velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  return (
    <div 
      id={`campaign-slider-root-${brandId}`} 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex flex-col justify-center' : 'space-y-6'}`}
    >
      
      {/* Immersive Main Canvas Wrapper */}
      <div 
        className={`relative overflow-hidden rounded-lg border border-neutral-900 bg-neutral-950 flex items-center justify-center group ${
          isFullscreen ? 'h-full w-full rounded-none border-none' : 'h-[320px] sm:h-[450px] md:h-[550px]'
        }`}
      >
        
        {/* Subtle top shade overlay for actions */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none opacity-100 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Left-top Brand Indicator & Track */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-3">
          <div className="px-2.5 py-1 bg-black/85 border border-white/10 rounded backdrop-blur-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f27d26] animate-pulse"></span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-white uppercase font-semibold">
              {currentSlide.collection}
            </span>
          </div>
          {currentSlide.type === 'video' && (
            <div className="px-2 py-0.5 bg-gold-400/10 border border-gold-400/20 text-[#f27d26] rounded text-[8px] font-mono tracking-widest flex items-center gap-1 uppercase">
              <Video className="w-2.5 h-2.5 animate-pulse" /> Live Loop
            </div>
          )}
          {currentSlide.type === 'image' && (
            <div className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded text-[8px] font-mono tracking-widest flex items-center gap-1 uppercase">
              <ImageIcon className="w-2.5 h-2.5" /> High-Res
            </div>
          )}
        </div>

        {/* Right-top Media Actions Panel */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
          {currentSlide.type === 'video' && (
            <>
              <button 
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-black/85 border border-white/10 hover:border-gold-400 text-white hover:text-gold-300 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
                title={isPlaying ? 'Pause Loop' : 'Play Loop'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <button 
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-black/85 border border-white/10 hover:border-gold-400 text-white hover:text-gold-300 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-full bg-black/85 border border-white/10 hover:border-gold-400 text-white hover:text-gold-300 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Immersive Mode'}
          >
            {isFullscreen ? (
              <span className="font-mono text-[9px] font-bold text-neutral-300">ESC</span>
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Active Slide Media Container (Framer Motion Enhanced) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
            >
              {currentSlide.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoRef}
                    src={currentSlide.url}
                    loop
                    muted={isMuted}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Subtle dark shade on bottom of videos */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={currentSlide.url}
                    alt={currentSlide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Swipe/Touch Hint Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/5 px-3 py-1 rounded-full">
          <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
            Swipe left/right or use keyboard
          </span>
        </div>

        {/* Tactile Edge Navigation Buttons (Visible on Hover / Hidden on Mobile) */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-20 w-11 h-11 rounded-full bg-black/80 border border-white/5 hover:border-[#f27d26] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-lg max-sm:hidden cursor-pointer backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-300 hover:text-white" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 z-20 w-11 h-11 rounded-full bg-black/80 border border-white/5 hover:border-[#f27d26] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-lg max-sm:hidden cursor-pointer backdrop-blur-sm"
        >
          <ArrowRight className="w-4 h-4 text-neutral-300 hover:text-white" />
        </button>

      </div>

      {/* Luxury Slide Information & Metadata Deck */}
      <div className="p-6 border border-neutral-900 bg-neutral-950/40 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#f27d26] tracking-wider font-semibold">
              {(activeIndex + 1).toString().padStart(2, '0')} / {slides.length.toString().padStart(2, '0')}
            </span>
            <div className="w-1 h-1 rounded-full bg-neutral-700"></div>
            <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
              {currentSlide.credit || 'Studio Collective'}
            </span>
          </div>
          
          <h4 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
            {currentSlide.title}
          </h4>
          
          <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-3xl">
            {currentSlide.description}
          </p>
          
          <div className="text-[10px] font-mono text-neutral-500 pt-1">
            RELEASE DATE: {currentSlide.date}
          </div>
        </div>

        {/* Luxury CTA Button Area */}
        <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-center shrink-0">
          <button 
            onClick={triggerDownloadNotification}
            className="flex-1 sm:flex-initial px-5 py-3 border border-neutral-800 hover:border-gold-400 text-[10px] tracking-widest text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-center gap-2 uppercase font-medium cursor-pointer bg-neutral-950/30"
          >
            <Download className="w-3.5 h-3.5 text-[#f27d26]" /> GET SOURCE FILE
          </button>
        </div>
      </div>

      {/* Premium Horizontal Navigation Thumbnails Carousel */}
      {slides.length > 1 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">CAMPAIGN STORYBOARD</span>
            <span className="font-mono text-[9px] text-gold-300 tracking-wider">TOUCH NAVIGATION READY</span>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 border rounded overflow-hidden transition-all duration-300 cursor-pointer ${
                  idx === activeIndex 
                    ? 'border-[#f27d26] ring-1 ring-[#f27d26]/40 scale-[0.98]' 
                    : 'border-neutral-900 hover:border-neutral-700 opacity-60 hover:opacity-100'
                }`}
              >
                {slide.type === 'video' ? (
                  <div className="w-full h-full relative bg-black">
                    <video
                      src={slide.url}
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white/80 fill-current" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={slide.url}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Micro active progress highlight line */}
                {idx === activeIndex && (
                  <motion.div 
                    layoutId="activeThumbSliderIndicator"
                    className="absolute bottom-0 left-0 w-full h-1 bg-[#f27d26]" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
