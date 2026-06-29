/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrandCategory =
  | 'TheMainKeys Ventures'
  | 'Client Projects'
  | 'Brand Collaborations'
  | 'Hospitality Partnerships'
  | 'Fashion Collaborations'
  | 'Technology Projects';

export interface Brand {
  id: string;
  name: string;
  category: BrandCategory;
  founderIds: string[]; // references Founder.id
  description: string;
  longDescription?: string;
  status: 'Active' | 'Coming Soon' | 'Archived';
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  videos?: string[];
  pdfCatalogs?: { name: string; url: string; size?: string }[];
  brandStory?: string;
  caseStudyTitle?: string;
  caseStudyContent?: string;
  customPdfUrl?: string;
  customPdfName?: string;
  featured: boolean;
  order: number;
  metaTitle?: string;
  metaDesc?: string;
  ogImage?: string;
}

export interface PageSeo {
  view: string;
  title: string;
  description: string;
  ogImage: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  company: string;
  biography: string;
  portrait: string;
  videos?: string[];
  articles?: string[];
  timeline?: { year: string; event: string }[];
  socialLinks?: { platform: string; url: string }[];
  gallery?: string[];
  relatedBrandIds?: string[];
  order: number;
  featured?: boolean;
}

export type MediaType = 'image' | 'video' | 'pdf';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  size?: string;
  category?: string; // e.g. 'Campaigns', 'Lookbooks', 'Catalogs', 'Runway', 'Behind-the-scenes'
  tags?: string[];
  collection?: string;
  date: string;
}

export interface ModelingItem {
  id: string;
  title: string;
  client?: string;
  category: 'Campaigns' | 'Editorials' | 'Commercial' | 'Fashion' | 'Lifestyle' | 'Videos';
  image: string;
  videoUrl?: string;
  date: string;
  description?: string;
  featured: boolean;
  order: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Technology' | 'Websites' | 'Software' | 'Branding' | 'Fashion' | 'Hospitality' | 'Wellness' | 'Media' | 'Photography' | 'Creative Direction' | 'Luxury Brands' | 'Case Studies';
  description: string;
  content?: string;
  image: string;
  brandId?: string; // links to a brand
  date: string;
  featured: boolean;
  order: number;
}

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  category: 'Fashion' | 'Resort Wear' | 'Fitness Apparel' | 'Accessories' | 'Fragrances' | 'Wellness' | 'Beverages' | 'Digital' | 'Catalog Downloads' | 'Limited Collaborations' | 'Event Merchandise';
  description: string;
  price: number;
  salePrice?: number;
  inventory: number;
  images: string[];
  videos?: string[];
  sizes?: string[];
  colors?: string[];
  featured: boolean;
  comingSoon: boolean;
  limitedDrop: boolean;
  preOrder: boolean;
  soldOut: boolean;
  digitalDownloadUrl?: string;
  pdfCatalogUrl?: string;
  pdfCatalogName?: string;
  relatedProductIds?: string[];
  caseStudyId?: string;
  mediaItemId?: string;
  reviews?: ProductReview[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  brandName: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  size?: string;
  color?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  shippingMethod: 'standard' | 'express';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Refunded';
  date: string;
  promoCodeUsed?: string;
  shippingAddress: string;
  billingAddress: string;
  trackingNumber?: string;
  
  // Custom high-fidelity billing & shipment fields
  customerDetails: CustomerDetails;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost: number;
  grandTotal: number;
  createdAt: string;
}

export interface PromoCode {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

