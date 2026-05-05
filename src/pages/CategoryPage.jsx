import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Marquee, SiteFooter, getCatIcon } from '../components';
import { getCategory, getCategories, getProjects, getHero } from '../services/api';

gsap.registerPlugin(ScrollTrigger);
const MASCOT = '/mascot.png';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [allCats, setAllCats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setFilter('All');
    Promise.all([
      getCategory(id).then(r => setCategory(r.data)),
      getCategories().then(r => setAllCats(r.data)),
      getProjects({ category: id, limit: 100 }).then(r => setProjects(r.data)),
      getHero().then(r => setHero(r.data))
    ]).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading) return;
    gsap.fromTo('.cat-hi', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.fromTo('.cat-mfloat', { opacity: 0, x: 40 }, { opacity: 0.9, x: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
    setTimeout(() => {
      gsap.utils.toArray('.pj-card').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' }
        });
      });
    }, 100);
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [loading, filter]);

  const allTags = useMemo(() => {
    const t = new Set(['All']);
    projects.forEach(p => (p.tags || []).forEach(x => t.add(x)));
    return [...t];
  }, [projects]);

  const shown = filter === 'All' ? projects : projects.filter(p => (p.tags || []).includes(filter));

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--blue-dark)' }} />;
  if (!category) return <div style={{ padding: '5rem', textAlign: 'center' }}>Category not found</div>;

  const catIdx = allCats.findIndex(c => c._id === category._id);

  return (
    <div className="page">
      <section className="cat-hero">
        <Marquee items={[category.name, 'Graphic Design', category.subtitle, 'Mashal Fayyaz']} className="hero-mq" />
        <div className="cat-orb" />
        <div className="cat-mfloat"><img src={MASCOT} alt="mascot" /></div>
        <div className="cat-hi">
          <div className="cat-badge">{getCatIcon(catIdx)} {category.name}</div>
          <h1>{category.name}</h1>
          <p>{category.subtitle} — a curated collection of my best work in this category.</p>
          <div className="cat-stats">
            <div><div className="cs-n">{projects.length}</div><div className="cs-l">Projects</div></div>
            <div><div className="cs-n">{allTags.length - 1}</div><div className="cs-l">Tags</div></div>
            <div><div className="cs-n">2024</div><div className="cs-l">Latest</div></div>
          </div>
        </div>
      </section>

      <div className="cat-content">
        <div className="filter-bar">
          <h2>All Works <span style={{ color: '#ccc', fontWeight: 400 }}>({shown.length})</span></h2>
          <div className="ftabs">
            {allTags.map(t => (
              <button key={t} className={`ftab${filter === t ? ' on' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="proj-grid">
          {shown.map(proj => (
            <div key={proj._id} className="pj-card" onClick={() => navigate(`/project/${proj._id}`)}>
              <div className="pj-img">
                {proj.image?.url
                  ? <img src={proj.image.url} alt={proj.title} />
                  : <div className="pj-img-ph">{getCatIcon(catIdx)}</div>
                }
              </div>
              <div className="pj-info">
                <div className="pj-title">{proj.title}</div>
                <div className="pj-desc">{proj.description}</div>
                <div className="pj-tags">
                  {(proj.tags || []).map(t => <span key={t} className="ptag">{t}</span>)}
                </div>
                <div className="pj-foot">
                  <span className="pj-cta">View Project</span>
                  <span style={{ color: 'var(--blue)', fontWeight: 700 }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="other-cats">
        <div className="oc-inner">
          <h3>Explore Other Categories</h3>
          <div className="oc-list">
            {allCats.filter(c => c._id !== category._id).map((c, idx) => (
              <div key={c._id} className="oc-item" onClick={() => navigate(`/category/${c._id}`)}>
                {c.image?.url
                  ? <img src={c.image.url} className="oc-thumb" alt={c.name} />
                  : <div className="oc-thumb-ph">{getCatIcon(idx)}</div>
                }
                <div>
                  <div className="oc-name">{c.name}</div>
                  <div className="oc-sub">{c.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter hero={hero} />
    </div>
  );
}
