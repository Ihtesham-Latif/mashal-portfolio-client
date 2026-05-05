import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const NAV_ITEMS = [
  { path: '/admin/dashboard',  icon: '📊', label: 'Dashboard'   },
  { path: '/admin/hero',       icon: '🖼',  label: 'Hero & About' },
  { path: '/admin/categories', icon: '📁', label: 'Categories'  },
  { path: '/admin/projects',   icon: '🗂',  label: 'Projects'    },
];

export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(true); // default open

  useEffect(() => {
    if (!user) navigate('/admin');
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const pageTitle = NAV_ITEMS.find(n => location.pathname === n.path)?.label || 'Admin';

  return (
    <div id="admin-app">
      <div className="a-layout">
        {/* ── SIDEBAR ── */}
        <div className="a-sb">
          <div className="a-brand">
            <h3>MASHAL</h3>
            <p>Portfolio Admin</p>
            
            {/* Toggle button */}
            <button 
              className="a-nav-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
          
          <nav className={`a-nav${menuOpen ? ' open' : ''}`}>
            {NAV_ITEMS.map(n => (
              <NavLink
                key={n.path}
                to={n.path}
                className={({ isActive }) => `a-ni${isActive ? ' on' : ''}`}
              >
                <span className="a-ni-ico">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}

            <div className="a-sep" />

            <button className="a-ni" onClick={handleLogout}>
              <span className="a-ni-ico">🚪</span> Logout
            </button>
            <button className="a-ni" onClick={() => navigate('/')}>
              <span className="a-ni-ico">🌐</span> View Site
            </button>
          </nav>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="a-main">
          <div className="a-top">
            <h1>{pageTitle}</h1>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#999' }}>
                👤 {user?.name}
              </span>
              <button className="btn-out" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div className="a-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}