import { useEffect, useState } from 'react';
import {
  getCategoriesAdmin, createCategory, updateCategory, deleteCategory
} from '../services/api';
import { ImgUploadField, Toast, getCatIcon } from '../components';

const EMPTY_FORM = { name: '', subtitle: '', order: 0, isVisible: true, _imgFile: null, _imgPreview: null };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', item? }
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const load = () => {
    setLoading(true);
    getCategoriesAdmin()
      .then(r => setCategories(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: 'add' });
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      subtitle: item.subtitle || '',
      order: item.order || 0,
      isVisible: item.isVisible !== false,
      _imgFile: null,
      _imgPreview: item.image?.url || null,
      _existingPublicId: item.image?.publicId || null,
    });
    setModal({ mode: 'edit', item });
  };

  const closeModal = () => setModal(null);

  const handleImgChange = (preview, file) => {
    setForm(f => ({ ...f, _imgFile: file, _imgPreview: preview }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Name is required');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('subtitle', form.subtitle);
      fd.append('order', form.order);
      fd.append('isVisible', form.isVisible);
      if (form._imgFile) fd.append('image', form._imgFile);

      if (modal.mode === 'add') {
        await createCategory(fd);
        showToast('✓ Category created!');
      } else {
        await updateCategory(modal.item._id, fd);
        showToast('✓ Category updated!');
      }
      load();
      closeModal();
    } catch (err) {
      showToast('✗ ' + (err.response?.data?.message || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This cannot be undone.')) return;
    try {
      await deleteCategory(id);
      showToast('✓ Category deleted');
      load();
    } catch (err) {
      showToast('✗ ' + (err.response?.data?.message || 'Delete failed'));
    }
  };

  return (
    <div>
      <Toast msg={toast} />

      <div className="a-sec">
        <div className="a-sec-h">
          <h2>All Categories</h2>
          <button className="btn-sm" onClick={openAdd}>+ Add Category</button>
        </div>

        {loading ? (
          <div style={{ padding: '1rem', color: '#aaa' }}>Loading…</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Subtitle</th>
                <th>Order</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat._id}>
                  <td>
                    {cat.image?.url
                      ? <img src={cat.image.url} className="t-thumb" alt={cat.name} />
                      : <div className="t-thumb-ph">{getCatIcon(idx)}</div>
                    }
                  </td>
                  <td><strong>{cat.name}</strong></td>
                  <td>{cat.subtitle}</td>
                  <td>{cat.order}</td>
                  <td>
                    <span style={{
                      display: 'inline-block', padding: '0.18rem 0.65rem', borderRadius: 50,
                      fontSize: '0.7rem', fontWeight: 700,
                      background: cat.isVisible ? '#d1fae5' : '#fee2e2',
                      color: cat.isVisible ? '#065f46' : '#991b1b'
                    }}>
                      {cat.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-sm btn-gho" onClick={() => openEdit(cat)}>Edit</button>
                      <button className="btn-sm btn-dng" onClick={() => handleDelete(cat._id)}>Delete</button>
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
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h3>{modal.mode === 'add' ? 'Add Category' : 'Edit Category'}</h3>

            <ImgUploadField
              value={form._imgPreview}
              onChange={handleImgChange}
              label="Category Cover Image"
            />

            <div className="fg">
              <label>Category Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Brand Identity"
              />
            </div>

            <div className="fg">
              <label>Subtitle</label>
              <input
                value={form.subtitle}
                onChange={e => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g. Logo & Stationery"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="fg">
                <label>Sort Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="fg">
                <label>Visibility</label>
                <select
                  value={form.isVisible ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, isVisible: e.target.value === 'true' })}
                >
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>

            <div className="modal-ft">
              <button className="btn-sm btn-gho" onClick={closeModal}>Cancel</button>
              <button className="btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
