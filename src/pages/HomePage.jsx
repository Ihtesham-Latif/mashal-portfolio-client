import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Marquee, SiteFooter, getCatIcon } from '../components';
import { getHero, getCategories, getProjects } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const MASCOT = '/mascot.png';

export default function HomePage() {
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHero().then(r => setHero(r.data)),
      getCategories().then(r => setCategories(r.data)),
      getProjects({ limit: 100 }).then(r => setProjects(r.data))
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !hero) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.h-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.2)
      .to('.h-mascot',  { opacity: 1, y: 0, duration: 1.0 }, 0.35)
      .to('.h-title',   { opacity: 1, y: 0, duration: 0.9 }, 0.55)
      .to('.h-pill',    { opacity: 1, y: 0, duration: 0.8 }, 0.75)
      .to('.h-btns',    { opacity: 1, y: 0, duration: 0.8 }, 0.9);

    gsap.to('.h-mascot', { y: -18, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.h-mascot', { rotation: 2, transformOrigin: '50% 90%', duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.5 });

    gsap.utils.toArray('.work-card').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.65, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    gsap.to('.about-l', { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.about-l', start: 'top 82%' } });
    gsap.to('.about-r', { opacity: 1, x: 0, duration: 0.9, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.about-r', start: 'top 82%' } });
    gsap.to('.contact h2', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.contact h2', start: 'top 86%' } });
    gsap.to('.contact-sub', { opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-sub', start: 'top 86%' } });
    gsap.to('.contact-form', { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.contact-form', start: 'top 86%' } });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [loading, hero]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const skills = (hero?.skills || []).filter(Boolean);

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--blue-dark)' }} />;

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <Marquee items={[hero?.title || 'PORTFOLIO', 'Graphic Design', 'Branding', 'Social Media', 'Thumbnails', 'Product Design']} className="hero-mq" />
        <div className="bg-word bw1">PORTFOLIO</div>
        <div className="bg-word bw2">PORTFOLIO</div>
        <div className="orb orb1" /><div className="orb orb2" />
        <span className="vert vert-l">{hero?.designerName}</span>
        <span className="vert vert-r">{hero?.designerRole}</span>
        <div className="hero-inner">
          <p className="h-eyebrow">{hero?.eyebrow}</p>
          <div className="h-mascot" onClick={() => scrollTo('works')}>
            <img src={MASCOT} alt="Mashal Bunny Mascot" />
          </div>
          <h1 className="h-title">{hero?.title}</h1>
          <span className="h-pill">{hero?.tagsLine}</span>
          <div className="h-btns">
            <button className="btn-g" onClick={() => scrollTo('works')}>{hero?.ctaPrimary || 'View My Work'}</button>
            <button className="btn-o" onClick={() => scrollTo('contact')}>{hero?.ctaSecondary || 'Get In Touch'}</button>
          </div>
        </div>
        <div className="curve-btm">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0,80 C240,20 480,60 720,30 C960,0 1200,50 1440,20 L1440,80 Z" fill="#F0F9F4" />
          </svg>
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section id="works" className="featured">
        <div className="sec-ctr"><span className="sec-pill">✦  Featured Works  ✦</span></div>
        <div className="cards-grid">
          {categories.map((cat, idx) => {
            const count = projects.filter(p => p.category?._id === cat._id || p.category === cat._id).length;
            return (
              <div key={cat._id} className="work-card" onClick={() => navigate(`/category/${cat._id}`)}>
                {cat.image?.url
                  ? <img src={cat.image.url} className="card-thumb" alt={cat.name} />
                  : <div className="card-ph">{getCatIcon(idx)}</div>
                }
                <div className="card-body">
                  <div className="card-title">{cat.name}</div>
                  <div className="card-sub">{cat.subtitle}</div>
                  <div className="card-row">
                    <span className="card-cta">View All →</span>
                    <span className="card-cnt">{count} works</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Marquee items={['Brand Identity', 'Social Media', 'Thumbnails', 'Product Design', 'Logo Design', 'Branding']} className="strip-mq" />

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="about-l">
          <p className="sec-lbl">About Me</p>
          <h2>{hero?.aboutTitle || 'Creative Designer\nBased in Pakistan'}</h2>
          <p>{hero?.aboutText}</p>
          <div className="skills">
            {skills.map(s => <span key={s} className="sk">{s}</span>)}
          </div>
        </div>
        <div className="about-r">
          <div className="about-box">
            <img src={MASCOT} alt="Mashal" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <h2>Let's Work Together</h2>
        <p className="contact-sub">Have a project in mind? I'd love to hear from you.</p>
        {sent ? (
          <div style={{ color: 'var(--green)', fontSize: '1.15rem', fontWeight: 700, padding: '2rem' }}>
            ✓ Message sent! I'll be in touch.
          </div>
        ) : (
          <div className="contact-form">
            <input className="cfi" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="cfi" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <textarea className="cfi cfi-ta" placeholder="Tell me about your project..." value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} />
            <button className="btn-g" style={{ borderRadius: '14px', padding: '1rem' }}
              onClick={() => { if (form.name && form.email) setSent(true); }}>
              Send Message →
            </button>
          </div>
        )}
      </section>

      <SiteFooter hero={hero} />
    </div>
  );
}
