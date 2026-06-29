/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectItem, Brand } from '../types';
import { Filter, Eye, ArrowRight, Sparkles, FolderOpen } from 'lucide-react';

interface ProjectsPageProps {
  projects: ProjectItem[];
  brands: Brand[];
  onBrandClick: (id: string) => void;
}

export default function ProjectsPage({ projects, brands, onBrandClick }: ProjectsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Categories list requested: Technology, Websites, Software, Branding, Fashion, Hospitality, Wellness, Media, Photography, Creative Direction, Luxury Brands, Case Studies
  const categories = [
    'All',
    'Technology',
    'Websites',
    'Software',
    'Branding',
    'Fashion',
    'Hospitality',
    'Wellness',
    'Media',
    'Photography',
    'Creative Direction',
    'Luxury Brands',
    'Case Studies',
  ];

  // Filter projects
  const filteredProjects = projects.filter((proj) => {
    if (activeCategory === 'All') return true;
    return proj.category === activeCategory;
  });

  return (
    <div id="projects-page-root" className="pt-28 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            Studio Work & Integrations
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            STUDIO <span className="font-serif italic font-light text-gold-200">PORTFOLIO</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            A comprehensive record of technological pipelines, high-fashion campaigns, and physical hospitality rollouts crafted, coded, and produced by TheMainKeys.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mb-12 border-b border-neutral-900 pb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="font-mono text-[10px] text-neutral-500 mr-4 flex items-center gap-1.5 uppercase">
            <Filter className="w-3.5 h-3.5" /> Filter Portfolio:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`project-cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded text-[10px] tracking-wider transition-all cursor-pointer uppercase ${
                activeCategory === cat
                  ? 'bg-gold-500 text-black font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const matchedBrand = brands.find(b => b.id === project.brandId);
              return (
                <motion.div
                  key={project.id}
                  id={`project-item-card-${project.id}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative h-[380px] border border-neutral-900 bg-neutral-950 overflow-hidden rounded-lg cursor-pointer flex flex-col justify-between"
                >
                  {/* Photo background */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-55 group-hover:opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  </div>

                  {/* Top info overlay */}
                  <div className="p-6 relative z-10 flex justify-between items-start">
                    <span className="font-mono text-[8px] tracking-wider text-gold-400 bg-gold-950/50 border border-gold-500/10 px-2.5 py-1 rounded uppercase">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-1 text-[8px] text-yellow-400 font-mono tracking-widest uppercase">
                        <Sparkles className="w-3 h-3" /> SIGNATURE
                      </span>
                    )}
                  </div>

                  {/* Bottom info overlay */}
                  <div className="p-6 relative z-10 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="space-y-1">
                      {matchedBrand && (
                        <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                          Brand: {matchedBrand.name}
                        </span>
                      )}
                      <h3 className="font-sans font-bold text-base text-white group-hover:text-gold-300 transition-colors uppercase leading-tight">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-neutral-400 text-xs font-light line-clamp-2">
                      {project.description}
                    </p>
                    <div className="pt-2 border-t border-neutral-900/60 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                      <span>COMPLETED: {project.date}</span>
                      <span className="text-gold-400 flex items-center gap-1 group-hover:underline">
                        <Eye className="w-3.5 h-3.5" /> INSPECT CASE
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="py-24 text-center space-y-4 border border-neutral-900 rounded-lg bg-neutral-950/20">
            <FolderOpen className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 text-xs tracking-wider uppercase font-mono">No projects found in this category</p>
            <p className="text-neutral-600 text-[11px] max-w-sm mx-auto">Go to the Admin Dashboard to dynamically create new client projects and link them to case studies!</p>
          </div>
        )}

      </div>

      {/* Case Study Lightbox Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden my-8">
              <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-950">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-gold-400 tracking-wider uppercase">
                    STUDIO CASE HIGHLIGHT | {selectedProject.category}
                  </span>
                  <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-neutral-500 hover:text-white font-mono text-xs cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>

              {/* Banner image inside modal */}
              <div className="h-64 relative bg-neutral-900 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Case content */}
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-sans font-bold text-sm tracking-wider text-neutral-400 uppercase">
                    Challenge & Strategic Deployment
                  </h4>
                  <p className="text-neutral-300 text-xs leading-relaxed font-light">
                    {selectedProject.content || 'Representing custom developer integration and branding, this project involved detailed conceptualization and production workflows. Under the general creative direction of TheMainKeys Ventures, our team designed full-fidelity client assets, developed high-performance tech stacks, and compiled digital collections.'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-900 text-[10px] font-mono text-neutral-500">
                  <div>
                    <span className="block text-neutral-600 uppercase">Studio Lead</span>
                    <span className="text-white">TheMainKeys Ventures</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600 uppercase">Deployment</span>
                    <span className="text-white">{selectedProject.date}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600 uppercase">Case Status</span>
                    <span className="text-green-400 uppercase">PUBLISHED</span>
                  </div>
                </div>

                {/* Link brand button */}
                {selectedProject.brandId && (
                  <div className="pt-6 border-t border-neutral-900 flex justify-end">
                    <button
                      id={`project-brand-link-${selectedProject.id}`}
                      onClick={() => {
                        onBrandClick(selectedProject.brandId!);
                        setSelectedProject(null);
                      }}
                      className="flex items-center gap-2 text-gold-300 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase cursor-pointer"
                    >
                      VIEW DETAILED BRAND CASE STUDY
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
