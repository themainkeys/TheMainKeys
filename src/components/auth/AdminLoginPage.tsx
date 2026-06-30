/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sliders, Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Admin Login Page — Phase 1 Stub
 *
 * This is a UI-only stub using sessionStorage for temporary auth state.
 * In Phase 2 this will be replaced by Supabase Auth with TOTP 2FA.
 *
 * TODO (Phase 2): Replace with supabase.auth.signInWithPassword()
 */

/**
 * Admin Login Page — Phase 1 UI Stub
 *
 * This component renders the admin login interface only.
 * Authentication is NOT implemented in this phase.
 *
 * TODO (Phase 2): Wire up Supabase Auth:
 *   - supabase.auth.signInWithPassword({ email, password })
 *   - Verify role from profiles table
 *   - Set up TOTP 2FA with supabase.auth.mfa
 *   - Implement session refresh + inactivity timeout
 */

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a brief loading state for UX
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setSubmitted(true);
    // TODO (Phase 2): Replace with Supabase Auth sign-in
  };

  return (
    <div
      id="admin-login-page"
      className="min-h-screen bg-[#030303] flex items-center justify-center px-4"
    >
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#030303] to-[#0a0805] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md"
      >
        {/* Logo mark */}
        <div className="text-center mb-10 space-y-4">
          <div className="relative w-12 h-12 flex items-center justify-center border border-gold-400/50 rounded mx-auto">
            <span className="font-serif font-bold text-gold-400 text-xl tracking-wider">TT</span>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-gold-400 rotate-45" />
          </div>
          <div>
            <span className="font-sans font-bold text-sm tracking-[0.3em] text-white uppercase block">
              THEMAINKEYS
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-gold-400 uppercase">
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#050505] border border-neutral-900 rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="mb-6 space-y-1">
            <h1 className="font-sans font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gold-400" />
              Secure Access
            </h1>
            <p className="text-neutral-500 text-xs font-light">
              Enter your administrator credentials to access the CMS dashboard.
            </p>
          </div>

          {/* Phase 2 pending notice */}
          <div className="mb-5 p-3 border border-neutral-800 bg-neutral-950 rounded flex items-start gap-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
            <p className="text-[9px] font-mono text-neutral-500 leading-relaxed">
              Authentication is not yet connected. Supabase Auth + 2FA will be enabled in Phase 2.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@themainkeys.com"
                className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 text-white rounded outline-none transition-colors placeholder:text-neutral-700"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-950 border border-neutral-900 focus:border-gold-500 text-xs p-3 pr-10 text-white rounded outline-none transition-colors placeholder:text-neutral-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Not-yet-connected notice (replaces error field) */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border border-neutral-800 bg-neutral-950 rounded flex items-start gap-2.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-mono text-neutral-400 leading-relaxed">
                  Authentication backend is not yet connected. Supabase Auth will be integrated in Phase 2.
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#f27d26] to-[#b3913b] hover:opacity-90 text-black font-mono text-[10px] tracking-widest uppercase font-bold rounded transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-neutral-900/60 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-neutral-600 hover:text-neutral-300 text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
            >
              ← Return to Public Site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
