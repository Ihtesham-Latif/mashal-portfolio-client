import { useEffect, useState } from 'react';
import {
  getProjectsAdmin, getCategoriesAdmin,
  createProject, updateProject, deleteProject
} from '../services/api';
import { ImgUploadField, Toast, getCatIcon } from '../components';

const EMPTY_FORM = {
  title: '', description: '', category: '', tags: '',
  client: '', year: new Date().getFullYear(),
  isFeatured: false, isVisible: true,
  _imgFile: null, _imgPreview: null
};

export default function AdminProjects() {
  const [projects,   setProjects]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState('');
  const [filterCat,  setFilterCat]  = useState('all');
  const [search,     setSearch]     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const load = () => {
    setLoading(true);
    Promise.all([
      getProjectsAdmin().then(r => setProjects(r.data)),
      getCategoriesAdmin().then(r => setCategories(r.data))
    ]).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, category: categories[0]?._id || '' });
    setModal({ mode: 'add' });
  };

  const openEdit = (item) => {
    setForm({
      title:       item.title || '',
      description: item.description || '',
      category:    item.category?._id || item.category || '',
      tags:        Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      client:      item.client || '',
      year:        item.year || new Date().getFullYear(),
      isFeatured:  item.isFeatured || false,
      isVisible:   item.isVisible !== false,
      _imgFile:    null,
      _imgPreview: item.image?.url || null,
    });
    setModal({ mode: 'edit', item });
  };

  const handleSave = async () => {
    if (!form.title.trim())    return alert('Title is required');
    if (!form.category)        return alert('Please select a category');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('description', form.description);
      fd.append('category',    form.category);
      fd.append('tags',        form.tags);
      fd.append('client',      form.client);
      fd.append('year',        form.year);
      fd.append('isFeatured',  form.isFeatured);
      fd.append('isVisible',   form.isVisible);
      if (form._imgFile) fd.append('image', form._imgFile);

      if (modal.mode === 'add') {
        await createProject(fd);
        showToast('✓ Project created!');
      } else {
        await updateProject(modal.item._id, fd);
        showToast('✓ Project updated!');
      }
      load();
      setModal(null);
    } catch (err) {
      showToast('✗ ' + (err.response?.data?.message || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      showToast('✓ Project deleted');
      load();
    } catch (err) {
      showToast('✗ ' + (err.response?.data?.message || 'Delete failed'));
    }
  };

  /* Filtered list */
  const shown = projects.filter(p => {
    const catMatch  = filterCat === 'all' || (p.category?._id || p.category) === filterCat;
    const srchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && srchMatch;
  });

  const catName = (p) => p.category?.name || categories.find(c => c._id === p.category)?.name || '—';

  return (
    <div>
      <Toast msg={toast} />

      <div className="a-sec">
        <div className="a-sec-h">
          <h2>All Projects <span style={{ color: '#ccc', fontWeight: 400, fontSize: '0.85rem' }}>({shown.length})</span></h2>
          <button className="btn-sm" onClick={openAdd}>+ Add Project</button>
        </div>

        {/* FILTER BAR */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            style={{ padding: '0.5rem 0.9rem', borderRadius: 10, border: '1.5px solid #e5e5e5', fontSize: '0.83rem', outline: 'none', fontFamily: 'inherit', minWidth: 180 }}
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ padding: '0.5rem 0.9rem', borderRadius: 10, border: '1.5px solid #e5e5e5', fontSize: '0.83rem', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '1rem', color: '#aaa' }}>Loading…</div>
        ) : shown.length === 0 ? (
          <div style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No projects found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Client</th>
                <th>Year</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.image?.url
                      ? <img src={p.image.url} className="t-thumb" alt={p.title} />
                      : <div className="t-thumb-ph">🎨</div>
                    }
                  </td>
                  <td style={{ maxWidth: 160 }}><strong>{p.title}</strong></td>
                  <td>{catName(p)}</td>
                  <td>{(p.tags || []).slice(0, 3).map(t => <span key={t} className="t-chip">{t}</span>)}</td>
                  <td style={{ fontSize: '0.8rem', color: '#888' }}>{p.client || '—'}</td>
                  <td>{p.year || '—'}</td>
                  <td>
                    {p.isFeatured && (
                      <span style={{ background: '#fef9c3', color: '#854d0e', fontSize: '0.7rem', fontWeight: 700, padding: '0.18rem 0.65rem', borderRadius: 50 }}>
                        ⭐ Featured
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-sm btn-gho" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn-sm btn-dng" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h3>{modal.mode === 'add' ? 'Add Project' : 'Edit Project'}</h3>

            <ImgUploadField
              value={form._imgPreview}
              onChange={(preview, file) => setForm(f => ({ ...f, _imgFile: file, _imgPreview: preview }))}
              label="Project Image"
            />

            <div className="fg">
              <label>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Luna Brand Kit" />
            </div>

            <div className="fg">
              <label>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">— Select category —</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="fg">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief project description…" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="fg">
                <label>Client</label>
                <input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="Client name" />
              </div>
              <div className="fg">
                <label>Year</label>
                <input type="number" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) || 2025 })} />
              </div>
            </div>

            <div className="fg">
              <label>Tags <span style={{ fontWeight: 400, color: '#bbb', textTransform: 'none' }}>(comma-separated)</span></label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="logo, branding, identity" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="fg">
                <label>Featured</label>
                <select value={form.isFeatured ? 'true' : 'false'} onChange={e => setForm({ ...form, isFeatured: e.target.value === 'true' })}>
                  <option value="false">Not Featured</option>
                  <option value="true">⭐ Featured</option>
                </select>
              </div>
              <div className="fg">
                <label>Visibility</label>
                <select value={form.isVisible ? 'true' : 'false'} onChange={e => setForm({ ...form, isVisible: e.target.value === 'true' })}>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>

            <div className="modal-ft">
              <button className="btn-sm btn-gho" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
