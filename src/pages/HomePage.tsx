/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import VenturesGrid from '../components/VenturesGrid';
import { useAppState } from '../context/AppStateContext';

interface HomePageProps {
  /** Called when the showreel button is clicked — modal lives in AppRoutes */
  onShowreelOpen: () => void;
}

export default function HomePage({ onShowreelOpen }: HomePageProps) {
  const { brands } = useAppState();
  const navigate = useNavigate();

  return (
    <motion.div
      key="home-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cinematic hero section */}
      <Hero
        onExploreClick={() => navigate('/brands')}
        onWatchShowreelClick={onShowreelOpen}
      />

      {/* Animated Ventures Grid */}
      <VenturesGrid
        brands={brands}
        onBrandClick={(id: string) => navigate(`/brands/${id}`)}
      />
    </motion.div>
  );
}
