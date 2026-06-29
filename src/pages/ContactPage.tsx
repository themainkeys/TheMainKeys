/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brand: '',
    message: '',
    category: 'Venture Incubation',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', brand: '', message: '', category: 'Venture Incubation' });
    }, 5000);
  };

  return (
    <div id="contact-page-root" className="pt-28 pb-24 bg-black min-h-screen relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="border-b border-neutral-900 pb-12 mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold-400 uppercase block">
            Initiate Collaboration
          </span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            CONNECT WITH <span className="font-serif italic font-light text-gold-200">US</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Whether you want to discuss venture building support, digital software development, custom luxury branding lookbooks, or strategic hospitality integrations — our board is ready to coordinate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Details block */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase">
                HQ Studios
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed font-light">
                Our main offices reside in key design and business capitals. Private viewings of seasonal catalogs and physical jewelry капсулы are hosted exclusively in Gustavia, St Barth and Miami Design District.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-neutral-900">
              <div className="flex items-start gap-3 text-xs">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase font-sans tracking-wider">Miami & Paris</span>
                  <span className="text-neutral-500">Design District Headquarters</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase font-sans tracking-wider">Secure Email</span>
                  <a href="mailto:contact@themainkeys.com" className="text-neutral-400 hover:text-white transition-colors">
                    contact@themainkeys.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase font-sans tracking-wider">Concierge Line</span>
                  <span className="text-neutral-500">+1 (305) 998-KEYS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form block */}
          <div className="lg:col-span-8">
            <div className="p-8 border border-neutral-900 bg-neutral-950/40 rounded-lg">
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-4"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <h3 className="font-sans font-bold text-lg text-white uppercase tracking-wider">
                      Transmission Successful
                    </h3>
                    <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
                      Your inquiry has been encrypted and securely delivered to the executive board of <strong>TheMainKeys Ventures</strong>. An operations representative will connect within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sterling Arch"
                          className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white tracking-wider"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. partner@luxury.com"
                          className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white tracking-wider"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                          Corporate Brand (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          placeholder="e.g. Elite Couture"
                          className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white tracking-wider"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                          Inquiry Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white tracking-wider cursor-pointer"
                        >
                          <option>Venture Incubation</option>
                          <option>Digital & Software Development</option>
                          <option>Creative Direction & Video Campaigns</option>
                          <option>Hospitality Partnership Access</option>
                          <option>Modeling Booking Request</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                        Collaboration Proposal Brief
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Detail your strategic objectives or platform requirements..."
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-400 focus:outline-none rounded p-3 text-white tracking-wider leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold tracking-[0.25em] transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase"
                    >
                      TRANSMIT PROPOSAL
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
