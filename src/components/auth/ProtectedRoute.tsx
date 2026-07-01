/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute — Phase 1 UI-Only Stub
 *
 * Authentication is NOT yet implemented. The admin dashboard is accessible
 * without credentials in Phase 1 so it can be previewed and tested.
 *
 * TODO (Phase 2): Replace this entire component with a real auth check:
 *   const { data: { session } } = await supabase.auth.getSession();
 *   if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />;
 *   const { data: profile } = await supabase.from('profiles').select('role').single();
 *   if (!['super_admin', 'admin'].includes(profile.role)) return <Navigate to="/" replace />;
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Phase 2: remove this line and implement the Supabase session check above.
  const _location = useLocation(); // reserved for post-login redirect in Phase 2

  // Phase 1: pass-through — authentication enforced in Phase 2
  return <>{children}</>;
}
