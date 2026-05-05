import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

import { Loader, SiteNav } from './components';
import HomePage     from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProjectPage  from './pages/ProjectPage';
import AdminLogin   from './admin/AdminLogin';
import AdminLayout  from './admin/AdminLayout';
import AdminDashboard  from './admin/AdminDashboard';
import AdminHero       from './admin/AdminHero';
import AdminCategories from './admin/AdminCategories';
import AdminProjects   from './admin/AdminProjects';
import useAuthStore from './store/authStore';

/* Protected route wrapper */
function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/admin" replace />;
}

/* Nav back label resolver */
function NavWrapper() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const isCat  = location.pathname.startsWith('/category/');
  const isProj = location.pathname.startsWith('/project/');

  let backLabel = null;
  let backTo    = '/';
  if (isProj) { backLabel = 'Back'; backTo = -1; }
  if (isCat)  { backLabel = 'All Works'; backTo = '/'; }

  return <SiteNav backLabel={backLabel} backTo={backTo} />;
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  /* keyboard shortcut Ctrl+Shift+A → /admin */
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Loader only on first visit */}
      {!loaded && <Loader onDone={() => setTimeout(() => setLoaded(true), 120)} />}

      <NavWrapper />

      <Routes>
        {/* ── PUBLIC PORTFOLIO ── */}
        <Route path="/"             element={<HomePage />}     />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/project/:id"  element={<ProjectPage />}  />

        {/* ── ADMIN (hidden route) ── */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard"  element={<AdminDashboard  />} />
          <Route path="hero"       element={<AdminHero       />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="projects"   element={<AdminProjects   />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
