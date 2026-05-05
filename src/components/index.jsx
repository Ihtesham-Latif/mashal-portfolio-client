import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const MASCOT = '/mascot.png';

/* ── MARQUEE ── */
export function Marquee({ items, reverse = false, className = '' }) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee-outer ${className}`}>
      <div className={`mq-track${reverse ? ' rev' : ''}`}>
        {repeated.map((t, i) => (
          <span key={i} className="mq-item">
            {t}<span className="dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── LOADER ── */
export function Loader({ onDone }) {
  const mascRef = useRef(), nameRef = useRef(), barWRef = useRef(), barRef = useRef();
  const r1 = useRef(), r2 = useRef(), r3 = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to([barWRef.current, nameRef.current], { opacity: 1, duration: 0.4 }, 0)
      .to(mascRef.current, { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.5)' }, 0.1)
      .to(barRef.current, { width: '100%', duration: 1.4, ease: 'power2.inOut' }, 0.3)
      .to([r3.current, r2.current, r1.current], { opacity: 0.96, scale: 1, duration: 0.9, stagger: 0.08, ease: 'power3.in' }, 1.65)
      .to('#loader', { opacity: 0, duration: 0.4 }, 2.72);
  }, []);

  return (
    <div id="loader">
      <div ref={r3} className="loader-ring ring3" />
      <div ref={r2} className="loader-ring ring2" />
      <div ref={r1} className="loader-ring ring1" />
      <div ref={mascRef} className="ldr-mascot">
        <img src={MASCOT} alt="Mashal Bunny" />
      </div>
      <div ref={nameRef} className="ldr-name">Mashal Fayyaz</div>
      <div ref={barWRef} className="ldr-bar-wrap">
        <div ref={barRef} className="ldr-bar" />
      </div>
    </div>
  );
}

/* ── SITE NAV ── */
export function SiteNav({ backLabel, backTo }) {
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <img src={MASCOT} alt="logo" />
        MASHAL
      </Link>
      {!backLabel ? (
        <ul className="nav-links">
          <li><a onClick={() => scrollTo('works')}>Works</a></li>
          <li><a onClick={() => scrollTo('about')}>About</a></li>
          <li><a onClick={() => scrollTo('contact')}>Contact</a></li>
        </ul>
      ) : (
        <button className="nav-back" onClick={() => navigate(backTo || -1)}>
          ← {backLabel}
        </button>
      )}
      <button className="nav-cta" onClick={() => {
        if (!backLabel) scrollTo('contact');
        else navigate('/');
      }}>
        {backLabel ? 'Home' : 'Hire Me'}
      </button>
    </nav>
  );
}

/* ── FOOTER ── */
export function SiteFooter({ hero }) {
  return (
    <footer>
      <span className="f-logo">{(hero?.designerName || 'Mashal').split(' ')[0]}</span>
      <span className="f-copy">© 2025 {hero?.designerName} · {hero?.designerRole}</span>
      <div className="f-soc">
        {hero?.socialLinks?.behance   && <a href={hero.socialLinks.behance}   target="_blank" rel="noreferrer">Behance</a>}
        {hero?.socialLinks?.instagram && <a href={hero.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>}
        {hero?.socialLinks?.linkedin  && <a href={hero.socialLinks.linkedin}  target="_blank" rel="noreferrer">LinkedIn</a>}
        {!hero?.socialLinks?.behance  && <a href="#">Behance</a>}
        {!hero?.socialLinks?.instagram && <a href="#">Instagram</a>}
        {!hero?.socialLinks?.linkedin  && <a href="#">LinkedIn</a>}
      </div>
    </footer>
  );
}

/* ── IMAGE UPLOAD FIELD ── */
export function ImgUploadField({ value, onChange, label = 'Image' }) {
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result, f);
    reader.readAsDataURL(f);
  };
  return (
    <div className="fg">
      <label>{label}</label>
      <div className="img-upload-area">
        <input type="file" accept="image/*" onChange={handleFile} />
        {!value ? (
          <div>
            <div className="img-up-icon">🖼</div>
            <div className="img-up-text">Click or drag to upload image</div>
            <div className="img-up-hint">PNG, JPG, WEBP · max 5 MB</div>
          </div>
        ) : (
          <img src={value} className="img-preview" alt="preview" />
        )}
      </div>
      {value && (
        <button
          style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#e24b4a', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
          onClick={() => onChange(null, null)}
        >
          ✕ Remove image
        </button>
      )}
    </div>
  );
}

/* ── TOAST ── */
export function Toast({ msg }) {
  return <div className={`toast${msg ? ' show' : ''}`}>{msg}</div>;
}

/* ── CATEGORY FALLBACK ICONS ── */
export const CAT_FALLBACKS = ['🎨', '📱', '🎬', '✨', '🖌', '📸', '🎭', '💡'];
export const getCatIcon = (idx) => CAT_FALLBACKS[idx % CAT_FALLBACKS.length];
