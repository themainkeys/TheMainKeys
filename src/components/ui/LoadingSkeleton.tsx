/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Luxury dark-themed skeleton shown during Suspense / lazy-load fallback. */
export default function LoadingSkeleton() {
  return (
    <div
      id="loading-skeleton-root"
      className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6"
      aria-label="Loading content"
      role="status"
    >
      {/* Animated logo mark */}
      <div className="relative w-10 h-10 flex items-center justify-center border border-gold-400/50 rounded animate-pulse">
        <span className="font-serif font-bold text-gold-400 text-xl">TT</span>
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-gold-400/50 rotate-45" />
      </div>

      {/* Pulsing bar skeleton */}
      <div className="space-y-3 w-full max-w-xs px-4">
        <div className="h-1.5 bg-neutral-900 rounded animate-pulse" />
        <div className="h-1.5 bg-neutral-900 rounded animate-pulse w-3/4 mx-auto" />
        <div className="h-1.5 bg-neutral-900 rounded animate-pulse w-1/2 mx-auto" />
      </div>

      <span className="font-mono text-[9px] tracking-[0.35em] text-neutral-600 uppercase animate-pulse">
        Loading
      </span>
    </div>
  );
}
