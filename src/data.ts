/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Brand, Founder, MediaItem, ModelingItem, ProjectItem, Product, PromoCode } from './types';

export const INITIAL_FOUNDERS: Founder[] = [
  {
    id: 'anderson_djeemo',
    name: 'Anderson Djeemo',
    role: 'Founder & CEO',
    company: 'TheMainKeys',
    biography: 'Anderson Djeemo is a visionary entrepreneur, creative director, and digital strategist. As the Founder and CEO of TheMainKeys, he has built a premier venture studio and creative house. Under his direction, the studio designs, develops, and operates cutting-edge digital experiences, luxury brands, and technology platforms that reshape consumer engagement.',
    portrait: 'https://images.unsplash.com/photo-1618015358954-115ef1ed6515?q=80&w=600',
    featured: true,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/anderson_djeemo' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/andersondjeemo' },
      { platform: 'Twitter', url: 'https://twitter.com/andersondjeemo' }
    ],
    timeline: [
      { year: '2019', event: 'Founded TheMainKeys as a creative boutique consultancy.' },
      { year: '2021', event: 'Expanded into a full-scale venture studio with deep technical capabilities.' },
      { year: '2023', event: 'Launched Wingman App and initiated luxury retail collaborations in Paris and St Barth.' },
      { year: '2024', event: 'Consolidated Fashion, Hospitality, and Technology verticals under the unified parent entity.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600'
    ],
    relatedBrandIds: ['the_main_keys', 'wingman', 'fitness_power_hour'],
    order: 1
  },
  {
    id: 'michael_leggett',
    name: 'Michael Leggett',
    role: 'Founder',
    company: 'Fashion Meetz Fitness',
    biography: 'Michael Leggett is an elite athlete, wellness expert, and fashion pioneer. By merging high-performance training with premium lifestyle aesthetics, Michael founded Fashion Meetz Fitness (FMF). In collaboration with TheMainKeys, Michael directs fitness initiatives, wellness retreats, and hydration products designed to inspire healthier living.',
    portrait: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600',
    featured: true,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/michael_leggett' }
    ],
    timeline: [
      { year: '2020', event: 'Inception of Fashion Meetz Fitness community in Miami.' },
      { year: '2022', event: 'Partnered with TheMainKeys to build the premium digital infrastructure.' },
      { year: '2023', event: 'Co-founded the signature Fitness Power Hour program.' },
      { year: '2025', event: 'Initiated brand development for Mike Water Fitness.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600'
    ],
    relatedBrandIds: ['fashion_meetz_fitness', 'fitness_power_hour', 'mike_water_fitness'],
    order: 2
  },
  {
    id: 'shaun_kelly',
    name: 'Shaun Kelly',
    role: 'Founder',
    company: 'CLÉ Paris',
    biography: 'Shaun Kelly is a Paris-based luxury curator and entrepreneur. Known for his uncompromising appreciation for classical European design and contemporary luxury, Shaun founded CLÉ Paris. With digital engineering and creative direction from TheMainKeys, he established an elite ecommerce presence delivering custom handcrafted accessories globally.',
    portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/shaunkelly' }
    ],
    timeline: [
      { year: '2021', event: 'Sketched the initial concepts of CLÉ Paris accessories.' },
      { year: '2023', event: 'Collaborated with Qayim Correa and TheMainKeys for brand development.' },
      { year: '2024', event: 'Launched the flagship CLÉ Paris digital platform.' }
    ],
    relatedBrandIds: ['cle_paris'],
    order: 3
  },
  {
    id: 'qayim_correa',
    name: 'Qayim Correa',
    role: 'Lead Designer',
    company: 'CLÉ Paris',
    biography: 'Qayim Correa is an avant-garde designer whose structural sensibilities define the CLÉ Paris aesthetic. By combining premium material sourcing with architectural geometry, Qayim leads the jewelry and product design pipelines. His collaborative output with TheMainKeys brings luxury tactile assets to digital realms.',
    portrait: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600',
    timeline: [
      { year: '2022', event: 'Joined CLÉ Paris as Lead Designer.' },
      { year: '2023', event: 'Designed the "La Clé" debut jewelry capsule.' }
    ],
    relatedBrandIds: ['cle_paris'],
    order: 4
  },
  {
    id: 'winston_lee',
    name: 'Winston Lee',
    role: 'Founder',
    company: 'Cuffed Design',
    biography: 'Winston Lee is a master artisan and entrepreneur who established Cuffed Design. Focused on luxurious cuffs, custom hardware, and bold industrial adornments, Winston teamed with TheMainKeys to manifest high-end brand campaigns and interactive storytelling for digital consumers.',
    portrait: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600',
    timeline: [
      { year: '2022', event: 'Founded Cuffed Design.' },
      { year: '2024', event: 'Began campaign photography collaborations with TheMainKeys.' }
    ],
    relatedBrandIds: ['cuffed_design'],
    order: 5
  },
  {
    id: 'andy_piers',
    name: 'Andy Piers',
    role: 'Founder',
    company: 'Pier St Barth',
    biography: 'Andy Piers is an international lifestyle connoisseur who founded Pier St Barth to capture the essence of coastal elegance and tropical luxury. Through an ongoing creative collaboration with TheMainKeys, Pier St Barth delivers seasonal resort lookbooks, premium linen catalogs, and direct digital sales channels.',
    portrait: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=600',
    timeline: [
      { year: '2020', event: 'Conceived Pier St Barth concept in Gustavia.' },
      { year: '2023', event: 'Launched the Summer Resort Collection in collaboration with TheMainKeys.' }
    ],
    relatedBrandIds: ['pier_st_barth'],
    order: 6
  }
];

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'the_main_keys',
    name: 'TheMainKeys Ventures',
    category: 'TheMainKeys Ventures',
    founderIds: ['anderson_djeemo'],
    description: 'The parent company and venture studio responsible for building next-generation digital experiences, software, brand creative, and media projects.',
    longDescription: 'TheMainKeys is a multi-disciplinary venture studio and creative agency that acts as parent company to self-directed ventures and high-impact brand projects. We combine elite software engineering, meticulous creative direction, dynamic marketing strategy, and premium brand storytelling to architect businesses from the ground up.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
    brandStory: 'Established with the mission to fuse high technology with luxury aesthetics, TheMainKeys operates as both an incubator of internal IP and a premium services agency for select clients globally.',
    caseStudyTitle: 'Empowering Digital Luxury & Technology Integration',
    caseStudyContent: 'By establishing unified production pipelines in digital development and media generation, TheMainKeys has shortened the timeline from brand conceptualization to worldwide digital distribution by over 45% while raising the bar for premium user experience.',
    featured: true,
    order: 1
  },
  {
    id: 'wingman',
    name: 'Wingman',
    category: 'TheMainKeys Ventures',
    founderIds: ['anderson_djeemo'],
    description: 'A private luxury hospitality access platform connecting selective clients with elite venues, VIP tables, and curated experiences.',
    longDescription: 'Wingman is an exclusive, private hospitality access application owned, developed, and operated entirely by TheMainKeys. It operates at the intersection of lifestyle curation and real-time digital booking, giving members access to premium hospitality partner benefits, concierge assistance, and private event registries.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200',
    brandStory: 'Recognizing a massive gap in how luxury hospitality venues handle direct bookings for their highest-tier patrons, TheMainKeys conceptualized, designed, coded, and released the Wingman platform.',
    caseStudyTitle: 'Reimagining VIP Hospitality Logistics',
    caseStudyContent: 'Wingman provides a seamless custom application layer that syncs with luxury venue reservation backends, allowing verified members to request VIP experiences instantly. Results include 4.9/5 user reviews and integration across 50+ tier-one venues.',
    featured: true,
    order: 2
  },
  {
    id: 'fashion_meetz_fitness',
    name: 'Fashion Meetz Fitness',
    category: 'Fashion Collaborations',
    founderIds: ['michael_leggett'],
    description: 'An elite wellness and lifestyle brand blending high-fashion streetwear with athletic performance apparel and premium training.',
    longDescription: 'Fashion Meetz Fitness (FMF) is a premium community and apparel brand established by Michael Leggett, and fully developed and supported by the technology and creative divisions of TheMainKeys. It caters to modern, design-conscious individuals who refuse to compromise style for workout functionality.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200',
    brandStory: 'Born in Miami, FMF organizes elite fitness activations, runway style sports presentations, and premium wellness events. TheMainKeys serves as the strategic digital backbone for the entire operation.',
    featured: true,
    order: 3
  },
  {
    id: 'fitness_power_hour',
    name: 'Fitness Power Hour',
    category: 'Hospitality Partnerships',
    founderIds: ['michael_leggett', 'anderson_djeemo'],
    description: 'The signature wellness and performance workout program created under Fashion Meetz Fitness and produced by TheMainKeys.',
    longDescription: 'Fitness Power Hour (FPH) is a highly energized wellness program pairing premium atmospheric soundscapes with advanced high-intensity workout circuits. Produced entirely by the media and experience divisions of TheMainKeys, FPH takes over luxury rooftops, beachfront clubs, and premium spaces for unforgettable wellness moments.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200',
    brandStory: 'What started as an intimate gathering has scaled into a premium experience partnership, hosting corporate retreats and hotel wellness weekends with major hospitality brands.',
    featured: true,
    order: 4
  },
  {
    id: 'mike_water_fitness',
    name: 'Mike Water Fitness',
    category: 'Brand Collaborations',
    founderIds: ['michael_leggett'],
    description: 'An elite wellness hydration brand focusing on premium electrolyte formulation, sleek sustainable packaging, and active living.',
    longDescription: 'Mike Water Fitness is a premium beverage brand focusing on high-performance cellular hydration. Formulated with key trace minerals and zero added sugars, it comes in custom sleek, luxury, eco-friendly aluminum canisters. Developed, branded, and designed in collaboration with TheMainKeys.',
    status: 'Coming Soon',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
    brandStory: 'Designed by Michael Leggett to meet the extreme hydration needs of professional athletes and models, backed by TheMainKeys’ brand development, web design, and creative support. Launching late 2026.',
    featured: true,
    order: 5
  },
  {
    id: 'cle_paris',
    name: 'CLÉ Paris',
    category: 'Fashion Collaborations',
    founderIds: ['shaun_kelly', 'qayim_correa'],
    description: 'A Parisian-inspired high-end brand featuring meticulously crafted jewelry, leather goods, and premium luxury accessories.',
    longDescription: 'CLÉ Paris represents the absolute peak of modern classical craft. Inspired by the meticulous aesthetics of TheMainKeys, the brand combines centuries-old artisan metalworking with modern geometric designs. Supported fully by the digital, creative, and ecommerce development squads of TheMainKeys.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200',
    brandStory: 'CLÉ Paris was founded to provide statement accessories that act as "keys" to self-expression. Each piece is crafted in limited, numbered editions and released in structured seasonal capsules.',
    gallery: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600',
      'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=600'
    ],
    pdfCatalogs: [
      { name: 'CLE Paris Lookbook v1', url: '#', size: '4.2 MB' }
    ],
    featured: true,
    order: 6
  },
  {
    id: 'pier_st_barth',
    name: 'Pier St Barth',
    category: 'Fashion Collaborations',
    founderIds: ['andy_piers'],
    description: 'A premium, island-lifestyle fashion label celebrating St Barth resort culture with luxury linens and elegant warm-weather attire.',
    longDescription: 'Pier St Barth is a premium luxury brand conveying the absolute ease and sun-drenched sophistication of the Caribbean. Built as a close creative collaboration with TheMainKeys, the brand specializes in ultra-premium French linen shirts, lightweight tailoring, and high-end swim apparel designed for international yachting centers.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
    brandStory: 'Andy Piers wanted to capture the yachting elegance of Gustavia. By partnering with TheMainKeys, the brand elevated its marketing through cinematic campaign photography, digital catalogs, and seasonal runway previews.',
    gallery: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600'
    ],
    pdfCatalogs: [
      { name: 'Pier St Barth Seasonal Collection.pdf', url: '#', size: '18.4 MB' }
    ],
    caseStudyTitle: 'DTC Scaling of Island Resort Luxury',
    caseStudyContent: 'TheMainKeys built a custom head-less ecommerce structure for Pier St Barth that supports interactive catalog previews, lightning-fast product pages, and digital luxury storytelling. Global linen sales increased by 78% post-launch.',
    featured: true,
    order: 7
  },
  {
    id: 'cuffed_design',
    name: 'Cuffed Design',
    category: 'Fashion Collaborations',
    founderIds: ['winston_lee'],
    description: 'A premium jewelry and lifestyle brand specializing in architectural metal cuffs, custom leather bands, and bespoke hardware.',
    longDescription: 'Cuffed Design reimagines industrial luxury through hand-burnished cuff wear, steel bracelets, and structural hardware. In collaboration with the creative production studios of TheMainKeys, Cuffed Design delivers compelling campaigns and digital experiences showcasing high-contrast luxury photography and bespoke design stories.',
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=1200',
    brandStory: 'Designed by Winston Lee, every individual metal cuff is crafted from recycled high-grade titanium and surgical steel, then individually stamped in his Miami-based metal atelier.',
    gallery: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=600',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600'
    ],
    caseStudyTitle: 'Creative Direction and Multi-Platform Campaigns',
    caseStudyContent: 'TheMainKeys crafted a high-contrast shadow-play visual identity for Cuffed Design, shooting a multi-channel campaign that was picked up by leading fashion catalogs. The collaboration transformed Cuffed Design from a boutique workshop into a highly coveted international accessory brand.',
    featured: true,
    order: 8
  },
  {
    id: 'sorority',
    name: 'Sorority',
    category: 'Fashion Collaborations',
    founderIds: [],
    description: 'A coming soon premium activewear line engineered exclusively for women, combining performance fibers with striking contours.',
    longDescription: 'Sorority is an upcoming female-centric athletic lifestyle brand developed in close collaboration with the product design and engineering teams of TheMainKeys. Merging state-of-the-art compression fibers with premium minimalist aesthetics, Sorority offers high-waisted seamless sets, jackets, and accessories.',
    status: 'Coming Soon',
    logo: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=150',
    coverImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200',
    brandStory: 'Developed to empower the modern woman through elegant workout silhouettes, Sorority is currently undergoing wear-testing and digital prep under the technical guidance of TheMainKeys.',
    featured: true,
    order: 9
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media_1',
    name: 'Pier St Barth Campaign.pdf',
    type: 'pdf',
    url: '#',
    size: '18.4 MB',
    category: 'Catalogs',
    tags: ['Pier St Barth', 'Linen', 'Catalog'],
    collection: 'Summer 2026',
    date: '2026-06-15'
  },
  {
    id: 'media_2',
    name: 'CLÉ Paris Lookbook.pdf',
    type: 'pdf',
    url: '#',
    size: '4.2 MB',
    category: 'Lookbooks',
    tags: ['CLÉ Paris', 'Jewelry', 'Lookbook'],
    collection: 'Capsule 01',
    date: '2026-05-10'
  },
  {
    id: 'media_3',
    name: 'FMF Rooftop Event.mp4',
    type: 'video',
    url: '#',
    size: '120 MB',
    category: 'Runway',
    tags: ['FMF', 'Fitness', 'Event'],
    collection: 'Miami Takeover',
    date: '2026-04-20'
  },
  {
    id: 'media_4',
    name: 'Wingman Promo.mp4',
    type: 'video',
    url: '#',
    size: '96 MB',
    category: 'Campaigns',
    tags: ['Wingman', 'Hospitality', 'Promo'],
    collection: 'Launch Video',
    date: '2026-03-12'
  },
  {
    id: 'media_5',
    name: 'Cuffed Design High-Contrast.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=800',
    size: '3.1 MB',
    category: 'Behind-the-scenes',
    tags: ['Cuffed', 'Artisanal', 'B&W'],
    collection: 'Studio Shoots',
    date: '2026-06-01'
  },
  {
    id: 'media_6',
    name: 'St Barth Linens Campaign.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
    size: '5.4 MB',
    category: 'Campaigns',
    tags: ['Pier St Barth', 'Model', 'Editorial'],
    collection: 'Summer 2026',
    date: '2026-06-12'
  },
  {
    id: 'media_7',
    name: 'CLÉ Paris Gold Chain Close.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800',
    size: '2.8 MB',
    category: 'Campaigns',
    tags: ['CLÉ Paris', 'Close-Up', 'Gold'],
    collection: 'Capsule 01',
    date: '2026-05-18'
  }
];

export const INITIAL_MODELING_ITEMS: ModelingItem[] = [
  {
    id: 'model_1',
    title: 'High Fashion Editorial - Paris',
    client: 'CLÉ Paris',
    category: 'Editorials',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800',
    date: '2026-05-10',
    description: 'Sleek geometric apparel and custom steel cuffs featured in central Paris.',
    featured: true,
    order: 1
  },
  {
    id: 'model_2',
    title: 'Summer Linen Resort Campaign',
    client: 'Pier St Barth',
    category: 'Campaigns',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
    date: '2026-06-01',
    description: 'Bespoke linen styles and waterfront lifestyle campaign captured in Gustavia Harbor.',
    featured: true,
    order: 2
  },
  {
    id: 'model_3',
    title: 'Minimalist Studio Accessory Portrait',
    client: 'Cuffed Design',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800',
    date: '2026-04-18',
    description: 'High-contrast shadow-play showcasing sustainable architectural hardware.',
    featured: true,
    order: 3
  },
  {
    id: 'model_4',
    title: 'Urban Outerwear & Technology Vibe',
    client: 'TheMainKeys Tech',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800',
    date: '2026-03-22',
    description: 'Sleek metropolitan styles highlighting active luxury lifestyle.',
    featured: false,
    order: 4
  },
  {
    id: 'model_5',
    title: 'Luxury Yachting Coastal Leisure',
    client: 'Wingman App',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800',
    date: '2026-02-14',
    description: 'Premium hospitality promotion focusing on private yacht events and seaside dining.',
    featured: true,
    order: 5
  },
  {
    id: 'model_6',
    title: 'FMF Active Performance Reel',
    client: 'Fashion Meetz Fitness',
    category: 'Videos',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800',
    videoUrl: '#',
    date: '2026-01-30',
    description: 'Cinematic training video showing off athletic apparel in beach circuits.',
    featured: false,
    order: 6
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj_1',
    title: 'Wingman iOS & Android Concierge',
    category: 'Technology',
    description: 'Fully custom private VIP booking application connecting high-profile clients to premium partner venues.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800',
    brandId: 'wingman',
    date: '2026-05-02',
    featured: true,
    order: 1
  },
  {
    id: 'proj_2',
    title: 'CLÉ Paris Headless Commerce',
    category: 'Websites',
    description: 'Lightning fast customized checkout architecture highlighting elegant gold collectibles.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800',
    brandId: 'cle_paris',
    date: '2026-04-12',
    featured: true,
    order: 2
  },
  {
    id: 'proj_3',
    title: 'Pier St Barth Luxury Branding & Lookbook',
    category: 'Branding',
    description: 'Complete visual identity overhaul and catalog deployment celebrating Gustavia resort lifestyle.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
    brandId: 'pier_st_barth',
    date: '2026-06-10',
    featured: true,
    order: 3
  },
  {
    id: 'proj_4',
    title: 'Cuffed Design High-Contrast Campaign',
    category: 'Photography',
    description: 'Fine art accessory campaign emphasizing metallic reflections and sculptural contours.',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=800',
    brandId: 'cuffed_design',
    date: '2026-05-28',
    featured: false,
    order: 4
  },
  {
    id: 'proj_5',
    title: 'Fitness Power Hour Rooftop Experience',
    category: 'Hospitality',
    description: 'Complete experiential creative direction and production for rooftop health events.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800',
    brandId: 'fitness_power_hour',
    date: '2026-06-21',
    featured: true,
    order: 5
  },
  {
    id: 'proj_6',
    title: 'Mike Water Cellular Hydration',
    category: 'Wellness',
    description: 'Formulation branding, canister structural design, and DTC strategy.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
    brandId: 'mike_water_fitness',
    date: '2026-06-29',
    featured: false,
    order: 6
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'La Clé Gold Link Signature Bracelet',
    brandId: 'cle_paris',
    brandName: 'CLÉ Paris',
    category: 'Accessories',
    description: 'A signature statement piece meticulously handcrafted in our Paris atelier. Featuring structural geometry inspired by historical locks and French architecture. High-grade titanium core, thickly plated with 24-karat gold for durability and lifelong shine.',
    price: 1250,
    salePrice: 1100,
    inventory: 12,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Gold', 'Platinum'],
    featured: true,
    comingSoon: false,
    limitedDrop: true,
    preOrder: false,
    soldOut: false,
    pdfCatalogName: 'CLÉ Paris Capsule Collection Booklet',
    pdfCatalogUrl: '#',
    reviews: [
      { id: 'rev_1', user: 'Sophia Martinez', rating: 5, comment: 'Absolutely spectacular craftsmanship. The gold is rich and heavy. Exactly what I expected from CLÉ Paris.', date: '2026-06-12' },
      { id: 'rev_2', user: 'Jean-Pierre L.', rating: 5, comment: 'Un chef-d’œuvre. Delivery to Paris was swift and the packaging is extremely luxurious.', date: '2026-06-18' }
    ]
  },
  {
    id: 'prod_2',
    name: 'Elite Yacht French Linen Shirt',
    brandId: 'pier_st_barth',
    brandName: 'Pier St Barth',
    category: 'Resort Wear',
    description: 'Crafted from 100% premium organic French linen, individually pre-washed for the ultimate breeze-soft texture. Engineered with a relaxed coastal silhouette, perfect for warm tropical afternoons and yacht excursions in Gustavia.',
    price: 290,
    inventory: 45,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Bleu Riviera', 'Sable'],
    featured: true,
    comingSoon: false,
    limitedDrop: false,
    preOrder: false,
    soldOut: false,
    pdfCatalogName: 'Pier St Barth Summer Catalog',
    pdfCatalogUrl: '#',
    reviews: [
      { id: 'rev_3', user: 'Alex van der Bilt', rating: 4, comment: 'Extremely lightweight and breathable. Perfect for St Barth. Fits a bit loose, which is ideal for the resort feel.', date: '2026-06-20' }
    ]
  },
  {
    id: 'prod_3',
    name: 'Titanium Industrial Bolt Cuff',
    brandId: 'cuffed_design',
    brandName: 'Cuffed Design',
    category: 'Accessories',
    description: 'Hand-burnished structural cuff manufactured in Winston Lee’s Miami Design District studio. Made from high-grade recycled aerospace titanium, featuring a heavy industrial lock bolt mechanism with laser-etched geographic coordinates.',
    price: 480,
    inventory: 15,
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?q=80&w=600',
      'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=600'
    ],
    sizes: ['M', 'L'],
    colors: ['Raw Titanium', 'Obsidian Black'],
    featured: false,
    comingSoon: false,
    limitedDrop: true,
    preOrder: false,
    soldOut: false,
    reviews: []
  },
  {
    id: 'prod_4',
    name: 'FMF Studio Heavyweight Hoodie',
    brandId: 'fashion_meetz_fitness',
    brandName: 'Fashion Meetz Fitness',
    category: 'Fitness Apparel',
    description: 'Designed in collaboration with Michael Leggett. Engineered from premium 500gsm organic loopback French terry cotton. Incorporates subtle ergonomic panels for active movement while delivering a structured, high-fashion boxy fit.',
    price: 180,
    inventory: 28,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx Matte', 'Bone Chalk'],
    featured: true,
    comingSoon: false,
    limitedDrop: false,
    preOrder: false,
    soldOut: false,
    reviews: [
      { id: 'rev_4', user: 'Marcus Vance', rating: 5, comment: 'Best heavyweight hoodie I own. Unbelievable thickness and holds its shape perfectly after washes. FMF has killed this!', date: '2026-06-15' }
    ]
  },
  {
    id: 'prod_5',
    name: 'Rooftop Experience Pass - Miami',
    brandId: 'fitness_power_hour',
    brandName: 'Fitness Power Hour',
    category: 'Event Merchandise',
    description: 'All-inclusive VIP admission token for the high-intensity Fitness Power Hour rooftop performance. Includes curated ambient DJ sets, premium hydration amenities by Mike Water Fitness, and a post-workout elite nutrition bar catering.',
    price: 150,
    inventory: 50,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600'
    ],
    featured: false,
    comingSoon: false,
    limitedDrop: false,
    preOrder: false,
    soldOut: false,
    digitalDownloadUrl: 'https://themainkeys.com/tickets/fph-miami-2026.pdf',
    reviews: []
  },
  {
    id: 'prod_6',
    name: 'Mike Water Cellular Hydration (Case of 12)',
    brandId: 'mike_water_fitness',
    brandName: 'Mike Water Fitness',
    category: 'Beverages',
    description: 'An elite active electrolyte beverage formulated with pure volcanic water, trace sea minerals, and organic fruit essences. Packed with performance-enhancing magnesium and potassium. Housed in sleek, reusable aluminum canisters.',
    price: 64,
    inventory: 0,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600'
    ],
    featured: false,
    comingSoon: true,
    limitedDrop: false,
    preOrder: false,
    soldOut: false,
    reviews: []
  },
  {
    id: 'prod_7',
    name: 'Seamless Compression Contour Set',
    brandId: 'sorority',
    brandName: 'Sorority',
    category: 'Fitness Apparel',
    description: 'Formulated with advanced double-knit performance microfiber yarn. Seamless construction designed to contour, lift, and compress with zero chafing. Includes the high-waisted active legging and matching high-support crop top.',
    price: 220,
    inventory: 100,
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald Deep', 'Cocoa Silt', 'Charcoal Sleek'],
    featured: false,
    comingSoon: false,
    limitedDrop: false,
    preOrder: true,
    soldOut: false,
    reviews: []
  },
  {
    id: 'prod_8',
    name: 'CLÉ Paris Prestige Interactive Catalog',
    brandId: 'cle_paris',
    brandName: 'CLÉ Paris',
    category: 'Catalog Downloads',
    description: 'The complete digital specification and design portfolio for the inaugural CLÉ Paris capsule. Includes high-resolution technical sketches, material origins, sizing diagrams, and personal styling guides by Lead Designer Qayim Correa.',
    price: 0,
    inventory: 9999,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600'
    ],
    featured: false,
    comingSoon: false,
    limitedDrop: false,
    preOrder: false,
    soldOut: false,
    digitalDownloadUrl: 'https://themainkeys.com/catalogs/cle_paris_prestige_v1.pdf',
    reviews: []
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', discountType: 'percentage', value: 10, active: true },
  { code: 'ELITE20', discountType: 'percentage', value: 20, active: true },
  { code: 'FOUNDER100', discountType: 'fixed', value: 100, active: true }
];

