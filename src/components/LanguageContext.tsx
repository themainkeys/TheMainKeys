/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & General
    'nav.home': 'HOME',
    'nav.brands': 'BRANDS & VENTURES',
    'nav.fashion': 'FASHION HOUSE',
    'nav.modeling': 'MODELING PORTFOLIO',
    'nav.founders': 'FOUNDERS & LEADERS',
    'nav.projects': 'PORTFOLIO PROJECTS',
    'nav.media': 'MEDIA LIBRARY',
    'nav.boutique': 'BOUTIQUE',
    'nav.journal': 'JOURNAL',
    'nav.contact': 'CONNECT WITH US',
    'nav.admin': 'ADMIN CMS',

    // Hero Section
    'hero.pretitle': 'THEMAINKEYS ENTERPRISES',
    'hero.title': 'ORCHESTRATING THE FUTURE OF LUXURY & TECHNOLOGY',
    'hero.subtitle': 'A high-fidelity venture builder and luxury studio operating at the intersection of haute couture, computational intelligence, and elite lifestyle consulting.',
    'hero.discover': 'EXPLORE VENTURES',
    'hero.showreel': 'VIEW SHOWREEL',
    'hero.stats.studios': 'HQ STUDIOS',
    'hero.stats.ventures': 'ACTIVE VENTURES',
    'hero.stats.capital': 'MANAGED PORTFOLIO',

    // Footer
    'footer.desc': 'TheMainKeys is a premium venture builder, technology development incubator, and creative studio crafting elite digital experiences and luxury consumer brands.',
    'footer.explorations': 'Explorations',
    'footer.foundations': 'Foundations',
    'footer.studios': 'HQ Studios',
    'footer.rights': '2026 TheMainKeys Ventures & Studio LLC. All rights reserved.',
    'footer.privacy': 'PRIVACY POLICY',
    'footer.terms': 'TERMS OF SERVICE',
    'footer.concierge': 'CONCIERGE PORTAL',
    'footer.hq_desc': 'Miami Design District & Paris, France',

    // Ventures / Brands Section
    'brands.title': 'CURATED LUXURY & VENTURE DIRECTORY',
    'brands.subtitle': 'Our current ecosystem of active holdings, design capsules, and joint partnerships.',
    'brands.status.active': 'ACTIVE',
    'brands.status.coming_soon': 'COMING SOON',
    'brands.view_brand': 'VIEW BRAND SYSTEM',
    'brands.filter.all': 'ALL PORTFOLIO',
    'brands.filter.ventures': 'VENTURES',
    'brands.filter.fashion': 'FASHION',
    'brands.filter.tech': 'TECHNOLOGY',

    // Brand Detail Page
    'brand.back': 'BACK TO DIRECTORY',
    'brand.founders': 'FOUNDED BY',
    'brand.status': 'PORTFOLIO STATUS',
    'brand.overview': 'CASE OVERVIEW & STRATEGY',
    'brand.press': 'ACCOMPANYING RELEASES',
    'brand.catalogs': 'LOOKBOOKS & SPECIFICATIONS',
    'brand.campaigns': 'FEATURED MEDIA',
    'brand.lookbooks': 'LOOKBOOKS & COLLECTIONS',
    'brand.download': 'DOWNLOAD PDF',
    'brand.overview_brochure': 'Brand Overview Brochure',
    'brand.campaign_sec': 'Cinematic Campaigns',
    'brand.campaign_desc': 'Interactive lookbook & loops captured on location by the creative production studio of TheMainKeys.',
    'brand.additional_assets': 'Additional Curated Assets',
    'brand.archived': 'ARCHIVED SHOTS',
    'brand.source': 'GET SOURCE FILE',
    'brand.view_image': 'VIEW IMAGE',
    'brand.download_summary': 'DOWNLOAD EXECUTIVE SUMMARY (PDF)',

    // Modeling Page
    'model.title': 'MODELING PORTFOLIO',
    'model.subtitle': 'Curated high-fashion editorials and commercial campaigns representing elite aesthetic standards.',
    'model.all': 'ALL LOOKS',
    'model.inquire': 'INQUIRE ABOUT THIS LOOK',
    'model.moodboard': 'ADD TO MOODBOARD',

    // Founders Page
    'founders.title': 'FOUNDERS & LEADERS',
    'founders.subtitle': 'The visionaries, technologists, and designers driving our premium brand ecosystem.',
    'founders.bio': 'BIOGRAPHY',
    'founders.career': 'CAREER TIMELINE',
    'founders.brands': 'PORTFOLIO ROLES',

    // Projects Page
    'projects.title': 'PORTFOLIO PROJECTS',
    'projects.subtitle': 'High-fidelity systems, creative works, and software deployments delivered by our incubation labs.',
    'projects.read': 'READ CASE STUDY',

    // Media Page
    'media.title': 'MEDIA LIBRARY',
    'media.subtitle': 'Public archives, press assets, and visual documentation pertaining to the TheMainKeys network.',
    'media.search': 'SEARCH ARCHIVE...',
    'media.download': 'DOWNLOAD',

    // Contact Page
    'contact.title': 'CONNECT WITH US',
    'contact.subtitle': 'Initiate a secure inquiry regarding co-founding, venture backing, or creative consultation.',
    'contact.office': 'GLOBAL OFFICES',
    'contact.concierge': 'CONCIERGE DESK',
    'contact.enquiry': 'SECURE ACQUISITIONS ENQUIRY',
    'contact.form.name': 'YOUR FULL NAME',
    'contact.form.email': 'SECURE EMAIL ADDRESS',
    'contact.form.subject': 'INQUIRY DIRECTIVE',
    'contact.form.message': 'PROPOSAL DETAILS',
    'contact.form.submit': 'TRANSMIT PROPOSAL',

    // Toast & Notifier alerts
    'toast.welcome_fr': 'Welcome to our French translation pipeline. Bienvenue au service de conciergerie.',
    'toast.welcome_en': 'Welcome to our English translation pipeline. Service Concierge initialized.',
  } as Record<string, string>,
  fr: {
    // Nav & General
    'nav.home': 'ACCUEIL',
    'nav.brands': 'MARQUES & ENTREPRISES',
    'nav.fashion': 'MAISON DE MODE',
    'nav.modeling': 'PORTFOLIO MANNEQUINAT',
    'nav.founders': 'FONDATEURS & DIRIGEANTS',
    'nav.projects': 'PROJETS DE PORTFOLIO',
    'nav.media': 'MÉDIATHÈQUE',
    'nav.boutique': 'BOUTIQUE',
    'nav.journal': 'JOURNAL',
    'nav.contact': 'CONTACTEZ-NOUS',
    'nav.admin': 'ADMIN CMS',

    // Hero Section
    'hero.pretitle': 'LES ENTREPRISES THEMAINKEYS',
    'hero.title': 'ORCHESTRER L’AVENIR DU LUXE ET DE LA TECHNOLOGIE',
    'hero.subtitle': 'Un incubateur d’entreprises haut de gamme et un studio de luxe opérant à l’intersection de la haute couture, de l’intelligence computationnelle et du conseil en mode de vie d’élite.',
    'hero.discover': 'DÉCOUVRIR NOS PROJETS',
    'hero.showreel': 'VOIR LE SHOWREEL',
    'hero.stats.studios': 'STUDIOS QG',
    'hero.stats.ventures': 'PROJETS ACTIFS',
    'hero.stats.capital': 'PORTFEUILLE GÉRÉ',

    // Footer
    'footer.desc': 'TheMainKeys est un créateur d’entreprises de premier plan, un incubateur de développement technologique et un studio de création façonnant des expériences numériques d’élite et des marques de consommation de luxe.',
    'footer.explorations': 'Explorations',
    'footer.foundations': 'Fondations',
    'footer.studios': 'Studios QG',
    'footer.rights': '2026 TheMainKeys Ventures & Studio LLC. Tous droits réservés.',
    'footer.privacy': 'POLITIQUE DE CONFIDENTIALITÉ',
    'footer.terms': 'CONDITIONS D’UTILISATION',
    'footer.concierge': 'PORTAIL CONCIERGERIE',
    'footer.hq_desc': 'Miami Design District & Paris, France',

    // Ventures / Brands Section
    'brands.title': 'RÉPERTOIRE DU LUXE & DES ENTREPRISES',
    'brands.subtitle': 'Notre écosystème actuel de participations actives, capsules de design et partenariats conjoints.',
    'brands.status.active': 'ACTIF',
    'brands.status.coming_soon': 'BIENTÔT DISPONIBLE',
    'brands.view_brand': 'VOIR LE SYSTÈME DE MARQUE',
    'brands.filter.all': 'TOUT LE PORTFEUILLE',
    'brands.filter.ventures': 'ENTREPRISES',
    'brands.filter.fashion': 'MODE',
    'brands.filter.tech': 'TECHNOLOGIE',

    // Brand Detail Page
    'brand.back': 'RETOUR AU RÉPERTOIRE',
    'brand.founders': 'FONDÉ PAR',
    'brand.status': 'STATUT DU PORTFEUILLE',
    'brand.overview': 'PRÉSENTATION DU CAS & STRATÉGIE',
    'brand.press': 'COMMUNIQUÉS ACCOMPAGNANTS',
    'brand.catalogs': 'LOOKBOOKS & SPÉCIFICATIONS',
    'brand.campaigns': 'MÉDIAS VEDETTES',
    'brand.lookbooks': 'LOOKBOOKS & COLLECTIONS',
    'brand.download': 'TÉLÉCHARGER LE PDF',
    'brand.overview_brochure': 'Brochure de Présentation de la Marque',
    'brand.campaign_sec': 'Campagnes Cinématographiques',
    'brand.campaign_desc': 'Lookbook interactif et boucles capturés sur place par le studio de production créative de TheMainKeys.',
    'brand.additional_assets': 'Ressources Sélectionnées Additionnelles',
    'brand.archived': 'PHOTOS ARCHIVÉES',
    'brand.source': 'OBTENIR LE FICHIER SOURCE',
    'brand.view_image': 'VOIR L’IMAGE',
    'brand.download_summary': 'TÉLÉCHARGER LE COMPTE RENDU (PDF)',

    // Modeling Page
    'model.title': 'PORTFOLIO DE MANNEQUINAT',
    'model.subtitle': 'Éditoriaux de haute couture et campagnes commerciales sélectionnés représentant des normes esthétiques d’élite.',
    'model.all': 'TOUS LES LOOKS',
    'model.inquire': 'S’INFORMER SUR CE LOOK',
    'model.moodboard': 'AJOUTER AU MOODBOARD',

    // Founders Page
    'founders.title': 'FONDATEURS & DIRIGEANTS',
    'founders.subtitle': 'Les visionnaires, technologues et designers qui animent notre écosystème de marques haut de gamme.',
    'founders.bio': 'BIOGRAPHIE',
    'founders.career': 'PARCOURS PROFESSIONNEL',
    'founders.brands': 'RÔLES AU SEIN DU PORTFEUILLE',

    // Projects Page
    'projects.title': 'PROJETS DE PORTFEUILLE',
    'projects.subtitle': 'Systèmes de haute fidélité, œuvres créatives et déploiements logiciels réalisés par nos laboratoires d’incubation.',
    'projects.read': 'LIRE L’ÉTUDE DE CAS',

    // Media Page
    'media.title': 'MÉDIATHÈQUE',
    'media.subtitle': 'Archives publiques, ressources de presse et documentation visuelle relatives au réseau TheMainKeys.',
    'media.search': 'RECHERCHER DANS LES ARCHIVES...',
    'media.download': 'TÉLÉCHARGER',

    // Contact Page
    'contact.title': 'CONTACTEZ-NOUS',
    'contact.subtitle': 'Initiez une demande sécurisée concernant la co-fondation, le soutien de capital-risque ou la consultation créative.',
    'contact.office': 'BUREAUX GLOBAUX',
    'contact.concierge': 'BUREAU DE CONCIERGERIE',
    'contact.enquiry': 'DEMANDE SÉCURISÉE D’ACQUISITIONS',
    'contact.form.name': 'VOTRE NOM COMPLET',
    'contact.form.email': 'ADRESSE E-MAIL SÉCURISÉE',
    'contact.form.subject': 'DIRECTIVE DE LA DEMANDE',
    'contact.form.message': 'DÉTAILS DE LA PROPOSITION',
    'contact.form.submit': 'TRANSMETTRE LA PROPOSITION',

    // Toast & Notifier alerts
    'toast.welcome_fr': 'Bienvenue sur notre réseau de traduction française. Service de conciergerie initialisé.',
    'toast.welcome_en': 'Welcome to our English translation pipeline. Service Concierge initialized.',
  } as Record<string, string>
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('themainkeys_lang');
    return (saved === 'fr' ? 'fr' : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('themainkeys_lang', lang);
    
    // Broadcast language change via global toast if initialized
    if (window.showLuxuryToast) {
      const welcomeKey = lang === 'fr' ? 'toast.welcome_fr' : 'toast.welcome_en';
      const welcomeMsg = translations[lang][welcomeKey];
      window.showLuxuryToast(welcomeMsg);
    }
  };

  const t = (key: string): string => {
    const section = translations[language];
    if (section && section[key]) {
      return section[key];
    }
    // Fallback to English
    const fallbackSection = translations['en'];
    if (fallbackSection && fallbackSection[key]) {
      return fallbackSection[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
