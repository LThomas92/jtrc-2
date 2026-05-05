import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { menuAPI } from '@lib/api';
import { getImageUrl } from '@lib/getImageUrl';

const CATEGORIES = [
  { value: 'appetizer', label: 'Appetizer' },
  { value: 'entree',    label: 'Entrée'    },
  { value: 'side',      label: 'Side'      },
  { value: 'seafood',   label: 'Seafood'   },
  { value: 'dessert',   label: 'Dessert'   },
];

const EMPTY_FORM = {
  name:        '',
  description: '',
  price:       '',
  category:    'entree',
  image:       null,
  variations:  [],
};

const newGroup = () => ({
  _id:      crypto.randomUUID(),
  name:     '',
  type:     'single',
  required: true,
  options:  [{ _id: crypto.randomUUID(), label: '', priceAdd: 0 }],
});

// ── Delete confirmation modal ──────────────────────────────
function DeleteModal({ item, onConfirm, onCancel, deleting }) {
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onCancel(); };
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onCancel]);

  return (
    <div className="delete-modal__backdrop" onClick={handleBackdrop}>
      <div className="delete-modal">
        <div className="delete-modal__header">
          <div className="delete-modal__folio">Remove from menu</div>
          <button className="delete-modal__close" onClick={onCancel}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="delete-modal__item">
          <div className="delete-modal__thumb">
            {item.image
              ? <img src={getImageUrl(item.image)} alt={item.name} />
              : <span className="delete-modal__thumb-fallback">🍽️</span>}
          </div>
          <div className="delete-modal__item-info">
            <div className="delete-modal__item-category">{item.category}</div>
            <div className="delete-modal__item-name">{item.name}</div>
            <div className="delete-modal__item-price">${Number(item.price).toFixed(2)}</div>
          </div>
        </div>
        <div className="delete-modal__body">
          <div className="delete-modal__warning-icon">⚠</div>
          <p className="delete-modal__message">
            This will permanently remove <strong>{item.name}</strong> from your menu. This cannot be undone.
          </p>
        </div>
        <div className="delete-modal__actions">
          <button className="delete-modal__cancel-btn" onClick={onCancel} disabled={deleting}>Keep it</button>
          <button className="delete-modal__confirm-btn" onClick={onConfirm} disabled={deleting}>
            {deleting ? <><span className="delete-modal__spinner" /> Removing…</> : <>Remove from menu <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Variations builder component ──────────────────────────
function VariationsBuilder({ variations, onChange }) {
  const addGroup = () => onChange([...variations, newGroup()]);

  const removeGroup = (gid) => onChange(variations.filter((g) => g._id !== gid));

  const updateGroup = (gid, key, val) =>
    onChange(variations.map((g) => g._id === gid ? { ...g, [key]: val } : g));

  const addOption = (gid) =>
    onChange(variations.map((g) => g._id === gid
      ? { ...g, options: [...g.options, { _id: crypto.randomUUID(), label: '', priceAdd: 0 }] }
      : g));

  const removeOption = (gid, oid) =>
    onChange(variations.map((g) => g._id === gid
      ? { ...g, options: g.options.filter((o) => o._id !== oid) }
      : g));

  const updateOption = (gid, oid, key, val) =>
    onChange(variations.map((g) => g._id === gid
      ? { ...g, options: g.options.map((o) => o._id === oid ? { ...o, [key]: val } : o) }
      : g));

  return (
    <div className="admin-menu__variations">
      <div className="admin-menu__variations-header">
        <div className="admin-menu__label">Variations</div>
        <button type="button" className="admin-pkg__add-feature" onClick={addGroup}>
          + Add group
        </button>
      </div>

      {variations.length === 0 && (
        <p className="admin-menu__variations-empty">
          No variations — item adds to cart directly at base price.
        </p>
      )}

      {variations.map((group, gi) => (
        <div key={group._id} className="admin-menu__var-group">
          <div className="admin-menu__var-group-head">

            <input
              className="admin-menu__input admin-menu__input--var-name"
              placeholder="Group name  e.g. Size, Sauce, Add-on"
              value={group.name}
              onChange={(e) => updateGroup(group._id, 'name', e.target.value)}
            />

            <select
              className="admin-menu__select admin-menu__select--sm"
              value={group.type}
              onChange={(e) => updateGroup(group._id, 'type', e.target.value)}
            >
              <option value="single">Pick one</option>
              <option value="multiple">Pick many</option>
            </select>

            <button
              type="button"
              className={`admin-menu__var-required ${group.required ? 'admin-menu__var-required--on' : ''}`}
              onClick={() => updateGroup(group._id, 'required', !group.required)}
              title="Toggle required"
            >
              {group.required ? 'Required' : 'Optional'}
            </button>

            <button
              type="button"
              className="admin-pkg__feature-remove"
              onClick={() => removeGroup(group._id)}
              aria-label="Remove group"
            >
              ×
            </button>
          </div>

          <div className="admin-menu__var-options">
            {group.options.map((opt) => (
              <div key={opt._id} className="admin-menu__var-option-row">
                <input
                  className="admin-menu__input"
                  placeholder="Option label  e.g. Large, Buffalo, Add Shrimp"
                  value={opt.label}
                  onChange={(e) => updateOption(group._id, opt._id, 'label', e.target.value)}
                />
                <div className="admin-menu__var-price-wrap">
                  <span className="admin-menu__var-price-prefix">+$</span>
                  <input
                    className="admin-menu__input admin-menu__input--price-add"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={opt.priceAdd}
                    onChange={(e) => updateOption(group._id, opt._id, 'priceAdd', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button
                  type="button"
                  className="admin-pkg__feature-remove"
                  onClick={() => removeOption(group._id, opt._id)}
                  disabled={group.options.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-menu__var-add-option"
              onClick={() => addOption(group._id)}
            >
              + Add option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function MenuAdminPage() {
  const [items,        setItems]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [editingId,    setEditingId]    = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await menuAPI.getAll();
      setItems(res.data.items || []);
    } catch { toast.error('Could not load menu items.'); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('name',        form.name);
    data.append('description', form.description);
    data.append('price',       form.price);
    data.append('category',    form.category);
    // Send variations as JSON string — multer passes it through req.body
    data.append('variations',  JSON.stringify(form.variations));
    if (form.image) data.append('image', form.image);

    try {
      if (editingId) {
        await menuAPI.update(editingId, data);
        toast.success('Item updated');
      } else {
        await menuAPI.create(data);
        toast.success('Item created');
      }
      handleCancel();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name:        item.name,
      description: item.description,
      price:       item.price,
      category:    item.category,
      image:       null,
      variations:  item.variations || [],
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick  = (item) => setDeleteTarget(item);
  const handleDeleteCancel = useCallback(() => { if (!deleting) setDeleteTarget(null); }, [deleting]);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await menuAPI.remove(deleteTarget._id);
      toast.success(`${deleteTarget.name} removed`);
      if (editingId === deleteTarget._id) handleCancel();
      setDeleteTarget(null);
      fetchItems();
    } catch { toast.error('Delete failed.'); }
    finally   { setDeleting(false); }
  };

  const handleCancel = () => { setForm(EMPTY_FORM); setEditingId(null); };
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const itemCount = items.length;

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          deleting={deleting}
        />
      )}

      <div className="admin-menu">

        {/* ══ LEFT — FORM ════════════════════════════════ */}
        <div className="admin-menu__panel">
          <div className="admin-menu__panel-header">
            <div>
              <div className="admin-menu__panel-folio">{editingId ? 'Editing item' : 'New item'}</div>
              <div className="admin-menu__panel-title">{editingId ? 'Update Entry' : 'Add to Menu'}</div>
            </div>
            {editingId && (
              <button type="button" className="admin-menu__cancel-btn" onClick={handleCancel}>✕ Cancel</button>
            )}
          </div>

          <div className="admin-menu__panel-body">
            <form className="admin-menu__form" onSubmit={handleSubmit}>

              <div className="admin-menu__field">
                <label className="admin-menu__label" htmlFor="menu-name">Dish Name</label>
                <input id="menu-name" className="admin-menu__input"
                  placeholder="e.g. Fried Mac &amp; Cheese Balls"
                  value={form.name} onChange={set('name')} required />
              </div>

              <div className="admin-menu__field">
                <label className="admin-menu__label" htmlFor="menu-desc">Description</label>
                <textarea id="menu-desc" className="admin-menu__textarea"
                  placeholder="Ingredients, preparation style…"
                  value={form.description} onChange={set('description')} required />
              </div>

              <div className="admin-menu__field">
                <label className="admin-menu__label" htmlFor="menu-price">Base Price (USD)</label>
                <input id="menu-price" className="admin-menu__input"
                  type="number" min="0" step="0.01" placeholder="0.00"
                  value={form.price} onChange={set('price')} required />
              </div>

              <div className="admin-menu__field">
                <label className="admin-menu__label" htmlFor="menu-cat">Category</label>
                <select id="menu-cat" className="admin-menu__select"
                  value={form.category} onChange={set('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="admin-menu__field">
                <div className="admin-menu__label">Photo</div>
                <div className="admin-menu__upload-zone">
                  <input type="file" accept="image/*"
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.files[0] }))} />
                  <div className="admin-menu__upload-icon">📷</div>
                  <span className="admin-menu__upload-label">
                    {form.image ? form.image.name : 'Click to upload'}
                  </span>
                  <span className="admin-menu__upload-hint">JPG, PNG or WEBP · max 4 MB</span>
                </div>
                {form.image && (
                  <div className="admin-menu__preview">
                    <img src={URL.createObjectURL(form.image)} alt="Preview" />
                    <div className="admin-menu__preview-label">Preview</div>
                  </div>
                )}
              </div>

              {/* Variations builder */}
              <VariationsBuilder
                variations={form.variations}
                onChange={(v) => setForm((p) => ({ ...p, variations: v }))}
              />

              <button type="submit" disabled={saving}
                className={`admin-menu__submit ${editingId ? 'admin-menu__submit--editing' : ''}`}>
                {saving ? 'Saving…' : editingId ? `Update — ${form.name || 'Item'}` : 'Add to Menu'}
                {!saving && <span>→</span>}
              </button>
            </form>
          </div>
        </div>

        {/* ══ RIGHT — GRID ════════════════════════════════ */}
        <div className="admin-menu__right">
          <div className="admin-menu__right-header">
            <div>
              <div className="admin-menu__right-folio">Menu Management</div>
              <h1 className="admin-menu__right-title">The Full Menu</h1>
            </div>
            <div className="admin-menu__count">
              <span>{itemCount}</span>
              {itemCount === 1 ? 'item' : 'items'}
            </div>
          </div>

          {loading ? (
            <p className="admin-dash__empty">Loading items…</p>
          ) : (
            <div className="admin-menu__grid">
              {items.length === 0 ? (
                <div className="admin-menu__empty-state">
                  <p>No menu items yet. Add your first dish using the form.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id}
                    className={`admin-menu__card
                      ${editingId === item._id        ? 'admin-menu__card--editing'  : ''}
                      ${deleteTarget?._id === item._id ? 'admin-menu__card--deleting' : ''}`}>

                    <div className="admin-menu__card-img">
                      {item.image
                        ? <img src={getImageUrl(item.image)} alt={item.name} />
                        : <div className="admin-menu__card-no-img"><span>🍽️</span><span>No photo</span></div>}
                      <div className="admin-menu__card-category">{item.category}</div>
                      {item.variations?.length > 0 && (
                        <div className="admin-menu__card-variations-badge">
                          {item.variations.length} variation group{item.variations.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <div className="admin-menu__card-body">
                      {item.num && <div className="admin-menu__card-num">{item.num}</div>}
                      <h3 className="admin-menu__card-name">{item.name}</h3>
                      <p className="admin-menu__card-desc">{item.description}</p>
                      <div className="admin-menu__card-footer">
                        <span className="admin-menu__card-price">${Number(item.price).toFixed(2)}</span>
                        <div className="admin-menu__card-actions">
                          <button className="admin-menu__edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                          <button className="admin-menu__delete-btn" onClick={() => handleDeleteClick(item)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
