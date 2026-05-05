import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoriesAdmin, getProjectsAdmin } from '../services/api';
import { getCatIcon } from '../components';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCategoriesAdmin().then(r => setCategories(r.data)),
      getProjectsAdmin().then(r => setProjects(r.data))
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: '#aaa' }}>Loading…</div>;

  const withImages = projects.filter(p => p.image?.url).length;

  return (
    <div>
      {/* STAT CARDS */}
      <div className="stats-row">
        {[
          { n: categories.length, l: 'Categories' },
          { n: projects.length,   l: 'Projects'   },
          { n: withImages,        l: 'With Images' },
          { n: '✓',              l: 'Live Site'   }
        ].map(s => (
          <div key={s.l} className="stat-c">
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* CATEGORY PREVIEW GRID */}
      <div className="a-sec">
        <div className="a-sec-h">
          <h2>Category Cards Preview</h2>
          <button className="btn-sm" onClick={() => navigate('/admin/categories')}>
            Manage Categories
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
          {categories.map((c, idx) => {
            const count = projects.filter(p =>
              (p.category?._id || p.category) === c._id
            ).length;
            return (
              <div
                key={c._id}
                style={{ background: '#F8F9FF', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate('/admin/categories')}
              >
                {c.image?.url
                  ? <img src={c.image.url} alt={c.name} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  : (
                    <div style={{ width: '100%', height: 110, background: 'linear-gradient(135deg,#EEF2FF,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      {getCatIcon(idx)}
                    </div>
                  )
                }
                <div style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: 'var(--dark)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#bbb', marginTop: '0.15rem' }}>{c.subtitle}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--blue)', fontWeight: 700, marginTop: '0.3rem' }}>{count} projects</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT PROJECTS TABLE */}
      <div className="a-sec">
        <div className="a-sec-h">
          <h2>Recent Projects</h2>
          <button className="btn-sm" onClick={() => navigate('/admin/projects')}>
            View All
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th><th>Title</th><th>Category</th><th>Tags</th><th>Year</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 8).map(p => (
              <tr key={p._id}>
                <td>
                  {p.image?.url
                    ? <img src={p.image.url} className="t-thumb" alt={p.title} />
                    : <div className="t-thumb-ph">🎨</div>
                  }
                </td>
                <td><strong>{p.title}</strong></td>
                <td>{p.category?.name || '—'}</td>
                <td>{(p.tags || []).map(t => <span key={t} className="t-chip">{t}</span>)}</td>
                <td>{p.year || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
