/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';


interface PageTransitionProps {
  children: React.ReactNode;
  /** Optional variant — 'slide' (default) or 'fade' */
  variant?: 'slide' | 'fade';
}

/** Wraps a route's content with consistent enter/exit animations. */
export default function PageTransition({ children, variant = 'slide' }: PageTransitionProps) {
  if (variant === 'fade') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
