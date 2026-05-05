import { useEffect, useState } from 'react';
import { getHero, updateHero } from '../services/api';
import { Toast } from '../components';

export default function AdminHero() {
  const [hero, setHero] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  useEffect(() => {
    getHero().then(r => {
      setHero(r.data);
      setForm({
        ...r.data,
        skills: Array.isArray(r.data.skills) ? r.data.skills.join(', ') : r.data.skills || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills, // backend splits by comma
      };
      const r = await updateHero(payload);
      setHero(r.data);
      showToast('✓ Hero section saved!');
    } catch (err) {
      showToast('✗ ' + (err.response?.data?.message || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const F = ({ field, label, type = 'input', hint }) => (
    <div className="fg">
      <label>{label}{hint && <span style={{ fontWeight: 400, color: '#bbb', marginLeft: '0.4rem', textTransform: 'none', letterSpacing: 0 }}>{hint}</span>}</label>
      {type === 'textarea'
        ? <textarea value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })} />
        : <input value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })} />
      }
    </div>
  );

  if (loading) return <div style={{ padding: '2rem', color: '#aaa' }}>Loading…</div>;

  return (
    <div>
      <Toast msg={toast} />

      {/* LIVE PREVIEW */}
      <div className="a-sec">
        <div className="a-sec-h">
          <h2>Hero Preview</h2>
          <button className="btn-sm" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save All Changes'}
          </button>
        </div>
        <div className="hp-prev">
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', letterSpacing: '3px', marginBottom: '0.4rem' }}>
            {form.eyebrow}
          </p>
          <div className="hp-title">{form.title}</div>
          <div className="hp-sub">{form.designerName} · {form.designerRole}</div>
          <div className="hp-pill">{form.tagsLine}</div>
        </div>

        {/* HERO FIELDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <F field="eyebrow"      label="Eyebrow Text"  />
          <F field="title"        label="Big Title"     />
          <F field="designerName" label="Designer Name" />
          <F field="designerRole" label="Designer Role" />
          <div style={{ gridColumn: 'span 2' }}>
            <F field="tagsLine" label="Tags Pill" hint="(use | as separator)" />
          </div>
          <F field="ctaPrimary"   label="CTA Primary Button"   />
          <F field="ctaSecondary" label="CTA Secondary Button" />
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="a-sec">
        <div className="a-sec-h"><h2>About Section</h2></div>
        <F field="aboutTitle" label="About Heading" hint="(use \n for line break)" />
        <F field="aboutText"  label="About Paragraph" type="textarea" />
        <F field="skills"     label="Skills" hint="(comma-separated)" />
      </div>

      {/* SOCIAL LINKS */}
      <div className="a-sec">
        <div className="a-sec-h"><h2>Social Links</h2></div>
        {['behance', 'instagram', 'linkedin'].map(platform => (
          <div className="fg" key={platform}>
            <label>{platform.charAt(0).toUpperCase() + platform.slice(1)} URL</label>
            <input
              value={form.socialLinks?.[platform] || ''}
              onChange={e => setForm({
                ...form,
                socialLinks: { ...form.socialLinks, [platform]: e.target.value }
              })}
              placeholder={`https://${platform}.com/mashalfayyaz`}
            />
          </div>
        ))}
        <button className="btn-sm" onClick={save} disabled={saving} style={{ marginTop: '0.5rem' }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
