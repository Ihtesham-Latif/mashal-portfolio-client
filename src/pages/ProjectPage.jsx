import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Marquee, SiteFooter, getCatIcon } from '../components';
import { getProject, getProjects, getHero } from '../services/api';

const MASCOT = '/mascot.png';

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    getProject(id)
      .then(r => {
        setProject(r.data);
        const catId = r.data.category?._id || r.data.category;
        return Promise.all([
          getProjects({ category: catId, limit: 20 }).then(res =>
            setRelated(res.data.filter(p => p._id !== r.data._id).slice(0, 4))
          ),
          getHero().then(res => setHero(res.data))
        ]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading) return;
    gsap.fromTo('.single-hi',  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.fromTo('.s-img-wrap', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 });
    gsap.fromTo('.s-body',     { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
  }, [loading]);

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--blue-dark)' }} />;
  if (!project) return <div style={{ padding: '5rem', textAlign: 'center' }}>Project not found</div>;

  const category = project.category || {};
  const catName  = category.name || 'Portfolio';
  const catId    = category._id  || category;

  return (
    <div className="page">
      {/* HERO BAND */}
      <section className="single-hero">
        <Marquee items={[project.title, catName, 'Mashal Fayyaz', 'Graphic Design']} className="hero-mq" />
        <div className="single-hi">
          <Link to={`/category/${catId}`} className="s-cat-tag">
            {getCatIcon(0)} {catName} ›
          </Link>
          <h1>{project.title}</h1>
          <p className="sd">{project.description}</p>
        </div>
      </section>

      {/* MAIN IMAGE */}
      <div className="s-img-wrap">
        <div className="s-img-main">
          {project.image?.url
            ? <img src={project.image.url} alt={project.title} />
            : <div className="s-img-ph">🎨</div>
          }
        </div>
      </div>

      {/* BODY */}
      <div className="s-body">
        <div className="s-desc">
          <h3>Project Overview</h3>
          <p>{project.description}</p>
          <p>
            This project showcases a comprehensive design approach tailored to the client's vision
            and brand goals. Every element was crafted with intention — from typography selection
            to colour palette, ensuring the final output communicates the right message to the
            right audience.
          </p>
          {project.tags?.length > 0 && (
            <p style={{ marginTop: '1rem' }}>
              <strong>Tags: </strong>
              {project.tags.map(t => (
                <span key={t} className="ptag" style={{ marginRight: '0.4rem' }}>{t}</span>
              ))}
            </p>
          )}
        </div>

        <div className="s-side">
          <div className="s-meta">
            <div className="s-ml">Category</div>
            <div className="s-mv">{catName}</div>
          </div>
          <div className="s-meta">
            <div className="s-ml">Client</div>
            <div className="s-mv">{project.client || '—'}</div>
          </div>
          <div className="s-meta">
            <div className="s-ml">Year</div>
            <div className="s-mv">{project.year || new Date().getFullYear()}</div>
          </div>
          <div className="s-meta">
            <div className="s-ml">Designer</div>
            <div className="s-mv">Mashal Fayyaz</div>
          </div>
          <button
            className="btn-g"
            style={{ borderRadius: '12px', padding: '0.85rem', width: '100%', marginTop: '0.4rem' }}
            onClick={() => navigate('/#contact')}
          >
            Get a Similar Project →
          </button>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="more-sec">
          <h3>
            More from <span style={{ color: 'var(--blue)' }}>{catName}</span>
          </h3>
          <div className="more-grid">
            {related.map(p => (
              <div key={p._id} className="more-item" onClick={() => navigate(`/project/${p._id}`)}>
                <div className="mi-img">
                  {p.image?.url
                    ? <img src={p.image.url} alt={p.title} />
                    : <div className="mi-img-ph">🎨</div>
                  }
                </div>
                <div className="mi-name">{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SiteFooter hero={hero} />
    </div>
  );
}
