/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { 
  Brand, 
  Founder, 
  MediaItem, 
  ModelingItem, 
  ProjectItem,
  BrandCategory,
  PageSeo,
  Product,
  Order,
  PromoCode
} from '../types';
import SeoMetadataManager from './SeoMetadataManager';
import { 
  LayoutDashboard, 
  Layers, 
  FolderOpen, 
  Image, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Users, 
  FileText, 
  Download, 
  LineChart, 
  Settings, 
  LogOut, 
  TrendingUp, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  Search, 
  ArrowRight, 
  Video, 
  Globe, 
  UserCheck, 
  Upload, 
  Archive, 
  FolderHeart,
  Sliders,
  ChevronRight,
  FileCheck,
  Eye,
  X,
  ChevronLeft,
  Maximize2,
  FileDown,
  ShoppingBag,
  Tag,
  DollarSign,
  Undo
} from 'lucide-react';

interface AdminDashboardProps {
  brands: Brand[];
  founders: Founder[];
  mediaItems: MediaItem[];
  modelingItems: ModelingItem[];
  projects: ProjectItem[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  setFounders: React.Dispatch<React.SetStateAction<Founder[]>>;
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  setModelingItems: React.Dispatch<React.SetStateAction<ModelingItem[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  pageSeo: PageSeo[];
  setPageSeo: React.Dispatch<React.SetStateAction<PageSeo[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  onExit: () => void;
}

export default function AdminDashboard({
  brands,
  founders,
  mediaItems,
  modelingItems,
  projects,
  setBrands,
  setFounders,
  setMediaItems,
  setModelingItems,
  setProjects,
  pageSeo,
  setPageSeo,
  products,
  setProducts,
  orders,
  setOrders,
  promoCodes,
  setPromoCodes,
  onExit,
}: AdminDashboardProps) {
  
  // Tab states: 'dashboard' or one of the 14 modules requested
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor / Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formType, setFormType] = useState<'create' | 'edit'>('create');

  // PDF Preview State
  const [previewPdfBrand, setPreviewPdfBrand] = useState<any | null>(null);
  const [previewPdfPage, setPreviewPdfPage] = useState<number>(1);
  const [previewZoomLevel, setPreviewZoomLevel] = useState<number>(1);
  const [isIframeView, setIsIframeView] = useState<boolean>(false);
  
  // Drag and drop / file upload simulations
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // State for bulk PDF selection and download
  const [selectedPdfIds, setSelectedPdfIds] = useState<string[]>([]);
  const [isBulkDownloading, setIsBulkDownloading] = useState<boolean>(false);

  // Export dropdown state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Boutique Custom Admin States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    brandId: '',
    category: 'Fashion' as any,
    price: 0,
    salePrice: undefined as number | undefined,
    inventory: 0,
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    description: '',
    featured: false,
    comingSoon: false,
    limitedDrop: false,
    preOrder: false,
    soldOut: false,
    digitalDownloadUrl: '',
    pdfCatalogName: '',
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Refunded'>('All');

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const oldStatus = targetOrder.status;
    if (oldStatus === newStatus) return;

    // If transitioning to Refunded from another status, restore inventory
    if (newStatus === 'Refunded' && oldStatus !== 'Refunded') {
      setProducts(prevProducts => prevProducts.map(p => {
        const orderItem = targetOrder.items.find(it => it.productId === p.id);
        if (orderItem) {
          return {
            ...p,
            inventory: p.inventory + orderItem.quantity,
            soldOut: false
          };
        }
        return p;
      }));
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }

    if (window.showLuxuryToast) {
      window.showLuxuryToast(`Order #${orderId} status set to ${newStatus}.`);
    }
  };

  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    value: 0,
  });

  const [globalTaxRate, setGlobalTaxRate] = useState(8.5);
  const [globalStandardShipping, setGlobalStandardShipping] = useState(15);
  const [globalExpressShipping, setGlobalExpressShipping] = useState(35);

  // Helper: CSV value escaper
  const escapeCsvValue = (val: any): string => {
    if (val === undefined || val === null) return '';
    let str = '';
    if (typeof val === 'object') {
      str = JSON.stringify(val);
    } else {
      str = String(val);
    }
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  // Helper: Export Brand or Project data as Structured JSON file
  const handleExportJson = (type: 'brands' | 'projects') => {
    try {
      const dataToExport = type === 'brands' ? brands : projects;
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `themainkeys_${type}_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (window.showLuxuryToast) {
        window.showLuxuryToast(`Structured JSON portfolio data exported successfully for [${type.toUpperCase()}].`);
      }
    } catch (e: any) {
      console.error('JSON export error:', e);
      if (window.showLuxuryToast) {
        window.showLuxuryToast(`Failed to export JSON data: ${e.message || e}`);
      }
    }
  };

  // Helper: Export Brand or Project data as structured CSV file
  const handleExportCsv = (type: 'brands' | 'projects') => {
    try {
      const dataToExport = type === 'brands' ? brands : projects;
      if (dataToExport.length === 0) {
        if (window.showLuxuryToast) {
          window.showLuxuryToast(`The [${type.toUpperCase()}] database has no entries to export.`);
        }
        return;
      }

      // Collect all unique keys as columns
      const headers = Object.keys(dataToExport[0]) as (keyof typeof dataToExport[0])[];
      const csvRows = [
        headers.map(h => `"${String(h).toUpperCase()}"`).join(','),
        ...dataToExport.map(item => 
          headers.map(header => escapeCsvValue(item[header])).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `themainkeys_${type}_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (window.showLuxuryToast) {
        window.showLuxuryToast(`Structured CSV archival file successfully exported for [${type.toUpperCase()}].`);
      }
    } catch (e: any) {
      console.error('CSV export error:', e);
      if (window.showLuxuryToast) {
        window.showLuxuryToast(`Failed to export CSV data: ${e.message || e}`);
      }
    }
  };

  // Helper: dynamic PDF builder matching premium BrandDetailPage styling
  const generateBrandPdfBlob = (brand: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

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
    doc.text('THEMAINKEYS ENTERPRISES  //  GLOBAL VENTURE DIRECTORY', 15, 18);

    doc.setFontSize(18);
    doc.setTextColor(179, 145, 59);
    doc.text('EXECUTIVE SUMMARY', 15, 32);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text('PREMIUM LUXURY PORTFOLIO INTEL', 135, 32);

    let y = 60;

    // Brand Header Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(10, 10, 10);
    doc.text((brand.name || '').toUpperCase(), 15, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(150, 120, 50);
    doc.text(`CATEGORY: ${(brand.category || 'VENTURE').toUpperCase()}  |  STATUS: ${(brand.status || 'ACTIVE').toUpperCase()}`, 15, y);
    y += 12;

    // Overview Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 10, 10);
    doc.text('OVERVIEW', 15, y);
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
      doc.text('BRAND STORY & ARCHITECTURE', 15, y);
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
    doc.text('STRATEGIC CASE STUDY', 15, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const caseText = brand.caseStudyContent || 'TheMainKeys serves as the strategic visual designer and digital support partner. By re-architecting e-commerce models and producing cinematic editorial catalogs, we accelerate global organic brand engagement and secure conversion rates.';
    const caseLines = doc.splitTextToSize(caseText, 180);
    doc.text(caseLines, 15, y);
    y += caseLines.length * 5 + 12;

    // Footer lines
    doc.setDrawColor(210, 210, 210);
    doc.line(15, 275, 195, 275);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text('CONCIERGE DECRYPTED KEY DOCUMENT // 2026 THEMAINKEYS VENTURES & STUDIO LLC', 15, 281);
    doc.text('MIAMI DESIGN DISTRICT // PARIS, FRANCE // CONFIDENTIAL & PROPRIETARY', 15, 285);

    return doc.output('blob');
  };

  // Bulk ZIP builder & compiler
  const handleBulkDownloadZip = async () => {
    if (selectedPdfIds.length === 0) return;
    setIsBulkDownloading(true);

    try {
      const zip = new JSZip();
      
      const collateralLines = selectedPdfIds.map((id, index) => {
        const brand = brands.find(b => b.id === id);
        if (brand) {
          return (index + 1) + ". " + brand.name + " - Executive Summary Catalog";
        } else if (id === 'fallback-directory') {
          return (index + 1) + ". TheMainKeys General Repertoire Factsheet";
        }
        return '';
      }).filter(Boolean).join('\n');

      const readmeContent = 
        "========================================================================\n" +
        "                      THEMAINKEYS ENTERPRISES\n" +
        "                PREMIUM DIGITAL CATALOGUE REPERTOIRE\n" +
        "                      CONFIDENTIAL ARCHIVE \n" +
        "========================================================================\n" +
        "Generated: " + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + "\n" +
        "Location: Miami Design District & Paris, France\n" +
        "Authorization status: APPROVED FOR CO-FOUNDER & PARTNER DISTRIBUTION\n\n" +
        "This ZIP package contains your curated selection of elite digital catalogs\n" +
        "and strategic executive briefs compiled on behalf of TheMainKeys Enterprises.\n\n" +
        "INCLUDED COLLATERALS:\n" +
        collateralLines + "\n\n" +
        "All files are classified as CONFIDENTIAL & PROPRIETARY. Any unauthorized\n" +
        "redistribution is strictly prohibited under board agreements.\n\n" +
        "© 2026 TheMainKeys Ventures & Studio LLC. All rights reserved.\n" +
        "========================================================================\n";
      
      zip.file('THEMAINKEYS_ARCHIVE_README.txt', readmeContent);

      for (const id of selectedPdfIds) {
        if (id === 'fallback-directory') {
          const fallbackBrand = {
            id: 'fallback-directory',
            name: 'TheMainKeys General Directory',
            customPdfName: 'themainkeys_ventures_factsheet_2026.pdf',
            category: 'Corporate Repertoire',
            status: 'System Generated',
            description: 'A global compendium of luxury partners, curated fashion designers, high-fashion models, and digital transformation initiatives backed by TheMainKeys Repertoire.',
            brandStory: 'TheMainKeys serves as an elite bridge between European fashion capitals, emerging sustainable trends, and pioneering Web3/corporate innovations. This directory represents our active portfolio, vetted and curated for discerning corporate clients, hospitality giants, and high-fashion modeling campaigns.',
            caseStudyTitle: 'Strategic Repertoire Integration',
            caseStudyContent: 'Across 14 operational modules, TheMainKeys coordinates strategic PR placement, digital lookbook distribution, active founder alignment, and secure document vaults to secure friction-free brand representation in Paris, Milan, London, and New York.'
          };
          const blob = generateBrandPdfBlob(fallbackBrand);
          zip.file('themainkeys_ventures_factsheet_2026.pdf', blob);
        } else {
          const brand = brands.find(b => b.id === id);
          if (brand) {
            const fileName = brand.customPdfName || (brand.name.toLowerCase().replace(/\s+/g, '_') + "_executive_summary.pdf");
            
            let success = false;
            if (brand.customPdfUrl && (brand.customPdfUrl.startsWith('http://') || brand.customPdfUrl.startsWith('https://') || brand.customPdfUrl.startsWith('/'))) {
              try {
                const response = await fetch(brand.customPdfUrl);
                if (response.ok) {
                  const blob = await response.blob();
                  zip.file(fileName, blob);
                  success = true;
                }
              } catch (e) {
                console.warn("Could not fetch custom PDF from URL for " + brand.name + ", generating dynamic fallback:", e);
              }
            }
            
            if (!success) {
              const blob = generateBrandPdfBlob(brand);
              zip.file(fileName, blob);
            }
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = "themainkeys_branded_catalogs_archive_" + new Date().toISOString().slice(0,10) + ".zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (window.showLuxuryToast) {
        window.showLuxuryToast("Curated ZIP Archive successfully generated containing " + selectedPdfIds.length + " executive catalogs.");
      }
    } catch (err: any) {
      console.error('Error creating ZIP archive:', err);
      if (window.showLuxuryToast) {
        window.showLuxuryToast("Error compiling ZIP archive: " + (err.message || err));
      }
    } finally {
      setIsBulkDownloading(false);
    }
  };

  // Form properties (generic container that maps to active tab module)
  const [formData, setFormData] = useState<any>({
    name: '',
    title: '',
    category: '',
    description: '',
    longDescription: '',
    status: 'Active',
    featured: false,
    order: 1,
    biography: '',
    role: '',
    company: '',
    metaTitle: '',
    metaDesc: '',
    url: '',
    size: '',
    client: '',
    customPdfUrl: '',
    customPdfName: '',
  });

  // Sidebar elements matching the image exactly
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'seo', label: 'SEO Metadata', icon: Globe, isModule: true, moduleKey: 'SEO Metadata' },
    { id: 'brands', label: 'Brands & Ventures', icon: Layers, isModule: true, moduleKey: 'Fashion Brands' },
    { id: 'modeling', label: 'Modeling Portfolio', icon: Sparkles, isModule: true, moduleKey: 'Modeling Portfolio' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, isModule: true, moduleKey: 'Hospitality Partners' },
    { id: 'media', label: 'Media Library', icon: Image, isModule: true, moduleKey: 'Brand Collaborations' },
    { id: 'founders', label: 'Team & Founders', icon: Users, isModule: true, moduleKey: 'Founder Profiles' },
    { id: 'boutique_products', label: 'Boutique Products', icon: ShoppingBag, isModule: true, moduleKey: 'Boutique Products' },
    { id: 'discount_codes', label: 'Privilege Codes', icon: Tag, isModule: true, moduleKey: 'Privilege Codes' },
    { id: 'orders_mgmt', label: 'Order Management', icon: DollarSign, isModule: true, moduleKey: 'Order Management' },
    { id: 'boutique_analytics', label: 'Sales & Settings', icon: TrendingUp, isModule: true, moduleKey: 'Sales & Settings' },
    { id: 'pdfs', label: 'PDF Library', icon: FileText, isModule: true, moduleKey: 'PDF Library' },
    { id: 'campaigns', label: 'Campaign Library', icon: Sliders, isModule: true, moduleKey: 'Campaign Library' },
    { id: 'photography', label: 'Photography', icon: Image, isModule: true, moduleKey: 'Photography' },
    { id: 'creative', label: 'Creative Assets', icon: Sparkles, isModule: true, moduleKey: 'Creative Assets' },
    { id: 'team', label: 'Team Members', icon: Users, isModule: true, moduleKey: 'Team Members' },
    { id: 'categories', label: 'Media Categories', icon: Layers, isModule: true, moduleKey: 'Media Categories' },
    { id: 'port_categories', label: 'Portfolio Categories', icon: FolderOpen, isModule: true, moduleKey: 'Portfolio Categories' },
    { id: 'clients', label: 'Client Management', icon: UserCheck, isModule: true, moduleKey: 'Client Management' },
    { id: 'downloads', label: 'Downloads', icon: Download, isModule: true, moduleKey: 'Downloads' },
  ];

  // Helper: Open creation modal for active tab
  const handleCreateNew = () => {
    setFormType('create');
    setEditingItem(null);
    setUploadedFiles([]);
    
    // Default values depending on active module
    const defaultData: any = {
      name: '',
      title: '',
      category: '',
      description: '',
      longDescription: '',
      status: 'Active',
      featured: false,
      order: (activeTab === 'brands' ? brands.length : activeTab === 'modeling' ? modelingItems.length : 1) + 1,
      biography: '',
      role: '',
      company: '',
      metaTitle: '',
      metaDesc: '',
      url: '',
      size: '',
      client: '',
    };
    
    // Pre-set appropriate category if available
    if (activeTab === 'brands') defaultData.category = 'Fashion Collaborations';
    if (activeTab === 'modeling') defaultData.category = 'Campaigns';
    if (activeTab === 'projects') defaultData.category = 'Technology';
    if (activeTab === 'media') defaultData.type = 'image';

    setFormData(defaultData);
    setIsModalOpen(true);
  };

  // Helper: Open edit modal
  const handleEditItem = (item: any) => {
    setFormType('edit');
    setEditingItem(item);
    setFormData({ ...item });
    setUploadedFiles(item.gallery || []);
    setIsModalOpen(true);
  };

  // Helper: Simulated File Upload with progress
  const handleFileUpload = (e: any) => {
    e.preventDefault();
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1000);
          // Append mock image
          setUploadedFiles((f) => [...f, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600']);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  // Dedicated PDF file upload handler
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUploadProgress(10);
    const interval = setInterval(() => {
      setPdfUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPdfUploadProgress(null);
            setFormData((prevForm: any) => ({
              ...prevForm,
              customPdfName: file.name,
              customPdfUrl: URL.createObjectURL(file),
            }));
            if (window.showLuxuryToast) {
              window.showLuxuryToast(`Executive PDF "${file.name}" uploaded successfully!`);
            }
          }, 1000);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e);
    }
  };

  // Helper: Save Changes across correct state
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const preparedData = {
      ...formData,
      gallery: uploadedFiles.length > 0 ? uploadedFiles : formData.gallery || [],
      id: formType === 'create' ? `${activeTab}_${Date.now()}` : formData.id,
    };

    if (activeTab === 'brands') {
      if (formType === 'create') {
        setBrands([...brands, preparedData]);
      } else {
        setBrands(brands.map(b => b.id === preparedData.id ? preparedData : b));
      }
    } else if (activeTab === 'modeling') {
      if (formType === 'create') {
        setModelingItems([...modelingItems, preparedData]);
      } else {
        setModelingItems(modelingItems.map(m => m.id === preparedData.id ? preparedData : m));
      }
    } else if (activeTab === 'projects') {
      if (formType === 'create') {
        setProjects([...projects, preparedData]);
      } else {
        setProjects(projects.map(p => p.id === preparedData.id ? preparedData : p));
      }
    } else if (activeTab === 'media') {
      if (formType === 'create') {
        setMediaItems([...mediaItems, preparedData]);
      } else {
        setMediaItems(mediaItems.map(m => m.id === preparedData.id ? preparedData : m));
      }
    } else if (activeTab === 'founders') {
      if (formType === 'create') {
        setFounders([...founders, preparedData]);
      } else {
        setFounders(founders.map(f => f.id === preparedData.id ? preparedData : f));
      }
    } else if (activeTab === 'pdfs') {
      const selectedBrandId = formData.linkedBrandId;
      if (selectedBrandId) {
        setBrands(brands.map(b => b.id === selectedBrandId ? { 
          ...b, 
          customPdfUrl: formData.customPdfUrl,
          customPdfName: formData.customPdfName 
        } : b));
      } else {
        if (window.showLuxuryToast) {
          window.showLuxuryToast('Error: Please select a valid target brand venture to attach the PDF.');
        }
        return;
      }
    }

    if (window.showLuxuryToast) {
      window.showLuxuryToast(`Success: CMS database updated for ${preparedData.name || preparedData.title || 'asset'} inside [${activeTab.toUpperCase()}] module.`);
    } else {
      alert(`Success: CMS updated ${preparedData.name || preparedData.title || 'asset'} inside [${activeTab}] module.`);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Helper: Delete / Archive / Feature toggles
  const handleDeleteItem = (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this item from the database?')) return;
    
    if (activeTab === 'brands') setBrands(brands.filter(b => b.id !== id));
    else if (activeTab === 'modeling') setModelingItems(modelingItems.filter(m => m.id !== id));
    else if (activeTab === 'projects') setProjects(projects.filter(p => p.id !== id));
    else if (activeTab === 'media') setMediaItems(mediaItems.filter(m => m.id !== id));
    else if (activeTab === 'founders') setFounders(founders.filter(f => f.id !== id));
  };

  const handleToggleFeature = (id: string) => {
    if (activeTab === 'brands') {
      setBrands(brands.map(b => b.id === id ? { ...b, featured: !b.featured } : b));
    } else if (activeTab === 'modeling') {
      setModelingItems(modelingItems.map(m => m.id === id ? { ...m, featured: !m.featured } : m));
    } else if (activeTab === 'projects') {
      setProjects(projects.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    }
  };

  const handleToggleArchive = (id: string) => {
    if (activeTab === 'brands') {
      setBrands(brands.map(b => b.id === id ? { ...b, status: b.status === 'Archived' ? 'Active' : 'Archived' } : b));
    }
  };

  // Reordering functions
  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    if (activeTab === 'brands') {
      const copy = [...brands];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      setBrands(copy);
    } else if (activeTab === 'modeling') {
      const copy = [...modelingItems];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      setModelingItems(copy);
    }
  };

  const handleMoveDown = (idx: number) => {
    if (activeTab === 'brands') {
      if (idx === brands.length - 1) return;
      const copy = [...brands];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      setBrands(copy);
    } else if (activeTab === 'modeling') {
      if (idx === modelingItems.length - 1) return;
      const copy = [...modelingItems];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      setModelingItems(copy);
    }
  };

  const filteredOrders = orders.filter(o => {
    // 1. Filter by status
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) {
      return false;
    }
    // 2. Filter by search query (customer name, email, order ID, product name)
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      const orderIdMatch = o.id.toLowerCase().includes(q);
      const nameMatch = (
        (o.customerDetails?.firstName || '') + ' ' + (o.customerDetails?.lastName || '')
      ).toLowerCase().includes(q) || (o.customerName || '').toLowerCase().includes(q);
      const emailMatch = (o.customerDetails?.email || o.customerEmail || '').toLowerCase().includes(q);
      const itemMatch = o.items.some(it => it.productName.toLowerCase().includes(q));
      return orderIdMatch || nameMatch || emailMatch || itemMatch;
    }
    return true;
  });

  return (
    <div id="admin-panel-root" className="min-h-screen bg-[#080808] text-neutral-300 font-sans flex">
      
      {/* Sidebar - Matching image layout with gold TM brand */}
      <aside id="admin-sidebar" className="w-64 bg-[#0a0a0a] border-r border-neutral-900 flex flex-col justify-between shrink-0">
        <div>
          {/* Header Identity */}
          <div className="p-6 border-b border-neutral-900 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border border-gold-400 rounded">
              <span className="font-serif font-bold text-gold-400 text-base">TT</span>
            </div>
            <div>
              <span className="font-sans font-extrabold text-xs tracking-[0.2em] text-white block uppercase">THEMAINKEYS</span>
              <span className="font-mono text-[8px] text-gold-400 tracking-[0.2em] uppercase font-bold">ADMIN CONSOLE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[75vh]">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left text-xs tracking-wider transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-neutral-900 border-l-2 border-gold-400 text-gold-300 font-semibold' 
                      : 'text-neutral-500 hover:bg-neutral-950 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-neutral-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isModule && (
                    <span className="text-[7px] font-mono border border-neutral-800 text-neutral-600 px-1 rounded">
                      CMS
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Information Pill */}
        <div className="p-4 border-t border-neutral-900 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1618015358954-115ef1ed6515?q=80&w=150"
              alt="Anderson Djeemo avatar"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-gold-500/20"
            />
            <div>
              <span className="font-bold text-xs text-white block leading-none">Anderson Djeemo</span>
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5 block">Super Admin</span>
            </div>
          </div>
          <button
            onClick={onExit}
            className="w-full py-2 border border-neutral-900 hover:border-red-900/30 hover:bg-red-950/10 hover:text-red-400 rounded text-[10px] tracking-widest font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Console
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#060606] overflow-y-auto pb-12">
        
        {/* Top bar */}
        <header className="h-16 border-b border-neutral-900 px-8 flex items-center justify-between bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-gold-400 tracking-widest uppercase">THEMAINKEYS ECOSYSTEM</span>
            <span className="text-neutral-700">/</span>
            <span className="font-sans font-bold text-xs text-neutral-400 uppercase tracking-wider">
              {sidebarItems.find(i => i.id === activeTab)?.label || 'CMS Module'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-neutral-600 bg-neutral-950 border border-neutral-900 px-3 py-1 rounded">
              ENVIRONMENT: PRODUCTION STAGING
            </span>
          </div>
        </header>

        {/* Dashboard Analytics Screen (as pictured in image) */}
        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase">
                  Workspace Dashboard
                </h1>
                <p className="text-neutral-500 text-xs">Real-time engagement activity, leads, and upcoming wellness rooftop events.</p>
              </div>
              <span className="text-xs font-mono text-gold-400 border border-gold-500/10 bg-gold-950/20 px-4 py-2 rounded">
                May 20 – Jun 18, 2026
              </span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'TOTAL VISITORS', val: '128,430', pct: '+24.5%', positive: true, label: 'vs last 30 days' },
                { title: 'PROJECT VIEWS', val: '86,320', pct: '+18.6%', positive: true, label: 'vs last 30 days' },
                { title: 'LEADS GENERATED', val: '2,543', pct: '+32.1%', positive: true, label: 'vs last 30 days' },
                { title: 'NEWSLETTER ROR', val: '12,890', pct: '+21.4%', positive: true, label: 'vs last 30 days' },
              ].map((m, i) => (
                <div key={i} className="p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">{m.title}</span>
                    <span className="text-[10px] font-mono text-green-400 bg-green-950/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {m.pct}
                    </span>
                  </div>
                  <div>
                    <span className="font-sans font-extrabold text-3xl text-white tracking-tight">{m.val}</span>
                    <span className="block text-[10px] text-neutral-600 font-mono mt-1">{m.label}</span>
                  </div>
                  {/* Subtle mock vector graph representation */}
                  <div className="h-10 w-full flex items-end gap-1 pt-2">
                    {[30, 45, 35, 60, 50, 75, 65, 90].map((h, k) => (
                      <div key={k} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-gold-500/5 to-gold-400 rounded-sm opacity-60 hover:opacity-100 transition-opacity"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Traffic overview mock chart */}
              <div className="lg:col-span-8 p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">Traffic & Sessions Overview</h3>
                  <div className="flex gap-4 text-[10px] font-mono">
                    <span className="flex items-center gap-1.5 text-gold-400"><span className="w-2 h-2 rounded-full bg-gold-400"></span> Visitors</span>
                    <span className="flex items-center gap-1.5 text-neutral-500"><span className="w-2 h-2 rounded-full bg-neutral-600"></span> Sessions</span>
                  </div>
                </div>
                
                {/* Clean graphic placeholder representing the premium chart */}
                <div className="h-64 border border-dashed border-neutral-900 rounded flex flex-col justify-between p-6">
                  <div className="flex justify-between text-[9px] font-mono text-neutral-600">
                    <span>30K</span>
                    <span>20K</span>
                    <span>10K</span>
                    <span>0K</span>
                  </div>
                  <div className="h-40 relative flex items-end">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#161616" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#161616" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="#161616" strokeWidth="0.5" />
                      {/* Spline visitor representation */}
                      <path d="M 0 80 Q 15 50 30 65 T 60 40 T 90 20 T 100 35" fill="none" stroke="#b3913b" strokeWidth="2" />
                      {/* Spline sessions representation */}
                      <path d="M 0 90 Q 15 65 30 75 T 60 55 T 90 35 T 100 48" fill="none" stroke="#525252" strokeWidth="1.5" strokeDasharray="3,3" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-neutral-600">
                    <span>May 20</span>
                    <span>May 27</span>
                    <span>Jun 03</span>
                    <span>Jun 10</span>
                    <span>Jun 17</span>
                  </div>
                </div>
              </div>

              {/* Top Pages list */}
              <div className="lg:col-span-4 p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-4">
                <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">Top Ecosystem Pages</h3>
                <div className="space-y-4 pt-2">
                  {[
                    { page: '/', views: '38,430', pct: '/home' },
                    { page: '/projects', views: '24,210', pct: '/portfolio' },
                    { page: '/brands', views: '18,430', pct: '/ventures' },
                    { page: '/about', views: '12,120', pct: '/founders' },
                    { page: '/contact', views: '8,940', pct: '/intake' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-white font-mono block">{p.page}</span>
                        <span className="text-[9px] text-neutral-600 uppercase font-mono">{p.pct}</span>
                      </div>
                      <span className="font-mono font-bold text-gold-400">{p.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Projects */}
              <div className="p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">Recent Projects</h3>
                  <button onClick={() => setActiveTab('projects')} className="text-[10px] font-mono text-gold-400 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {projects.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 p-2.5 rounded bg-neutral-950/40 border border-neutral-900/50">
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <span className="text-white font-bold text-xs block">{p.title}</span>
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">{p.category} | Created {p.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Media Assets */}
              <div className="p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">Recent Media</h3>
                  <button onClick={() => setActiveTab('media')} className="text-[10px] font-mono text-gold-400 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {mediaItems.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex items-center gap-4 p-2.5 rounded bg-neutral-950/40 border border-neutral-900/50">
                      <div className="w-10 h-10 rounded bg-neutral-900 flex items-center justify-center border border-neutral-800">
                        {m.type === 'pdf' ? (
                          <FileText className="w-4 h-4 text-gold-400" />
                        ) : m.type === 'video' ? (
                          <Video className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Image className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <span className="text-white font-bold text-xs block truncate max-w-xs">{m.name}</span>
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">{m.category} | size: {m.size || '3 MB'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Actions & Events bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Events list */}
              <div className="lg:col-span-8 p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-4">
                <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">Upcoming Brand Events</h3>
                <div className="space-y-4 pt-2">
                  {[
                    { title: 'Fitness Power Hour – Rooftop', date: 'JUN 21', loc: 'Grand Beach Hotel Miami', time: '10:00 AM' },
                    { title: 'Wellness & Hydration Retreat', date: 'JUN 28', loc: 'Miami, Florida', time: 'All Day Event' },
                    { title: 'FMF Community Workout & Fashion Meetup', date: 'JUL 05', loc: 'South Beach', time: '8:30 AM' }
                  ].map((ev, i) => (
                    <div key={i} className="flex items-center gap-6 text-xs p-3 border border-neutral-900 bg-neutral-950/30 rounded">
                      <div className="p-2 border border-gold-400 bg-gold-950/20 text-gold-300 font-mono text-center rounded w-16">
                        <span className="block text-[8px] uppercase">Miami</span>
                        <span className="block text-sm font-bold">{ev.date}</span>
                      </div>
                      <div>
                        <span className="text-white font-bold block">{ev.title}</span>
                        <span className="font-mono text-[9px] text-neutral-500 block uppercase mt-0.5">{ev.loc} | {ev.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-4 p-6 border border-neutral-900 bg-[#0a0a0a] rounded-lg space-y-4">
                <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">Quick CMS Launch</h3>
                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('brands');
                      setTimeout(() => handleCreateNew(), 200);
                    }}
                    className="w-full py-3 border border-neutral-800 hover:border-gold-400 text-left px-4 text-xs font-mono text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Add New Brand Venture</span>
                    <ChevronRight className="w-4 h-4 text-gold-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('modeling');
                      setTimeout(() => handleCreateNew(), 200);
                    }}
                    className="w-full py-3 border border-neutral-800 hover:border-gold-400 text-left px-4 text-xs font-mono text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Add Modeling Campaign</span>
                    <ChevronRight className="w-4 h-4 text-gold-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('media');
                      setTimeout(() => handleCreateNew(), 200);
                    }}
                    className="w-full py-3 border border-neutral-800 hover:border-gold-400 text-left px-4 text-xs font-mono text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Upload Brand PDF Lookbook</span>
                    <ChevronRight className="w-4 h-4 text-gold-400" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SEO Metadata Module Layout */}
        {activeTab === 'seo' && (
          <SeoMetadataManager
            brands={brands}
            setBrands={setBrands}
            pageSeo={pageSeo}
            setPageSeo={setPageSeo}
          />
        )}

        {/* BOUTIQUE PRODUCTS CMS TAB */}
        {activeTab === 'boutique_products' && (
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-6">
              <div>
                <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-gold-400" />
                  Boutique Products Registry
                </h1>
                <p className="text-neutral-500 text-xs">
                  Create luxury products, regulate stock thresholds, configure digital lookbooks, assign brand connections, and toggle drops instantly.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    id: '',
                    name: '',
                    brandId: brands[0]?.id || '',
                    category: 'Fashion',
                    price: 250,
                    salePrice: undefined,
                    inventory: 15,
                    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800'],
                    sizes: ['S', 'M', 'L'],
                    colors: ['Noir', 'Blanc', 'Or'],
                    description: 'A masterpiece crafted with standard luxury guidelines.',
                    featured: true,
                    comingSoon: false,
                    limitedDrop: false,
                    preOrder: false,
                    soldOut: false,
                    digitalDownloadUrl: '',
                    pdfCatalogName: '',
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-3 bg-neutral-900 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-white rounded text-xs font-bold tracking-widest uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(179,145,59,0.15)]"
              >
                <Plus className="w-4 h-4" /> Add Boutique Product
              </button>
            </div>

            {/* Product Table Grid */}
            <div className="bg-neutral-950/40 border border-neutral-900 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 max-w-md bg-neutral-950 border border-neutral-900 rounded px-3 py-1.5">
                <Search className="w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter products by moniker or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs text-white"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-500 font-mono text-[9px] uppercase tracking-wider bg-neutral-950/40">
                      <th className="p-4">Product Detail</th>
                      <th className="p-4">Brand Connection</th>
                      <th className="p-4">Pricing</th>
                      <th className="p-4">Inventory</th>
                      <th className="p-4">Quick Status Badges (Click to Toggle)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((p) => {
                        const linkedBrand = brands.find(b => b.id === p.brandId);
                        return (
                          <tr key={p.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-10 h-10 object-cover rounded border border-neutral-800"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="font-bold text-white uppercase block tracking-tight">{p.name}</span>
                                  <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">{p.category}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-neutral-400 uppercase text-[10px] bg-neutral-900 px-2 py-1 rounded">
                                {linkedBrand?.name || 'Curated Portfolio'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="font-mono text-xs">
                                {p.salePrice ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 line-through">${p.price}</span>
                                    <span className="text-gold-400 font-bold">${p.salePrice}</span>
                                  </div>
                                ) : (
                                  <span className="text-white">${p.price}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${p.soldOut || p.inventory === 0 ? 'bg-red-500' : p.inventory <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                <span className="font-mono text-xs text-neutral-300 font-bold">{p.inventory} Units</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Featured toggle */}
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, featured: !item.featured } : item));
                                    if (window.showLuxuryToast) window.showLuxuryToast(`Updated Featured Status for ${p.name}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                    p.featured ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'border-neutral-850 text-neutral-600 hover:text-neutral-400'
                                  }`}
                                >
                                  ★ Featured
                                </button>

                                {/* Preorder toggle */}
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, preOrder: !item.preOrder } : item));
                                    if (window.showLuxuryToast) window.showLuxuryToast(`Updated Pre-Order Status for ${p.name}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                    p.preOrder ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'border-neutral-850 text-neutral-600 hover:text-neutral-400'
                                  }`}
                                >
                                  ⌚ Pre-Order
                                </button>

                                {/* Limited Drop toggle */}
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, limitedDrop: !item.limitedDrop } : item));
                                    if (window.showLuxuryToast) window.showLuxuryToast(`Updated Limited Drop Status for ${p.name}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                    p.limitedDrop ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'border-neutral-850 text-neutral-600 hover:text-neutral-400'
                                  }`}
                                >
                                  ✦ Drop
                                </button>

                                {/* Coming Soon toggle */}
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, comingSoon: !item.comingSoon } : item));
                                    if (window.showLuxuryToast) window.showLuxuryToast(`Updated Coming Soon Status for ${p.name}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                    p.comingSoon ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'border-neutral-850 text-neutral-600 hover:text-neutral-400'
                                  }`}
                                >
                                  ⏲ Soon
                                </button>

                                {/* Sold Out toggle */}
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, soldOut: !item.soldOut } : item));
                                    if (window.showLuxuryToast) window.showLuxuryToast(`Updated Sold Out Status for ${p.name}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                    p.soldOut ? 'bg-red-500/10 border-red-500 text-red-400 font-bold' : 'border-neutral-850 text-neutral-600 hover:text-neutral-400'
                                  }`}
                                >
                                  ✕ Sold Out
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm({
                                    id: p.id,
                                    name: p.name,
                                    brandId: p.brandId,
                                    category: p.category,
                                    price: p.price,
                                    salePrice: p.salePrice,
                                    inventory: p.inventory,
                                    images: p.images,
                                    sizes: p.sizes || [],
                                    colors: p.colors || [],
                                    description: p.description || '',
                                    featured: !!p.featured,
                                    comingSoon: !!p.comingSoon,
                                    limitedDrop: !!p.limitedDrop,
                                    preOrder: !!p.preOrder,
                                    soldOut: !!p.soldOut,
                                    digitalDownloadUrl: p.digitalDownloadUrl || '',
                                    pdfCatalogName: p.pdfCatalogName || '',
                                  });
                                  setIsProductModalOpen(true);
                                }}
                                className="p-2 border border-neutral-800 hover:border-gold-400 rounded text-neutral-400 hover:text-gold-300 cursor-pointer inline-flex transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you certain you wish to delete ${p.name}? This operation is irreversible.`)) {
                                    setProducts(prev => prev.filter(item => item.id !== p.id));
                                    if (window.showLuxuryToast) window.showLuxuryToast(`Archived ${p.name} from global catalogue.`);
                                  }
                                }}
                                className="p-2 border border-neutral-800 hover:border-red-500 rounded text-neutral-400 hover:text-red-400 cursor-pointer inline-flex transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* PRIVILEGE PROMO CODES CMS TAB */}
        {activeTab === 'discount_codes' && (
          <div className="p-8 space-y-6">
            <div className="border-b border-neutral-900 pb-6">
              <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase flex items-center gap-2">
                <Tag className="w-6 h-6 text-gold-400" />
                Elite Privilege Codes
              </h1>
              <p className="text-neutral-500 text-xs">
                Issue brand-wide discount vouchers, restrict access tokens, or provide complementary checkout keys.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Creator Card */}
              <div className="bg-[#0b0b0b] border border-neutral-900 rounded-lg p-6 space-y-4">
                <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider border-b border-neutral-900 pb-2">
                  Generate Code Key
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">PROMO CODE STRING</label>
                    <input
                      type="text"
                      placeholder="e.g. VIPLOUNGE30"
                      value={newPromoCode.code}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">DISCOUNT TYPE</label>
                    <select
                      value={newPromoCode.discountType}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, discountType: e.target.value as any })}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white cursor-pointer"
                    >
                      <option value="percentage">Percentage ( % Off )</option>
                      <option value="fixed">Fixed Cash ( $ Off )</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">VALUE AMOUNT</label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={newPromoCode.value || ''}
                      onChange={(e) => setNewPromoCode({ ...newPromoCode, value: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newPromoCode.code || newPromoCode.value <= 0) {
                        alert('Provide a clean code string and threshold value.');
                        return;
                      }
                      const matchIdx = promoCodes.findIndex(c => c.code === newPromoCode.code);
                      if (matchIdx >= 0) {
                        alert('Code key already exists in security vault.');
                        return;
                      }
                      setPromoCodes(prev => [
                        ...prev,
                        {
                          id: 'code_' + Date.now(),
                          code: newPromoCode.code,
                          discountType: newPromoCode.discountType,
                          value: newPromoCode.value,
                          active: true,
                        }
                      ]);
                      setNewPromoCode({ code: '', discountType: 'percentage', value: 0 });
                      if (window.showLuxuryToast) window.showLuxuryToast(`Successfully generated Privilege Code: ${newPromoCode.code}`);
                    }}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs uppercase tracking-widest transition-all rounded cursor-pointer mt-4"
                  >
                    GENERATE SYSTEM TOKEN
                  </button>
                </div>
              </div>

              {/* Codes Ledger */}
              <div className="lg:col-span-2 bg-[#0b0b0b] border border-neutral-900 rounded-lg p-6 space-y-4">
                <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider border-b border-neutral-900 pb-2">
                  Vault Records
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-900 text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                        <th className="p-3">Discount Token</th>
                        <th className="p-3">Calculation Formula</th>
                        <th className="p-3">Active Vault State</th>
                        <th className="p-3 text-right">Vault Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((code) => (
                        <tr key={code.id} className="border-b border-neutral-900/40 hover:bg-neutral-950/20 transition-colors">
                          <td className="p-3 font-mono font-extrabold text-white uppercase">{code.code}</td>
                          <td className="p-3 text-neutral-300 font-mono">
                            {code.discountType === 'percentage' ? `${code.value}% OFF` : `$${code.value} OFF`}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setPromoCodes(prev => prev.map(c => c.id === code.id ? { ...c, active: !c.active } : c));
                                if (window.showLuxuryToast) window.showLuxuryToast(`Toggled activation for key: ${code.code}`);
                              }}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                code.active ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'
                              }`}
                            >
                              {code.active ? '● LIVE ACTIVE' : '✕ LOCKED'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you certain you wish to revoke token ${code.code}?`)) {
                                  setPromoCodes(prev => prev.filter(c => c.id !== code.id));
                                  if (window.showLuxuryToast) window.showLuxuryToast(`Revoked code token: ${code.code}`);
                                }
                              }}
                              className="p-1.5 border border-neutral-800 hover:border-red-500 text-neutral-500 hover:text-red-400 transition-all rounded cursor-pointer inline-flex"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ORDER MANAGEMENT CMS TAB */}
        {activeTab === 'orders_mgmt' && (
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-6">
              <div>
                <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-gold-400" />
                  Order Management
                </h1>
                <p className="text-neutral-500 text-xs">
                  Review direct customer logs, trace logistics channels, process refunds, and generate ledger CSV exports.
                </p>
              </div>

              {/* Data Export Button for Orders */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `tmk_boutique_orders_${Date.now()}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    if (window.showLuxuryToast) window.showLuxuryToast('Exported entire orders registry to JSON format.');
                  }}
                  className="px-4 py-2 border border-neutral-800 hover:border-gold-500/40 text-neutral-400 hover:text-gold-300 rounded text-xs font-mono tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" /> JSON Export
                </button>

                <button
                  onClick={() => {
                    let csvContent = "data:text/csv;charset=utf-8,";
                    csvContent += "OrderID,CustomerName,CustomerEmail,Items,GrandTotal,TaxPaid,ShippingCost,Status,OrderDate\n";
                    orders.forEach(o => {
                      const itemsStr = o.items.map(it => `${it.productName}(x${it.quantity})`).join("; ");
                      const row = [
                        o.id,
                        o.customerDetails.firstName + " " + o.customerDetails.lastName,
                        o.customerDetails.email,
                        itemsStr,
                        o.grandTotal,
                        o.taxAmount,
                        o.shippingCost,
                        o.status,
                        o.createdAt
                      ].map(escapeCsvValue).join(",");
                      csvContent += row + "\n";
                    });
                    const encodedUri = encodeURI(csvContent);
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", encodedUri);
                    downloadAnchor.setAttribute("download", `tmk_boutique_orders_${Date.now()}.csv`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    if (window.showLuxuryToast) window.showLuxuryToast('Exported entire orders database to CSV format.');
                  }}
                  className="px-4 py-2 border border-neutral-800 hover:border-gold-500/40 text-neutral-400 hover:text-gold-300 rounded text-xs font-mono tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> CSV Export
                </button>
              </div>
            </div>

            {/* Quick KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0b0b0b] border border-neutral-900 rounded p-6">
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Total Orders</span>
                <span className="font-sans font-extrabold text-2xl text-white block mt-1">{orders.length}</span>
              </div>
              <div className="bg-[#0b0b0b] border border-neutral-900 rounded p-6">
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Gross Revenue Volume</span>
                <span className="font-sans font-extrabold text-2xl text-gold-400 block mt-1">
                  ${orders.reduce((sum, o) => o.status === 'Completed' ? sum + o.grandTotal : sum, 0).toFixed(2)}
                </span>
              </div>
              <div className="bg-[#0b0b0b] border border-neutral-900 rounded p-6">
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Refunded Settlements</span>
                <span className="font-sans font-extrabold text-2xl text-neutral-500 block mt-1">
                  {orders.filter(o => o.status === 'Refunded').length} Orders
                </span>
              </div>
            </div>

            {/* Orders Ledger */}
            <div className="bg-[#0b0b0b] border border-neutral-900 rounded-lg p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-900 pb-4">
                <div>
                  <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
                    Order Placement Archive
                  </h3>
                  <p className="text-neutral-500 text-[10px] font-mono mt-0.5">
                    Showing {filteredOrders.length} of {orders.length} transaction records
                  </p>
                </div>

                {/* Search & Filter controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search name, email, item, ref..."
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 rounded px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                    />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-2.5 top-2 text-[8px] text-neutral-500 hover:text-white font-mono"
                      >
                        [X]
                      </button>
                    )}
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-900 focus:border-gold-500 rounded px-3 py-1.5 text-xs text-white cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 font-mono uppercase tracking-widest">
                  {orders.length === 0 
                    ? "No boutique sales have been transacted in this session yet."
                    : "No orders match the selected search and filter criteria."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-900 text-neutral-500 font-mono text-[9px] uppercase tracking-wider bg-neutral-950/20">
                        <th className="p-4">Order Ref Token</th>
                        <th className="p-4">Buyer Entity</th>
                        <th className="p-4">Items Summary</th>
                        <th className="p-4">Settlement Sum</th>
                        <th className="p-4">Logistic State</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40 transition-colors">
                          <td className="p-4 font-mono font-extrabold text-gold-400 uppercase">#{order.id}</td>
                          <td className="p-4">
                            <div>
                              <span className="text-white block font-bold">{order.customerDetails.firstName} {order.customerDetails.lastName}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">{order.customerDetails.email}</span>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-300">
                            {order.items.map(it => `${it.productName} (x${it.quantity})`).join(', ')}
                          </td>
                          <td className="p-4 font-mono text-white font-bold">${order.grandTotal.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-[8px] font-mono uppercase tracking-widest ${
                              order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              order.status === 'Pending' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white rounded text-[10px] font-mono uppercase transition-colors cursor-pointer"
                            >
                              Inspect Details
                            </button>

                            {order.status !== 'Refunded' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Do you wish to initiate a formal refund for Order #${order.id}?`)) {
                                    updateOrderStatus(order.id, 'Refunded');
                                  }
                                }}
                                className="px-3 py-1.5 border border-red-950 hover:border-red-500 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded text-[10px] font-mono uppercase transition-colors cursor-pointer"
                              >
                                Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* SALES ANALYTICS & SETTINGS CMS TAB */}
        {activeTab === 'boutique_analytics' && (
          <div className="p-8 space-y-6">
            <div className="border-b border-neutral-900 pb-6">
              <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-gold-400" />
                Sales Analytics & Global Settings
              </h1>
              <p className="text-neutral-500 text-xs">
                Assess mathematical revenue graphs, trace brand distributions, and configure global variables like tax scales and custom shipping tariffs.
              </p>
            </div>

            {/* Config Panel and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Analytics graph (gorgeous responsive HTML5 custom SVG area chart!) */}
              <div className="lg:col-span-2 bg-[#0b0b0b] border border-neutral-900 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">Revenue Accrual Timeline</h3>
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block mt-0.5">Computational projection (June 2026)</span>
                </div>

                <div className="h-64 bg-neutral-950/50 border border-neutral-900 rounded p-4 relative flex items-end">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="border-b border-neutral-900 w-full h-0"></div>
                    <div className="border-b border-neutral-900 w-full h-0"></div>
                    <div className="border-b border-neutral-900 w-full h-0"></div>
                    <div className="border-b border-neutral-900 w-full h-0"></div>
                  </div>

                  {/* SVG Chart */}
                  <svg className="w-full h-full z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grids / lines */}
                    <path
                      d="M 10 180 Q 120 150 220 110 T 400 40 T 490 20"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="2"
                    />
                    <path
                      d="M 10 180 Q 120 150 220 110 T 400 40 T 490 20 L 490 200 L 10 200 Z"
                      fill="url(#chart-grad)"
                    />
                    {/* Dots */}
                    <circle cx="10" cy="180" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="120" cy="155" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="220" cy="110" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="400" cy="40" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="490" cy="20" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
                  </svg>

                  {/* Horizontal Labels */}
                  <div className="absolute bottom-1 left-0 right-0 px-4 flex justify-between font-mono text-[8px] text-neutral-500 uppercase tracking-widest pointer-events-none">
                    <span>June 01</span>
                    <span>June 08</span>
                    <span>June 15</span>
                    <span>June 22</span>
                    <span>June 29</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-neutral-900 rounded p-4">
                    <span className="font-mono text-[8px] text-neutral-500 uppercase block">Total Items Sold</span>
                    <span className="font-sans font-extrabold text-xl text-white block mt-1">
                      {orders.reduce((sum, o) => o.status === 'Completed' ? sum + o.items.reduce((acc, it) => acc + it.quantity, 0) : sum, 0)} Units
                    </span>
                  </div>

                  <div className="border border-neutral-900 rounded p-4">
                    <span className="font-mono text-[8px] text-neutral-500 uppercase block">Average Ticket Size</span>
                    <span className="font-sans font-extrabold text-xl text-white block mt-1">
                      ${(() => {
                        const completed = orders.filter(o => o.status === 'Completed');
                        if (completed.length === 0) return '0.00';
                        return (completed.reduce((sum, o) => sum + o.grandTotal, 0) / completed.length).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Global Boutique Settings Rules */}
              <div className="bg-[#0b0b0b] border border-neutral-900 rounded-lg p-6 space-y-4">
                <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider border-b border-neutral-900 pb-2">
                  Global Commerce Settings
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Standard Tax Rate Percentage (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={globalTaxRate}
                      onChange={(e) => setGlobalTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Standard Ground Shipping tariff ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={globalStandardShipping}
                      onChange={(e) => setGlobalStandardShipping(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Express Overnight Shipping tariff ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={globalExpressShipping}
                      onChange={(e) => setGlobalExpressShipping(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (window.showLuxuryToast) {
                        window.showLuxuryToast('Applied and propagated new global tariffs and tax rates.');
                      } else {
                        alert('Applied rules.');
                      }
                    }}
                    className="w-full py-3 bg-neutral-900 border border-gold-500/20 hover:border-gold-400 text-gold-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-all rounded cursor-pointer"
                  >
                    APPLY GLOBAL PARAMETERS
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab !== 'dashboard' && activeTab !== 'seo' && activeTab !== 'boutique_products' && activeTab !== 'discount_codes' && activeTab !== 'orders_mgmt' && activeTab !== 'boutique_analytics' && (
          <div className="p-8 space-y-6">
            
            {/* Header controls for list */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-6">
              <div>
                <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight uppercase flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-gold-400" />
                  CMS: {sidebarItems.find(i => i.id === activeTab)?.label}
                </h1>
                <p className="text-neutral-500 text-xs">
                  Review entries, perform rapid updates, publish, reorder ranks, and direct-upload file assets instantly.
                </p>
              </div>

              <div className="flex gap-3">
                {activeTab === 'pdfs' && (
                  <button
                    onClick={handleBulkDownloadZip}
                    disabled={selectedPdfIds.length === 0 || isBulkDownloading}
                    className={`px-5 py-3 border text-xs font-bold tracking-widest flex items-center gap-2 transition-all uppercase ${
                      selectedPdfIds.length > 0
                        ? 'border-gold-500 hover:bg-gold-500 hover:text-black text-gold-400 cursor-pointer shadow-[0_0_15px_rgba(179,145,59,0.25)]'
                        : 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    {isBulkDownloading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        COMPRESSING...
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Bulk ZIP {selectedPdfIds.length > 0 ? `(${selectedPdfIds.length})` : ''}
                      </>
                    )}
                  </button>
                )}
                {(activeTab === 'brands' || activeTab === 'projects') && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsExportOpen(!isExportOpen)}
                      className="px-5 py-3 border border-neutral-800 hover:border-gold-500 text-neutral-400 hover:text-gold-400 text-xs font-bold tracking-widest flex items-center gap-2 transition-colors cursor-pointer uppercase"
                    >
                      <Download className="w-4 h-4 text-gold-400" />
                      {activeTab === 'brands' ? 'Export Portfolio' : 'Export Projects'}
                    </button>
                    {isExportOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                        <div className="absolute right-0 mt-1.5 w-48 bg-[#0a0a0a] border border-neutral-900 rounded shadow-2xl z-50 overflow-hidden divide-y divide-neutral-900">
                          <div className="p-2.5 text-[9px] font-mono text-neutral-500 uppercase tracking-wider bg-[#0d0d0d]">
                            Select Format
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleExportJson(activeTab as 'brands' | 'projects');
                              setIsExportOpen(false);
                            }}
                            className="w-full text-left p-3 text-[11px] font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-gold-400" />
                            Structured JSON
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleExportCsv(activeTab as 'brands' | 'projects');
                              setIsExportOpen(false);
                            }}
                            className="w-full text-left p-3 text-[11px] font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-gold-400" />
                            Standard CSV
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest flex items-center gap-2 transition-colors cursor-pointer uppercase"
                >
                  <Plus className="w-4 h-4" /> Create New Entry
                </button>
              </div>
            </div>

            {/* List Table container */}
            <div className="border border-neutral-900 bg-[#0a0a0a] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-neutral-900 flex justify-between items-center bg-[#0d0d0d]">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Quick search active lists..."
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded py-1.5 pl-9 pr-3 text-xs text-white"
                  />
                </div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  Double-click or edit rows to edit parameters
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-500 font-mono text-[9px] uppercase tracking-wider bg-neutral-950/40">
                      <th className="p-4 font-mono">
                        {activeTab === 'pdfs' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={
                                (() => {
                                  const pdfList = [...brands.filter(b => b.customPdfUrl), { id: 'fallback-directory' }];
                                  return pdfList.length > 0 && selectedPdfIds.length === pdfList.length;
                                })()
                              }
                              onChange={(e) => {
                                const pdfList = [...brands.filter(b => b.customPdfUrl), { id: 'fallback-directory' }];
                                if (e.target.checked) {
                                  setSelectedPdfIds(pdfList.map(p => p.id));
                                } else {
                                  setSelectedPdfIds([]);
                                }
                              }}
                              className="accent-gold-500 w-3.5 h-3.5 rounded border border-neutral-800 bg-neutral-950 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <span>SELECT ALL</span>
                          </div>
                        ) : (
                          "Rank Order"
                        )}
                      </th>
                      <th className="p-4">Entity Detail</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Database Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render table depending on selected module */}
                    {activeTab === 'brands' && brands
                      .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item, idx) => (
                        <tr key={item.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40">
                          <td className="p-4 font-mono font-bold text-gold-400">
                            <div className="flex items-center gap-1.5">
                              <span>0{idx + 1}</span>
                              <div className="flex flex-col">
                                <button onClick={() => handleMoveUp(idx)} className="text-neutral-600 hover:text-white p-0.5 cursor-pointer"><ChevronUp className="w-3 h-3" /></button>
                                <button onClick={() => handleMoveDown(idx)} className="text-neutral-600 hover:text-white p-0.5 cursor-pointer"><ChevronDown className="w-3 h-3" /></button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.logo ? (
                                <img src={item.logo} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded bg-neutral-900 object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center font-bold text-gold-400">B</div>
                              )}
                              <div>
                                <span className="font-bold text-white block">{item.name}</span>
                                <span className="text-[10px] text-neutral-500 block truncate max-w-xs">{item.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[10px] uppercase text-neutral-400">{item.category}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleFeature(item.id)}
                              className={`p-1 rounded cursor-pointer ${item.featured ? 'text-yellow-400 hover:text-yellow-500' : 'text-neutral-600 hover:text-neutral-300'}`}
                            >
                              <Sparkles className="w-4 h-4 fill-current" />
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleArchive(item.id)}
                              className={`px-2 py-0.5 font-mono text-[9px] uppercase rounded tracking-widest border cursor-pointer ${
                                item.status === 'Active' 
                                  ? 'border-green-500/20 bg-green-950/20 text-green-400' 
                                  : item.status === 'Coming Soon'
                                  ? 'border-gold-500/20 bg-gold-950/20 text-gold-400'
                                  : 'border-neutral-700 bg-neutral-900 text-neutral-500'
                              }`}
                            >
                              {item.status}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => handleEditItem(item)} className="p-2 border border-neutral-800 hover:border-gold-400 rounded text-neutral-400 hover:text-white cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 border border-neutral-800 hover:border-red-900 rounded text-neutral-400 hover:text-red-400 cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                    ))}

                    {activeTab === 'modeling' && modelingItems
                      .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item, idx) => (
                        <tr key={item.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40">
                          <td className="p-4 font-mono font-bold text-gold-400">
                            <div className="flex items-center gap-1.5">
                              <span>0{idx + 1}</span>
                              <div className="flex flex-col">
                                <button onClick={() => handleMoveUp(idx)} className="text-neutral-600 hover:text-white p-0.5 cursor-pointer"><ChevronUp className="w-3 h-3" /></button>
                                <button onClick={() => handleMoveDown(idx)} className="text-neutral-600 hover:text-white p-0.5 cursor-pointer"><ChevronDown className="w-3 h-3" /></button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded bg-neutral-900 object-cover" />
                              <div>
                                <span className="font-bold text-white block">{item.title}</span>
                                <span className="text-[10px] text-neutral-500 block">Client: {item.client || 'General'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[10px] uppercase text-neutral-400">{item.category}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleFeature(item.id)}
                              className={`p-1 rounded cursor-pointer ${item.featured ? 'text-yellow-400 hover:text-yellow-500' : 'text-neutral-600 hover:text-neutral-300'}`}
                            >
                              <Sparkles className="w-4 h-4 fill-current" />
                            </button>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 font-mono text-[9px] uppercase rounded tracking-widest border border-green-500/20 bg-green-950/20 text-green-400">
                              PUBLISHED
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => handleEditItem(item)} className="p-2 border border-neutral-800 hover:border-gold-400 rounded text-neutral-400 hover:text-white cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 border border-neutral-800 hover:border-red-900 rounded text-neutral-400 hover:text-red-400 cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                    ))}

                    {activeTab === 'pdfs' && (
                      <>
                        {brands.filter(b => b.customPdfUrl).map((brand, idx) => (
                          <tr key={brand.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40">
                            <td className="p-4 font-mono font-bold text-gold-400">
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={selectedPdfIds.includes(brand.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPdfIds([...selectedPdfIds, brand.id]);
                                    } else {
                                      setSelectedPdfIds(selectedPdfIds.filter(id => id !== brand.id));
                                    }
                                  }}
                                  className="accent-gold-500 w-3.5 h-3.5 rounded border border-neutral-800 bg-neutral-950 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                <span>0{idx + 1}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                {/* Visual PDF Cover/Booklet Miniature Thumbnail */}
                                <div 
                                  onClick={() => {
                                    setPreviewPdfBrand(brand);
                                    setPreviewPdfPage(1);
                                    setPreviewZoomLevel(1);
                                    setIsIframeView(false);
                                  }}
                                  className="relative w-12 h-16 bg-[#0c0c0c] border border-gold-500/20 rounded shadow-[0_4px_12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-1 group/thumb cursor-pointer hover:border-gold-400 transition-all shrink-0"
                                  title="Click to Preview Lookbook"
                                >
                                  <div className="border border-gold-500/10 h-full w-full flex flex-col justify-between p-1 bg-gradient-to-b from-[#121212] to-[#080808]">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[4px] text-gold-400 font-mono tracking-widest uppercase">TMK</span>
                                      <div className="w-1 h-1 rounded-full bg-gold-400/50"></div>
                                    </div>
                                    <div className="text-center">
                                      <span className="text-[5px] text-white block font-sans font-bold uppercase leading-none truncate w-full px-0.5">
                                        {brand.name}
                                      </span>
                                      <span className="text-[3px] text-gold-400/80 block font-mono tracking-widest leading-none mt-0.5 uppercase">
                                        REPERTOIRE
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-end text-[3px] text-neutral-500 font-mono">
                                      <span>2026</span>
                                      <span>PDF</span>
                                    </div>
                                  </div>
                                  <div className="absolute inset-0 bg-black/65 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-3.5 h-3.5 text-gold-400" />
                                  </div>
                                </div>

                                <div>
                                  <span className="font-bold text-white block truncate max-w-xs">{brand.customPdfName || `${brand.name}_executive_summary.pdf`}</span>
                                  <span className="text-[10px] text-neutral-500 block font-light">Linked Venture: {brand.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[10px] uppercase text-neutral-400">Executive PDF</td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setBrands(brands.map(b => b.id === brand.id ? { ...b, featured: !b.featured } : b));
                                }}
                                className={`p-1 rounded cursor-pointer ${brand.featured ? 'text-yellow-400 hover:text-yellow-500' : 'text-neutral-600 hover:text-neutral-300'}`}
                              >
                                <Sparkles className="w-4 h-4 fill-current" />
                              </button>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase rounded tracking-widest border border-green-500/20 bg-green-950/20 text-green-400">
                                ACTIVE BINDING
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setPreviewPdfBrand(brand);
                                  setPreviewPdfPage(1);
                                  setPreviewZoomLevel(1);
                                  setIsIframeView(false);
                                }}
                                className="px-2.5 py-1.5 border border-gold-500/30 hover:border-gold-400 bg-gold-950/10 text-gold-400 hover:text-white rounded text-[10px] font-mono uppercase tracking-wider transition-colors inline-block align-middle cursor-pointer"
                              >
                                Preview Lookbook
                              </button>
                              <a
                                href={brand.customPdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 border border-neutral-800 hover:border-neutral-400 text-neutral-400 hover:text-white rounded text-[10px] font-mono uppercase tracking-wider transition-colors inline-block align-middle cursor-pointer"
                              >
                                View File
                              </a>
                              <button
                                onClick={() => {
                                  setBrands(brands.map(b => b.id === brand.id ? { ...b, customPdfUrl: '', customPdfName: '' } : b));
                                  if (window.showLuxuryToast) {
                                    window.showLuxuryToast(`Removed custom PDF from ${brand.name}.`);
                                  }
                                }}
                                className="p-2 border border-neutral-800 hover:border-red-900 rounded text-neutral-400 hover:text-red-400 cursor-pointer inline-flex align-middle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Static default library entry for simulation fallback */}
                        <tr className="border-b border-neutral-900/60 hover:bg-neutral-950/40">
                          <td className="p-4 font-mono font-bold text-gold-400">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={selectedPdfIds.includes('fallback-directory')}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPdfIds([...selectedPdfIds, 'fallback-directory']);
                                  } else {
                                    setSelectedPdfIds(selectedPdfIds.filter(id => id !== 'fallback-directory'));
                                  }
                                }}
                                className="accent-gold-500 w-3.5 h-3.5 rounded border border-neutral-800 bg-neutral-950 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                              />
                              <span>0{brands.filter(b => b.customPdfUrl).length + 1}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Fallback general directory thumbnail */}
                              <div 
                                onClick={() => {
                                  setPreviewPdfBrand({
                                    id: 'fallback-directory',
                                    name: 'TheMainKeys General Directory',
                                    customPdfName: 'themainkeys_ventures_factsheet_2026.pdf',
                                    customPdfUrl: '',
                                    category: 'Corporate Repertoire',
                                    featured: true,
                                    description: 'A global compendium of luxury partners, curated fashion designers, high-fashion models, and digital transformation initiatives backed by TheMainKeys Repertoire.',
                                    brandStory: 'TheMainKeys serves as an elite bridge between European fashion capitals, emerging sustainable trends, and pioneering Web3/corporate innovations. This directory represents our active portfolio, vetted and curated for discerning corporate clients, hospitality giants, and high-fashion modeling campaigns.',
                                    caseStudyTitle: 'Strategic Repertoire Integration',
                                    caseStudyContent: 'Across 14 operational modules, TheMainKeys coordinates strategic PR placement, digital lookbook distribution, active founder alignment, and secure document vaults to secure friction-free brand representation in Paris, Milan, London, and New York.'
                                  });
                                  setPreviewPdfPage(1);
                                  setPreviewZoomLevel(1);
                                  setIsIframeView(false);
                                }}
                                className="relative w-12 h-16 bg-[#0d0a06] border border-gold-500/30 rounded shadow-[0_4px_12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-1 group/thumb cursor-pointer hover:border-gold-400 transition-all shrink-0"
                                title="Click to Preview Lookbook"
                              >
                                <div className="border border-gold-500/20 h-full w-full flex flex-col justify-between p-1 bg-gradient-to-b from-[#18120a] to-[#0a0704]">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[4px] text-gold-400 font-mono tracking-widest uppercase">SYSTEM</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500/80"></div>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-[5px] text-white block font-sans font-extrabold uppercase leading-none">
                                      DIRECTORY
                                    </span>
                                    <span className="text-[3px] text-gold-400 block font-mono tracking-wider mt-0.5 uppercase">
                                      GLOBAL FILE
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-end text-[3px] text-neutral-400 font-mono">
                                    <span>2026</span>
                                    <span>FALLBACK</span>
                                  </div>
                                </div>
                                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-3.5 h-3.5 text-gold-400" />
                                </div>
                              </div>

                              <div>
                                <span className="font-bold text-white block">themainkeys_ventures_factsheet_2026.pdf</span>
                                <span className="text-[10px] text-neutral-500 block font-light">Linked Brand: General Directory</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[10px] uppercase text-neutral-400">Dynamic PDF Fallback</td>
                          <td className="p-4"><Sparkles className="w-4 h-4 text-neutral-600" /></td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 font-mono text-[9px] uppercase rounded tracking-widest border border-gold-500/20 bg-gold-950/20 text-gold-400">
                              SYSTEM GENERATED
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setPreviewPdfBrand({
                                  id: 'fallback-directory',
                                  name: 'TheMainKeys General Directory',
                                  customPdfName: 'themainkeys_ventures_factsheet_2026.pdf',
                                  customPdfUrl: '',
                                  category: 'Corporate Repertoire',
                                  featured: true,
                                  description: 'A global compendium of luxury partners, curated fashion designers, high-fashion models, and digital transformation initiatives backed by TheMainKeys Repertoire.',
                                  brandStory: 'TheMainKeys serves as an elite bridge between European fashion capitals, emerging sustainable trends, and pioneering Web3/corporate innovations. This directory represents our active portfolio, vetted and curated for discerning corporate clients, hospitality giants, and high-fashion modeling campaigns.',
                                  caseStudyTitle: 'Strategic Repertoire Integration',
                                  caseStudyContent: 'Across 14 operational modules, TheMainKeys coordinates strategic PR placement, digital lookbook distribution, active founder alignment, and secure document vaults to secure friction-free brand representation in Paris, Milan, London, and New York.'
                                });
                                setPreviewPdfPage(1);
                                setPreviewZoomLevel(1);
                                setIsIframeView(false);
                              }}
                              className="px-2.5 py-1.5 border border-gold-500/30 hover:border-gold-400 bg-gold-950/10 text-gold-400 hover:text-white rounded text-[10px] font-mono uppercase tracking-wider transition-colors inline-block align-middle cursor-pointer"
                            >
                              Preview Lookbook
                            </button>
                            <button
                              onClick={() => window.showLuxuryToast ? window.showLuxuryToast('Downloading system-generated corporate repertoire directory...') : alert('Downloaded')}
                              className="px-2.5 py-1.5 border border-neutral-800 rounded text-neutral-400 text-[10px] font-mono uppercase tracking-wider cursor-pointer inline-block align-middle"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      </>
                    )}

                    {/* Generic Simulation rows for other miscellaneous 12 modules */}
                    {activeTab !== 'brands' && activeTab !== 'modeling' && activeTab !== 'pdfs' && (
                      <>
                        <tr className="border-b border-neutral-900/60 hover:bg-neutral-950/40">
                          <td className="p-4 font-mono font-bold text-gold-400">01</td>
                          <td className="p-4">
                            <div>
                              <span className="font-bold text-white block">Ecosystem Demo Entry Alpha</span>
                              <span className="text-[10px] text-neutral-500 block">Simulated configuration for {sidebarItems.find(i => i.id === activeTab)?.label}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[10px] uppercase text-neutral-400">System Core</td>
                          <td className="p-4"><Sparkles className="w-4 h-4 text-yellow-400 fill-current" /></td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 font-mono text-[9px] uppercase rounded tracking-widest border border-green-500/20 bg-green-950/20 text-green-400">
                              ACTIVE
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => window.showLuxuryToast ? window.showLuxuryToast('Editing simulation entry is locked for system core assets.') : alert('Editing simulation entry')} className="p-2 border border-neutral-800 rounded text-neutral-400 cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => window.showLuxuryToast ? window.showLuxuryToast('Deleting system core demo elements is prohibited.') : alert('Deleting simulation entry')} className="p-2 border border-neutral-800 rounded text-neutral-400 cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                        <tr className="border-b border-neutral-900/60 hover:bg-neutral-950/40">
                          <td className="p-4 font-mono font-bold text-gold-400">02</td>
                          <td className="p-4">
                            <div>
                              <span className="font-bold text-white block">Ecosystem Demo Entry Beta</span>
                              <span className="text-[10px] text-neutral-500 block">Pre-staged mock for structural scaling</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[10px] uppercase text-neutral-400">Partner Asset</td>
                          <td className="p-4"><Sparkles className="w-4 h-4 text-neutral-600" /></td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 font-mono text-[9px] uppercase rounded tracking-widest border border-gold-500/20 bg-gold-950/20 text-gold-400">
                              COMING SOON
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => window.showLuxuryToast ? window.showLuxuryToast('Editing simulation entry is locked for partner lookbooks.') : alert('Editing simulation entry')} className="p-2 border border-neutral-800 rounded text-neutral-400 cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => window.showLuxuryToast ? window.showLuxuryToast('Deleting partner assets requires secure credential override.') : alert('Deleting simulation entry')} className="p-2 border border-neutral-800 rounded text-neutral-400 cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Extreme high fidelity Create/Edit slide-over modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border-l border-neutral-900 h-screen overflow-y-auto p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-6">
                <div>
                  <h3 className="font-sans font-extrabold text-lg text-white uppercase tracking-wider">
                    {formType === 'create' ? 'Create New' : 'Edit Parameter'} in {sidebarItems.find(i => i.id === activeTab)?.label}
                  </h3>
                  <span className="font-mono text-[8px] text-gold-400 uppercase tracking-widest block mt-0.5">Database Write Lock Active</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 border border-neutral-800 hover:border-white rounded font-mono text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                >
                  [CLOSE [X]]
                </button>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSaveForm} className="space-y-6 text-xs">
                
                {/* Standard input group */}
                <div className="space-y-4">
                  
                  {activeTab === 'pdfs' ? (
                    <div className="space-y-4">
                      {/* Select Brand */}
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Select Target Brand Venture</label>
                        <select
                          required
                          value={formData.linkedBrandId || ''}
                          onChange={(e) => setFormData({ ...formData, linkedBrandId: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white cursor-pointer text-xs"
                        >
                          <option value="">-- Choose Brand Venture --</option>
                          {brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* PDF upload field */}
                      <div className="space-y-2.5">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                          Executive Summary PDF Attachment
                        </label>

                        {formData.customPdfUrl ? (
                          <div className="p-3 border border-neutral-900 bg-neutral-900/40 rounded flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-green-400" />
                              <div>
                                <span className="text-xs text-white block font-sans font-semibold truncate max-w-[200px]">
                                  {formData.customPdfName || 'custom_executive_summary.pdf'}
                                </span>
                                <span className="text-[8px] text-neutral-500 font-mono block">
                                  SECURE BLOB / URL BINDING READY
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  customPdfUrl: '',
                                  customPdfName: '',
                                });
                              }}
                              className="px-2.5 py-1.5 border border-red-950 hover:border-red-500 text-red-500 hover:text-red-400 rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative border-2 border-dashed border-neutral-900 hover:border-neutral-700 bg-neutral-950/20 rounded-lg p-5 text-center transition-all">
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={handlePdfUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="space-y-1.5">
                                <Upload className="w-6 h-6 text-gold-400 mx-auto mb-1" />
                                <span className="block font-sans text-xs font-bold text-neutral-300">
                                  Click or Drag PDF to attach
                                </span>
                                <span className="block text-[8px] text-neutral-600 font-mono uppercase tracking-wider">
                                  Max size: 25MB (Executive PDF only)
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-neutral-500 font-mono text-[8px] uppercase tracking-wider block">Or paste secure external PDF URL</label>
                              <input
                                type="url"
                                value={formData.customPdfUrl || ''}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  const filename = url.substring(url.lastIndexOf('/') + 1) || 'external_document.pdf';
                                  setFormData({
                                    ...formData,
                                    customPdfUrl: url,
                                    customPdfName: url ? filename : '',
                                  });
                                }}
                                placeholder="https://example.com/assets/secure_fact_sheet.pdf"
                                className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-2 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}

                        {pdfUploadProgress !== null && (
                          <div className="p-3 border border-neutral-900 rounded bg-neutral-950/40 space-y-2">
                            <div className="flex justify-between font-mono text-[8px] text-neutral-500 uppercase">
                              <span>ENCRYPTING BRAND INTEL...</span>
                              <span>{pdfUploadProgress}%</span>
                            </div>
                            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                              <div style={{ width: `${pdfUploadProgress}%` }} className="h-full bg-gold-400 transition-all duration-100"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Name / Title */}
                      <div className="space-y-2">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                      {activeTab === 'brands' ? 'Brand Name' : 'Item Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })}
                      placeholder="e.g. Pier St Barth Linen Capsule"
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white tracking-wider"
                    />
                  </div>

                  {/* Category dropdown / input */}
                  {activeTab === 'brands' && (
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Brand Structural Category</label>
                      <select
                        value={formData.category || 'Fashion Collaborations'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as BrandCategory })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white cursor-pointer"
                      >
                        <option>TheMainKeys Ventures</option>
                        <option>Client Projects</option>
                        <option>Brand Collaborations</option>
                        <option>Hospitality Partnerships</option>
                        <option>Fashion Collaborations</option>
                        <option>Technology Projects</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'modeling' && (
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Modeling Category Tag</label>
                      <select
                        value={formData.category || 'Campaigns'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white cursor-pointer"
                      >
                        <option>Campaigns</option>
                        <option>Editorials</option>
                        <option>Commercial</option>
                        <option>Fashion</option>
                        <option>Lifestyle</option>
                        <option>Videos</option>
                      </select>
                    </div>
                  )}

                  {/* Description / bio */}
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Short Summary / Description</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description || formData.biography || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value, biography: e.target.value })}
                      placeholder="Enter details..."
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white leading-relaxed"
                    />
                  </div>

                  {/* Long Narrative / Brand Story */}
                  {activeTab === 'brands' && (
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Brand Story / Narrative Block</label>
                      <textarea
                        rows={4}
                        value={formData.brandStory || ''}
                        onChange={(e) => setFormData({ ...formData, brandStory: e.target.value })}
                        placeholder="Detail the brand story..."
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Featured & Rank Order toggles */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Featured Status</label>
                      <div className="flex items-center gap-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={formData.featured || false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 accent-gold-500 cursor-pointer"
                        />
                        <span className="text-white uppercase font-semibold">FEATURE ON HOMEPAGE GRID</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Order rank priority</label>
                      <input
                        type="number"
                        value={formData.order || 1}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white"
                      />
                    </div>
                  </div>

                  {/* Drag-and-drop simulated asset uploads */}
                  <div className="space-y-2.5">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                      Asset Upload Engine (Images, Videos, PDFs)
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={handleFileUpload}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-gold-400 bg-gold-950/10' 
                          : 'border-neutral-900 hover:border-neutral-700 bg-neutral-950/20'
                      }`}
                    >
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gold-400 mx-auto" />
                        <span className="block font-sans font-bold text-neutral-300">
                          Click to select or drag and drop files
                        </span>
                        <span className="block text-[10px] text-neutral-600 font-mono">
                          Supports bulk uploads of Lookbooks, PDFs catalogs, or campaign videos.
                        </span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    {uploadProgress !== null && (
                      <div className="p-4 border border-neutral-900 rounded bg-neutral-950/40 space-y-2">
                        <div className="flex justify-between font-mono text-[8px] text-neutral-500 uppercase">
                          <span>UPLOADING SECURE CATALOG BINARY...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                          <div style={{ width: `${uploadProgress}%` }} className="h-full bg-gold-400 transition-all duration-100"></div>
                        </div>
                      </div>
                    )}

                    {/* Show loaded files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-neutral-600 uppercase">Uploaded Files:</span>
                        <div className="flex flex-wrap gap-2">
                          {uploadedFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 border border-neutral-900 bg-neutral-950/60 rounded text-[10px]">
                              <FileCheck className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-white font-mono truncate max-w-[120px]">Asset_{i+1}.bin</span>
                              <button
                                type="button"
                                onClick={() => setUploadedFiles(uploadedFiles.filter((_, k) => k !== i))}
                                className="text-red-500 font-bold hover:text-red-400 pl-2 cursor-pointer"
                              >
                                [X]
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Executive PDF Upload (Only for Brands & Ventures) */}
                  {activeTab === 'brands' && (
                    <div className="p-4 border border-neutral-900 bg-neutral-950 rounded space-y-4">
                      <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest block flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gold-400" /> EXECUTIVE SUMMARY PDF ATTACHMENT
                      </span>
                      <p className="text-neutral-500 text-[10px] leading-relaxed font-light">
                        Attach an official PDF (such as a Lookbook, Case Study, or Fact Sheet) to override the dynamically compiled document. Users will download this custom PDF file directly from the venture page.
                      </p>

                      {formData.customPdfUrl ? (
                        <div className="p-3 border border-neutral-900 bg-neutral-900/40 rounded flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-green-400" />
                            <div>
                              <span className="text-xs text-white block font-sans font-semibold truncate max-w-[200px]">
                                {formData.customPdfName || 'custom_executive_summary.pdf'}
                              </span>
                              <span className="text-[8px] text-neutral-500 font-mono block">
                                SECURE BLOB / URL BINDING READY
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={formData.customPdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 border border-neutral-800 hover:border-gold-400 text-neutral-400 hover:text-white rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Test
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  customPdfUrl: '',
                                  customPdfName: '',
                                });
                                if (window.showLuxuryToast) {
                                  window.showLuxuryToast('Custom PDF attachment removed.');
                                }
                              }}
                              className="px-2.5 py-1.5 border border-red-950 hover:border-red-500 text-red-500 hover:text-red-400 rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="relative border-2 border-dashed border-neutral-900 hover:border-neutral-700 bg-neutral-950/20 rounded-lg p-5 text-center transition-all">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handlePdfUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="space-y-1.5">
                              <Upload className="w-6 h-6 text-gold-400 mx-auto mb-1" />
                              <span className="block font-sans text-xs font-bold text-neutral-300">
                                Click or Drag PDF to attach
                              </span>
                              <span className="block text-[8px] text-neutral-600 font-mono uppercase tracking-wider">
                                Max size: 25MB (Executive PDF only)
                              </span>
                            </div>
                          </div>

                          {/* Or let them input a secure URL manually */}
                          <div className="space-y-1.5">
                            <label className="text-neutral-500 font-mono text-[8px] uppercase tracking-wider block">Or paste secure external PDF URL</label>
                            <input
                              type="url"
                              value={formData.customPdfUrl || ''}
                              onChange={(e) => {
                                const url = e.target.value;
                                const filename = url.substring(url.lastIndexOf('/') + 1) || 'external_document.pdf';
                                setFormData({
                                  ...formData,
                                  customPdfUrl: url,
                                  customPdfName: url ? filename : '',
                                });
                              }}
                              placeholder="https://example.com/assets/secure_fact_sheet.pdf"
                              className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* PDF Upload Progress Indicator */}
                      {pdfUploadProgress !== null && (
                        <div className="p-3.5 border border-neutral-900 rounded bg-neutral-950/40 space-y-2">
                          <div className="flex justify-between font-mono text-[8px] text-neutral-500 uppercase">
                            <span>ENCRYPTING BRAND INTEL FOR CONCIERGE REPERTOIRE...</span>
                            <span>{pdfUploadProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                            <div style={{ width: `${pdfUploadProgress}%` }} className="h-full bg-gold-400 transition-all duration-100"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SEO Controls Card */}
                  <div className="p-4 border border-neutral-900 bg-neutral-950 rounded space-y-4">
                    <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> SEO METADATA PARAMETERS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-500 font-mono text-[8px] uppercase">Meta Title</label>
                        <input
                          type="text"
                          value={formData.metaTitle || ''}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          placeholder="Meta title override..."
                          className="w-full bg-neutral-950 border border-neutral-900 focus:outline-none p-2.5 rounded text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-neutral-500 font-mono text-[8px] uppercase">Meta Description</label>
                        <input
                          type="text"
                          value={formData.metaDesc || ''}
                          onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                          placeholder="Meta description override..."
                          className="w-full bg-[#050505] border border-neutral-900 focus:outline-none p-2.5 rounded text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

                {/* Submission CTA */}
                <div className="pt-6 border-t border-neutral-900 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-widest transition-colors cursor-pointer uppercase"
                  >
                    {formType === 'create' ? 'PUBLISH DATABASE ITEM' : 'SAVE CMS OVERRIDES'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors cursor-pointer uppercase"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LUXURY PDF LOOKBOOK PREVIEW MODAL */}
      <AnimatePresence>
        {previewPdfBrand && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-6xl bg-[#080808] border border-neutral-900 rounded-lg overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)] flex flex-col md:flex-row h-[88vh]"
            >
              {/* SIDEBAR CONTROLS & DOC INTEL */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-900 bg-[#050505] p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
                <div className="space-y-6">
                  {/* Branding Header */}
                  <div>
                    <span className="font-mono text-[9px] text-gold-500 uppercase tracking-widest block">THEMAINKEYS REPERTOIRE</span>
                    <h4 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider mt-1">Lookbook Inspector</h4>
                  </div>

                  {/* Document Badge / Metadata Card */}
                  <div className="p-3.5 border border-neutral-900 bg-neutral-950 rounded space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 border border-neutral-800 bg-[#0c0c0c] rounded text-gold-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-white block truncate">
                          {previewPdfBrand.customPdfName || `${previewPdfBrand.name.toLowerCase().replace(/\s+/g, '_')}_lookbook.pdf`}
                        </span>
                        <span className="text-[9px] text-neutral-500 block uppercase font-mono tracking-wider">
                          Size: {previewPdfBrand.id === 'fallback-directory' ? '4.8 MB' : '1.2 MB'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-900 pt-2.5 space-y-1.5 text-[9px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 uppercase">BINDING TARGET:</span>
                        <span className="text-white text-right font-bold truncate max-w-[120px]">{previewPdfBrand.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 uppercase">CATEGORY:</span>
                        <span className="text-white text-right">{previewPdfBrand.category || 'Repertoire Catalog'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 uppercase">SECURITY STATE:</span>
                        <span className="text-green-400 font-bold">VERIFIED_SECURE</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Mode Selector */}
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">RENDER MODE</label>
                    <div className="flex bg-neutral-950 p-1 border border-neutral-900 rounded gap-1">
                      <button
                        type="button"
                        onClick={() => setIsIframeView(false)}
                        className={`flex-1 py-1.5 rounded text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer ${!isIframeView ? 'bg-gold-500 text-black font-bold shadow-[0_2px_8px_rgba(212,175,55,0.3)]' : 'text-neutral-400 hover:text-white'}`}
                      >
                        Interactive Book
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (previewPdfBrand.customPdfUrl) {
                            setIsIframeView(true);
                          } else {
                            if (window.showLuxuryToast) {
                              window.showLuxuryToast('No custom file uploaded. Visualizing Interactive Book simulated view.');
                            }
                          }
                        }}
                        disabled={!previewPdfBrand.customPdfUrl}
                        className={`flex-1 py-1.5 rounded text-[9px] font-mono tracking-wider uppercase transition-all ${previewPdfBrand.customPdfUrl ? 'cursor-pointer text-neutral-400 hover:text-white' : 'opacity-30 cursor-not-allowed text-neutral-600'} ${isIframeView ? 'bg-gold-500 text-black font-bold shadow-[0_2px_8px_rgba(212,175,55,0.3)]' : ''}`}
                      >
                        Original PDF File
                      </button>
                    </div>
                  </div>

                  {/* Book View Specific Navigation Controls */}
                  {!isIframeView && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">PAGE NAVIGATOR</label>
                        <div className="flex items-center justify-between border border-neutral-900 bg-neutral-950 rounded p-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewPdfPage(p => Math.max(1, p - 1))}
                            disabled={previewPdfPage === 1}
                            className="p-1 border border-neutral-900 hover:border-neutral-700 rounded text-neutral-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="font-mono text-[10px] text-white">
                            Page <span className="text-gold-400 font-bold">{previewPdfPage}</span> of 3
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewPdfPage(p => Math.min(3, p + 1))}
                            disabled={previewPdfPage === 3}
                            className="p-1 border border-neutral-900 hover:border-neutral-700 rounded text-neutral-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Zoom controls */}
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">ZOOM SETTING</label>
                        <div className="flex bg-neutral-950 border border-neutral-900 rounded p-1 justify-between text-[9px] font-mono text-neutral-400">
                          <button
                            type="button"
                            onClick={() => setPreviewZoomLevel(1)}
                            className={`px-2 py-1 rounded ${previewZoomLevel === 1 ? 'text-white bg-neutral-900 font-bold border border-neutral-800' : 'hover:text-white'}`}
                          >
                            100%
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewZoomLevel(1.25)}
                            className={`px-2 py-1 rounded ${previewZoomLevel === 1.25 ? 'text-white bg-neutral-900 font-bold border border-neutral-800' : 'hover:text-white'}`}
                          >
                            125%
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewZoomLevel(1.5)}
                            className={`px-2 py-1 rounded ${previewZoomLevel === 1.5 ? 'text-white bg-neutral-900 font-bold border border-neutral-800' : 'hover:text-white'}`}
                          >
                            150%
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PDF Library Table of Contents */}
                  <div className="space-y-2 pt-2">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">TABLE OF CONTENTS</label>
                    <div className="space-y-1 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => { setIsIframeView(false); setPreviewPdfPage(1); }}
                        className={`w-full text-left p-1.5 rounded transition-colors ${!isIframeView && previewPdfPage === 1 ? 'text-gold-400 bg-neutral-900/40 border border-gold-500/10' : 'text-neutral-400 hover:text-white hover:bg-neutral-950/40'}`}
                      >
                        01. Executive Lookbook Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsIframeView(false); setPreviewPdfPage(2); }}
                        className={`w-full text-left p-1.5 rounded transition-colors ${!isIframeView && previewPdfPage === 2 ? 'text-gold-400 bg-neutral-900/40 border border-gold-500/10' : 'text-neutral-400 hover:text-white hover:bg-neutral-950/40'}`}
                      >
                        02. Core Essence & Narrative
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsIframeView(false); setPreviewPdfPage(3); }}
                        className={`w-full text-left p-1.5 rounded transition-colors ${!isIframeView && previewPdfPage === 3 ? 'text-gold-400 bg-neutral-900/40 border border-gold-500/10' : 'text-neutral-400 hover:text-white hover:bg-neutral-950/40'}`}
                      >
                        03. Metrics & Disclosure
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Action block */}
                <div className="pt-6 border-t border-neutral-900 space-y-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (previewPdfBrand.customPdfUrl) {
                        const link = document.createElement('a');
                        link.href = previewPdfBrand.customPdfUrl;
                        link.target = '_blank';
                        link.download = previewPdfBrand.customPdfName || `${previewPdfBrand.name.toLowerCase().replace(/\s+/g, '_')}_executive_summary.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        if (window.showLuxuryToast) {
                          window.showLuxuryToast(`Downloading dynamic executive catalog for ${previewPdfBrand.name}...`);
                        }
                      }
                    }}
                    className="w-full py-2.5 border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black rounded text-[10px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" /> Download PDF Lookbook
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewPdfBrand(null)}
                    className="w-full py-2 bg-neutral-950 border border-neutral-900 hover:border-white text-neutral-400 hover:text-white rounded text-[10px] font-mono tracking-widest uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Close Inspector
                  </button>
                </div>
              </div>

              {/* LIVE DOCUMENT VIEWER WINDOW */}
              <div className="flex-1 bg-[#030303] flex flex-col relative h-full">
                {/* Embedded status banner */}
                <div className="p-3 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
                    <span>THEMAINKEYS ENCRYPTED PREVIEW PROTOCOL // ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>ZOOM: {Math.round(previewZoomLevel * 100)}%</span>
                    <span>MODE: {isIframeView ? 'IFRAME ORIGINAL' : 'INTERACTIVE BOOK'}</span>
                  </div>
                </div>

                {/* Canvas space */}
                <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                  {isIframeView ? (
                    <div className="w-full h-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                      <iframe 
                        src={previewPdfBrand.customPdfUrl} 
                        className="w-full h-full border-0"
                        title="Uploaded PDF Document Preview"
                      />
                    </div>
                  ) : (
                    /* SIMULATED DOCUMENT WRAPPER WITH INTERACTIVE ZOOM SCALE */
                    <motion.div
                      style={{ 
                        scale: previewZoomLevel, 
                        transformOrigin: 'center center' 
                      }}
                      className="transition-transform duration-200"
                    >
                      {/* LUXURY EXECUTIVE DOCUMENT CANVAS */}
                      <div className="w-[480px] h-[640px] bg-[#0c0c0c] border border-gold-500/20 rounded shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-10 flex flex-col justify-between text-white relative overflow-hidden select-none">
                        
                        {/* Background structural styling element (luxury watermark ring) */}
                        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-gold-500/5 pointer-events-none"></div>
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-gold-500/5 pointer-events-none"></div>

                        {/* Document Top Header */}
                        <div className="flex justify-between items-start border-b border-gold-500/10 pb-4 text-[9px] font-mono tracking-widest text-gold-400/80">
                          <span>THEMAINKEYS REPERTOIRE</span>
                          <span>CONFIDENTIAL CATALOG_2026</span>
                        </div>

                        {/* PAGE RENDERING ROUTER */}
                        <div className="flex-1 my-6 flex flex-col justify-center">
                          {/* PAGE 1: COVER SPREAD */}
                          {previewPdfPage === 1 && (
                            <div className="space-y-6 text-center py-6">
                              <div className="mx-auto w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center mb-2 bg-gradient-to-b from-[#18120a] to-[#0a0704]">
                                <Sparkles className="w-5 h-5 text-gold-400" />
                              </div>
                              <span className="font-mono text-[9px] text-gold-400 uppercase tracking-[0.3em] block">
                                EXECUTIVE SUMMARY PORTFOLIO
                              </span>
                              <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-white leading-none mt-2">
                                {previewPdfBrand.name}
                              </h2>
                              <div className="w-16 h-[1px] bg-gold-400 mx-auto my-3"></div>
                              <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm mx-auto font-light">
                                {previewPdfBrand.description || 'Global repertoire index and luxury brand venture highlights for discerning partners.'}
                              </p>
                              
                              <div className="pt-6">
                                <span className="px-3 py-1 font-mono text-[8px] uppercase rounded tracking-widest border border-gold-500/20 bg-gold-950/10 text-gold-400 inline-block">
                                  AUTHORIZED CORPORATE ACCESS
                                </span>
                              </div>
                            </div>
                          )}

                          {/* PAGE 2: CORE ESSENCE & NARRATIVE */}
                          {previewPdfPage === 2 && (
                            <div className="space-y-5 text-left">
                              <span className="font-mono text-[8px] text-gold-400 uppercase tracking-widest block">
                                I. CORE ESSENCE & EXECUTIVE STORY
                              </span>
                              <h3 className="font-serif text-xl font-bold uppercase text-white tracking-wide">
                                The Narrative Legacy
                              </h3>
                              
                              {/* Dropped Capital Narrative */}
                              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed text-justify">
                                <span className="float-left text-3xl font-serif text-gold-400 font-bold leading-none mr-2 mt-1">
                                  {(previewPdfBrand.brandStory || previewPdfBrand.description || "TheMainKeys presents").charAt(0)}
                                </span>
                                {(previewPdfBrand.brandStory || previewPdfBrand.description || "TheMainKeys presents this curated brand outline detailing our strategic placement, luxury positioning, and long-term viability parameters.").slice(1)}
                              </p>

                              {/* Quotes Section */}
                              <div className="p-3 bg-neutral-900/40 border-l border-gold-500/30 font-serif italic text-neutral-400 text-[10px] leading-relaxed my-2">
                                "A synthesis of timeless European couture tradition and modern forward-looking operational execution. Curated exclusively for partners of TheMainKeys."
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-2 text-[9px] font-mono">
                                <div>
                                  <span className="text-gold-400/80 block">COUTURE HERITAGE</span>
                                  <span className="text-neutral-400 text-[8px] block font-sans">Vetted international designers.</span>
                                </div>
                                <div>
                                  <span className="text-gold-400/80 block">MARKET ALIGNMENT</span>
                                  <span className="text-neutral-400 text-[8px] block font-sans">High-worth demographic penetration.</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* PAGE 3: PERFORMANCE METRICS & DISCLOSURE */}
                          {previewPdfPage === 3 && (
                            <div className="space-y-5 text-left">
                              <span className="font-mono text-[8px] text-gold-400 uppercase tracking-widest block">
                                II. PERFORMANCE METRICS & PORTFOLIO SUCCESS
                              </span>
                              
                              <div className="space-y-2">
                                <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                                  {previewPdfBrand.caseStudyTitle || 'Strategic Case Study'}
                                </h4>
                                <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                                  {previewPdfBrand.caseStudyContent || 'Demonstrating sustainable growth and visual identity acceleration through synchronized marketing campaigns.'}
                                </p>
                              </div>

                              {/* Relational Venture Metrics Table */}
                              <div className="p-3 border border-neutral-900 bg-neutral-950/60 rounded space-y-1.5 font-mono text-[8px]">
                                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                                  <span className="text-neutral-500 uppercase">AUDIENCE SATISFACTION INDEX</span>
                                  <span className="text-gold-400 font-bold">96.8% Verified</span>
                                </div>
                                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                                  <span className="text-neutral-500 uppercase">DIGITAL ACCELERATION RATE</span>
                                  <span className="text-gold-400 font-bold">+42.5% Q/Q Growth</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-500 uppercase">PRIMARY HUBS REACH</span>
                                  <span className="text-white">Paris, Milan, London</span>
                                </div>
                              </div>

                              {/* Seal stamp and digital signature */}
                              <div className="pt-3 border-t border-neutral-900/60 flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <span className="text-[7px] text-neutral-500 font-mono block">VERIFIED SIGNATURE</span>
                                  <span className="text-[9px] font-serif text-white tracking-wide block italic">[TheMainKeys Executive Board]</span>
                                </div>
                                <div className="px-2 py-1 border border-gold-500/30 rounded text-[7px] text-gold-400 font-mono tracking-widest uppercase bg-gold-950/10">
                                  APPROVED_ADM
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Document Bottom Footer */}
                        <div className="border-t border-gold-500/10 pt-4 flex justify-between items-center text-[8px] font-mono text-neutral-500">
                          <span>PAGE 0{previewPdfPage} OF 03</span>
                          <span>© 2026 THEMAINKEYS REPERTOIRE CORP</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer status bar */}
                <div className="p-3 border-t border-neutral-900 bg-[#050505] flex justify-between items-center text-[9px] font-mono text-neutral-500">
                  <span>CRYPTO_LOCK: AES_256_GCM</span>
                  <span>ADMIN ACCESS REGISTERED: admin@themainkeys.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BOUTIQUE PRODUCT EDIT / CREATE SLIDE-OVER OVERLAY */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-[#090909] border-l border-neutral-900 h-screen overflow-y-auto p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-6">
                  <div>
                    <h3 className="font-sans font-extrabold text-lg text-white uppercase tracking-wider">
                      {editingProduct ? 'Modify Boutique Masterpiece' : 'Initiate New Boutique Product'}
                    </h3>
                    <span className="font-mono text-[8px] text-gold-400 uppercase tracking-widest block mt-0.5">Boutique Catalogue Registry</span>
                  </div>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1 border border-neutral-800 hover:border-white rounded font-mono text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                  >
                    [CLOSE [X]]
                  </button>
                </div>

                <div className="space-y-4 text-xs text-neutral-300">
                  {/* Basic rows */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">PRODUCT NAME</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white"
                        placeholder="e.g. Signature Gold Clasp"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">BRAND ASSOCIATION</label>
                      <select
                        value={productForm.brandId}
                        onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white cursor-pointer"
                      >
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">CATEGORY</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white cursor-pointer"
                      >
                        <option value="Fashion">Fashion & Apparel</option>
                        <option value="Resorts">Resorts & Swimwear</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Wellness">Wellness & Scents</option>
                        <option value="Digital">Digital & Catalogs</option>
                        <option value="Collaboration">Exclusive Collaborations</option>
                        <option value="Event Merchandise">Event Merchandise</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">PRICE ($ USD)</label>
                      <input
                        type="number"
                        required
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                        placeholder="250"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">SALE PRICE ($ OR EMPTY)</label>
                      <input
                        type="number"
                        value={productForm.salePrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, salePrice: parseFloat(e.target.value) || undefined })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                        placeholder="Discount value"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">INVENTORY STOCK</label>
                      <input
                        type="number"
                        required
                        value={productForm.inventory}
                        onChange={(e) => setProductForm({ ...productForm, inventory: parseInt(e.target.value) || 0 })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                        placeholder="15"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">IMAGE URL (PRIMARY THUMBNAIL)</label>
                      <input
                        type="text"
                        required
                        value={productForm.images[0] || ''}
                        onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">VARIANTS: SIZES (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={productForm.sizes.join(', ')}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                        placeholder="e.g. S, M, L, XL"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">VARIANTS: COLORS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={productForm.colors.join(', ')}
                        onChange={(e) => setProductForm({ ...productForm, colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                        placeholder="e.g. Noir, Or, Argent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">DIGITAL FILE KEY (OPTIONAL DOWNLOAD)</label>
                      <input
                        type="text"
                        value={productForm.digitalDownloadUrl}
                        onChange={(e) => setProductForm({ ...productForm, digitalDownloadUrl: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white font-mono"
                        placeholder="e.g. https://files.themainkeys.com/..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">PDF CATALOG TITLE (OPTIONAL FIELD)</label>
                      <input
                        type="text"
                        value={productForm.pdfCatalogName}
                        onChange={(e) => setProductForm({ ...productForm, pdfCatalogName: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white"
                        placeholder="e.g. CLÉ Paris Spring Lookbook"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">STORYTELLING / EDITORIAL DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white"
                      placeholder="Detail the heritage, material crafting process, and narrative behind this release..."
                    />
                  </div>

                  {/* Status Flags Checkboxes */}
                  <div className="bg-neutral-950 p-4 border border-neutral-900 rounded grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="accent-gold-500 rounded border-neutral-800 bg-neutral-950 text-gold-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-widest">★ Featured Page</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.comingSoon}
                        onChange={(e) => setProductForm({ ...productForm, comingSoon: e.target.checked })}
                        className="accent-gold-500 rounded border-neutral-800 bg-neutral-950 text-gold-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-widest">⏲ Coming Soon</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.limitedDrop}
                        onChange={(e) => setProductForm({ ...productForm, limitedDrop: e.target.checked })}
                        className="accent-gold-500 rounded border-neutral-800 bg-neutral-950 text-gold-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-widest">✦ Limited Drop</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.preOrder}
                        onChange={(e) => setProductForm({ ...productForm, preOrder: e.target.checked })}
                        className="accent-gold-500 rounded border-neutral-800 bg-neutral-950 text-gold-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-widest">⌚ Pre-Order</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer col-span-2">
                      <input
                        type="checkbox"
                        checked={productForm.soldOut || productForm.inventory === 0}
                        onChange={(e) => setProductForm({ ...productForm, soldOut: e.target.checked })}
                        className="accent-gold-500 rounded border-neutral-800 bg-neutral-950 text-gold-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-red-400">✕ Sold Out / Out of Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-900 flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white rounded text-xs font-mono uppercase cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!productForm.name) {
                      alert('Product moniker is required.');
                      return;
                    }

                    const targetBrand = brands.find(b => b.id === productForm.brandId);

                    const productPayload: Product = {
                      id: productForm.id || 'prod_' + Date.now(),
                      name: productForm.name,
                      brandId: productForm.brandId,
                      brandName: targetBrand ? targetBrand.name : 'TheMainKeys',
                      category: productForm.category,
                      price: productForm.price,
                      salePrice: productForm.salePrice,
                      inventory: productForm.inventory,
                      images: productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800'],
                      sizes: productForm.sizes,
                      colors: productForm.colors,
                      description: productForm.description,
                      featured: productForm.featured,
                      comingSoon: productForm.comingSoon,
                      limitedDrop: productForm.limitedDrop,
                      preOrder: productForm.preOrder,
                      soldOut: productForm.soldOut || productForm.inventory === 0,
                      digitalDownloadUrl: productForm.digitalDownloadUrl,
                      pdfCatalogName: productForm.pdfCatalogName,
                    };

                    if (editingProduct) {
                      setProducts(prev => prev.map(item => item.id === editingProduct.id ? productPayload : item));
                      if (window.showLuxuryToast) window.showLuxuryToast(`Successfully updated product: ${productPayload.name}`);
                    } else {
                      setProducts(prev => [...prev, productPayload]);
                      if (window.showLuxuryToast) window.showLuxuryToast(`Successfully initialized product drop: ${productPayload.name}`);
                    }

                    setIsProductModalOpen(false);
                  }}
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs uppercase tracking-widest transition-all rounded cursor-pointer"
                >
                  PUBLISH CATALOGUE DROP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT ORDER DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#060606] border border-neutral-900 rounded-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-900 bg-[#0c0c0c] flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-widest text-gold-400 uppercase">
                  Order Invoice Registry #{selectedOrder.id}
                </span>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-500 hover:text-white font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                >
                  [CLOSE [X]]
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Client specifics */}
                <div className="grid grid-cols-2 gap-6 border-b border-neutral-900 pb-6 text-xs">
                  <div>
                    <h4 className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-2">Customer Credentials</h4>
                    <span className="block font-bold text-white text-sm uppercase">{selectedOrder.customerDetails.firstName} {selectedOrder.customerDetails.lastName}</span>
                    <span className="block text-neutral-400 mt-1">{selectedOrder.customerDetails.email}</span>
                    <span className="block text-neutral-500 font-mono text-[10px] mt-0.5">IP Auth: Verified SECURE</span>
                  </div>

                  <div>
                    <h4 className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-2">Logistics Destination</h4>
                    <span className="block text-neutral-300">{selectedOrder.customerDetails.addressLine1}</span>
                    {selectedOrder.customerDetails.addressLine2 && <span className="block text-neutral-300">{selectedOrder.customerDetails.addressLine2}</span>}
                    <span className="block text-neutral-300 mt-0.5">{selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} {selectedOrder.customerDetails.postalCode}</span>
                    <span className="block text-neutral-400 font-mono uppercase text-[10px] tracking-wider mt-1.5">{selectedOrder.customerDetails.shippingMethod === 'express' ? '✈ EXPRESS OVERNIGHT' : '⛟ GROUND SHIPPING'}</span>
                  </div>
                </div>

                {/* Logistics State & Action Center */}
                <div className="bg-[#0b0b0b] p-4 border border-neutral-900 rounded space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Logistics State & Action Center</span>
                    <span className={`px-2.5 py-1 rounded text-[8px] font-mono uppercase tracking-widest ${
                      selectedOrder.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      selectedOrder.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      selectedOrder.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      selectedOrder.status === 'Pending' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Pending', 'Processing', 'Shipped', 'Completed'] as const).map((st) => (
                      <button
                        key={st}
                        disabled={selectedOrder.status === 'Refunded'}
                        onClick={() => updateOrderStatus(selectedOrder.id, st)}
                        className={`py-1.5 border rounded text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                          selectedOrder.status === st
                            ? 'border-gold-500 bg-gold-950/10 text-gold-400 font-bold'
                            : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {selectedOrder.status !== 'Refunded' ? (
                    <button
                      onClick={() => {
                        if (confirm(`Do you wish to initiate a formal refund for Order #${selectedOrder.id}?`)) {
                          updateOrderStatus(selectedOrder.id, 'Refunded');
                        }
                      }}
                      className="w-full py-2 bg-red-950/20 border border-red-900/60 hover:bg-red-950/50 hover:border-red-500 text-red-400 rounded text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Process Formal Refund & Restore Stock
                    </button>
                  ) : (
                    <div className="text-center py-2 border border-red-950 bg-red-950/10 text-red-400 font-mono text-[9px] uppercase tracking-wider rounded">
                      ✕ Order Refunded & Settled (Closed Ledger)
                    </div>
                  )}
                </div>

                {/* Items grid */}
                <div className="space-y-3">
                  <h4 className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block border-b border-neutral-950 pb-2">Acquired Items Ledger</h4>
                  <div className="space-y-2 text-xs">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-neutral-900/40">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-gold-400">0{idx + 1}</span>
                          <div>
                            <span className="text-white block uppercase font-bold">{it.productName}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">Size: {it.selectedSize || 'N/A'} • Color: {it.selectedColor || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-neutral-400 font-mono block">Qty: {it.quantity}</span>
                          <span className="text-white font-mono font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mathematical break down */}
                <div className="bg-neutral-950/60 p-5 rounded border border-neutral-900 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-500">
                    <span>ITEMS SUB-TOTAL</span>
                    <span>${selectedOrder.subTotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-pink-400">
                      <span>PRIVILEGE DISCOUNT CODE APPLIED</span>
                      <span>-${selectedOrder.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>LOGISTIC FREIGHT FEE</span>
                    <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 pb-2 border-b border-neutral-900">
                    <span>STATE ASSESSED SALES TAX</span>
                    <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-1">
                    <span className="tracking-widest">GRAND TOTAL ACQUIRED</span>
                    <span className="text-gold-400 font-sans font-extrabold">${selectedOrder.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Customer Purchase History section */}
                <div className="bg-[#0b0b0b] p-4 border border-neutral-900 rounded space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Customer Purchase History</span>
                    <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest">
                      {orders.filter(o => (o.customerDetails?.email || o.customerEmail || '').toLowerCase() === (selectedOrder.customerDetails?.email || selectedOrder.customerEmail || '').toLowerCase()).length} {orders.filter(o => (o.customerDetails?.email || o.customerEmail || '').toLowerCase() === (selectedOrder.customerDetails?.email || selectedOrder.customerEmail || '').toLowerCase()).length === 1 ? 'Order' : 'Orders'} Total
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {orders
                      .filter(o => (o.customerDetails?.email || o.customerEmail || '').toLowerCase() === (selectedOrder.customerDetails?.email || selectedOrder.customerEmail || '').toLowerCase())
                      .map((o) => (
                        <div
                          key={o.id}
                          onClick={() => {
                            if (o.id !== selectedOrder.id) {
                              setSelectedOrder(o);
                            }
                          }}
                          className={`p-2.5 rounded border transition-all flex justify-between items-center cursor-pointer ${
                            o.id === selectedOrder.id
                              ? 'bg-neutral-900 border-gold-500/30'
                              : 'bg-neutral-950 border-neutral-900/80 hover:border-neutral-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[10px] text-white">#{o.id}</span>
                              <span className="text-[9px] text-neutral-500 font-mono">
                                {new Date(o.createdAt || o.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-400 truncate max-w-[220px] block mt-0.5">
                              {o.items.map(it => `${it.productName} (x${it.quantity})`).join(', ')}
                            </span>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="font-mono text-[10px] font-bold text-white">${o.grandTotal.toFixed(2)}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-wider ${
                              o.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              o.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              o.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              o.status === 'Pending' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Seal stamp and signature */}
                <div className="pt-6 border-t border-neutral-900/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[7px] text-neutral-500 font-mono block uppercase">STRIPE AUTHENTICATION CODE</span>
                    <span className="text-[9px] font-mono text-neutral-400 block tracking-tight uppercase">ch_stripe_2026_{selectedOrder.id}</span>
                  </div>
                  <div className="px-3 py-1 border border-gold-500/30 rounded text-[8px] text-gold-400 font-mono tracking-widest uppercase bg-gold-950/10">
                    {selectedOrder.status === 'Refunded' ? 'REFUNDED & CLOSED' : 'APPROVED & SETTLED'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

