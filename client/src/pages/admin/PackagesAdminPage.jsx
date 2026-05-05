import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { packagesAPI } from '@lib/api';

const STUB_LABELS = {
  gathering:   '№ 001 · Admit One',
  celebration: '№ 002 · Admit One',
  feast:       '№ 003 · Admit One',
};

const EMPTY_NEW = {
  slug:     '',
  label:    '',
  name:     '',
  guests:   '',
  price:    '',
  minimum:  '',
  featured: false,
  features: [''],
  includes: [''],
};

export default function PackagesAdminPage() {
  const [packages,  setPackages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(null);
  const [drafts,    setDrafts]    = useState({});
  const [expanded,  setExpanded]  = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPkg,     setNewPkg]     = useState(EMPTY_NEW);
  const [creating,   setCreating]   = useState(false);

  // ── FETCH ──────────────────────────────────────────────
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await packagesAPI.getAll();
      const pkgs = res.data.packages || [];
      setPackages(pkgs);
      const initial = {};
      pkgs.forEach((p) => {
        initial[p._id] = {
          label:    p.label,
          name:     p.name,
          guests:   p.guests,
          price:    p.price,
          minimum:  p.minimum,
          featured: p.featured,
          features: [...(p.features || [])],
          includes: [...(p.includes || [])],
        };
      });
      setDrafts(initial);
      if (pkgs.length && !expanded) setExpanded(pkgs[0]._id);
    } catch {
      toast.error('Could not load packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []); // eslint-disable-line

  // ── DRAFT FIELD HELPERS ────────────────────────────────
  const setField = (id, key, val) =>
    setDrafts((p) => ({ ...p, [id]: { ...p[id], [key]: val } }));

  const setListItem = (id, listKey, idx, val) =>
    setDrafts((p) => {
      const arr = [...p[id][listKey]];
      arr[idx] = val;
      return { ...p, [id]: { ...p[id], [listKey]: arr } };
    });

  const addListItem = (id, listKey) =>
    setDrafts((p) => ({
      ...p,
      [id]: { ...p[id], [listKey]: [...p[id][listKey], ''] },
    }));

  const removeListItem = (id, listKey, idx) =>
    setDrafts((p) => ({
      ...p,
      [id]: { ...p[id], [listKey]: p[id][listKey].filter((_, i) => i !== idx) },
    }));

  // ── NEW PKG HELPERS ────────────────────────────────────
  const setNew = (key, val) => setNewPkg((p) => ({ ...p, [key]: val }));

  const setNewListItem = (listKey, idx, val) =>
    setNewPkg((p) => { const a = [...p[listKey]]; a[idx] = val; return { ...p, [listKey]: a }; });

  const addNewListItem = (listKey) =>
    setNewPkg((p) => ({ ...p, [listKey]: [...p[listKey], ''] }));

  const removeNewListItem = (listKey, idx) =>
    setNewPkg((p) => ({ ...p, [listKey]: p[listKey].filter((_, i) => i !== idx) }));

  // ── CREATE ─────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await packagesAPI.create({
        ...newPkg,
        price:    Number(newPkg.price),
        features: newPkg.features.filter(Boolean),
        includes: newPkg.includes.filter(Boolean),
      });
      toast.success('Package created');
      setNewPkg(EMPTY_NEW);
      setShowCreate(false);
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed.');
    } finally {
      setCreating(false);
    }
  };

  // ── SAVE ──────────────────────────────────────────────
  const handleSave = async (id) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    try {
      await packagesAPI.update(id, { ...draft, price: Number(draft.price) });
      toast.success('Package updated');
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(null);
    }
  };

  // ── DELETE ─────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "The ${name}"? This cannot be undone.`)) return;
    try {
      await packagesAPI.remove(id);
      toast.success('Package deleted');
      fetchPackages();
    } catch {
      toast.error('Delete failed.');
    }
  };

  // ── RESET ──────────────────────────────────────────────
  const handleReset = (id) => {
    const o = packages.find((p) => p._id === id);
    if (!o) return;
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        label:    o.label,
        name:     o.name,
        guests:   o.guests,
        price:    o.price,
        minimum:  o.minimum,
        featured: o.featured,
        features: [...(o.features || [])],
        includes: [...(o.includes || [])],
      },
    }));
    toast('Reset to saved values', { icon: '↩️' });
  };

  // ── DIRTY CHECK ────────────────────────────────────────
  const isDirty = (id) => {
    const o = packages.find((p) => p._id === id);
    const d = drafts[id];
    if (!o || !d) return false;
    return (
      d.label    !== o.label    ||
      d.name     !== o.name     ||
      d.guests   !== o.guests   ||
      Number(d.price) !== o.price ||
      d.minimum  !== o.minimum  ||
      d.featured !== o.featured ||
      JSON.stringify(d.features) !== JSON.stringify(o.features || []) ||
      JSON.stringify(d.includes) !== JSON.stringify(o.includes || [])
    );
  };

  // ── REUSABLE LIST EDITOR ───────────────────────────────
  const ListEditor = ({ label, items, onAdd, onChange, onRemove, placeholder }) => (
    <div className="admin-pkg__features-section">
      <div className="admin-pkg__features-header">
        <div className="admin-pkg__label">{label}</div>
        <button type="button" className="admin-pkg__add-feature" onClick={onAdd}>
          + Add item
        </button>
      </div>
      <div className="admin-pkg__features-list">
        {items.map((val, idx) => (
          <div key={idx} className="admin-pkg__feature-row">
            <span className="admin-pkg__feature-bullet">
              {label.toLowerCase().includes('food') ? '': '✦'}
            </span>
            <input
              className="admin-pkg__feature-input"
              value={val}
              onChange={(e) => onChange(idx, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              className="admin-pkg__feature-remove"
              onClick={() => onRemove(idx)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="admin-pkg"><p className="admin-dash__empty">Loading packages…</p></div>;

  return (
    <div className="admin-pkg">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="admin-pkg__header">
        <div className="packages__folio" style={{ marginBottom: 8 }}>Ch. 04 — Packages</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h1 className="admin-pkg__title">Manage <em>Packages</em></h1>
            <p className="admin-pkg__sub">Edit pricing, features, food items and details for each tier.</p>
          </div>
          <button
            className={`admin-pkg__save-btn ${showCreate ? '' : 'admin-pkg__save-btn--dirty'}`}
            onClick={() => setShowCreate((v) => !v)}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {showCreate ? '✕ Cancel' : '+ New Package'}
          </button>
        </div>
      </header>

      {/* ── Create Form ────────────────────────────────── */}
      {showCreate && (
        <form className="admin-pkg__create-form" onSubmit={handleCreate}>
          <div className="admin-pkg__panel admin-pkg__panel--open" style={{ marginBottom: 0 }}>
            <div className="admin-pkg__panel-toggle" style={{ cursor: 'default' }}>
              <div className="admin-pkg__panel-toggle-left">
                <span className="admin-pkg__panel-folio">New</span>
                <span className="admin-pkg__panel-name">Create Package</span>
              </div>
            </div>

            <div className="admin-pkg__panel-body">
              <div className="admin-pkg__form-grid">

                <div className="admin-pkg__field">
                  <label className="admin-pkg__label" htmlFor="new-slug">
                    Slug <small style={{ opacity: .6 }}>(unique, no spaces)</small>
                  </label>
                  <input id="new-slug" className="admin-pkg__input"
                    placeholder="e.g. grand-feast"
                    value={newPkg.slug}
                    onChange={(e) => setNew('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    required />
                </div>

                <div className="admin-pkg__field">
                  <label className="admin-pkg__label" htmlFor="new-label">Tier Label</label>
                  <input id="new-label" className="admin-pkg__input"
                    placeholder="e.g. Premium" value={newPkg.label}
                    onChange={(e) => setNew('label', e.target.value)} required />
                </div>

                <div className="admin-pkg__field">
                  <label className="admin-pkg__label" htmlFor="new-name">Package Name</label>
                  <input id="new-name" className="admin-pkg__input"
                    placeholder="e.g. Grand Feast" value={newPkg.name}
                    onChange={(e) => setNew('name', e.target.value)} required />
                </div>

                <div className="admin-pkg__field">
                  <label className="admin-pkg__label" htmlFor="new-price">Price (per person)</label>
                  <div className="admin-pkg__input-prefix-wrap">
                    <span className="admin-pkg__input-prefix">$</span>
                    <input id="new-price" className="admin-pkg__input admin-pkg__input--prefixed"
                      type="number" min="0" step="0.01" placeholder="0.00"
                      value={newPkg.price}
                      onChange={(e) => setNew('price', e.target.value)} required />
                  </div>
                </div>

                <div className="admin-pkg__field">
                  <label className="admin-pkg__label" htmlFor="new-guests">Guest Range</label>
                  <input id="new-guests" className="admin-pkg__input"
                    placeholder="e.g. Up to 200 guests" value={newPkg.guests}
                    onChange={(e) => setNew('guests', e.target.value)} />
                </div>

                <div className="admin-pkg__field">
                  <label className="admin-pkg__label" htmlFor="new-min">Minimum</label>
                  <input id="new-min" className="admin-pkg__input"
                    placeholder="e.g. Min. 50 guests" value={newPkg.minimum}
                    onChange={(e) => setNew('minimum', e.target.value)} />
                </div>

                <div className="admin-pkg__field admin-pkg__field--toggle">
                  <div className="admin-pkg__label">Featured Package</div>
                  <button type="button"
                    className={`admin-pkg__toggle ${newPkg.featured ? 'admin-pkg__toggle--on' : ''}`}
                    onClick={() => setNew('featured', !newPkg.featured)}>
                    <span className="admin-pkg__toggle-knob" />
                    <span className="admin-pkg__toggle-label">
                      {newPkg.featured ? 'Featured' : 'Standard'}
                    </span>
                  </button>
                </div>

              </div>

              {/* Service features */}
              <ListEditor
                label="Service Features"
                items={newPkg.features}
                onAdd={() => addNewListItem('features')}
                onChange={(idx, val) => setNewListItem('features', idx, val)}
                onRemove={(idx) => removeNewListItem('features', idx)}
                placeholder="e.g. Full Setup & Breakdown"
              />

              {/* Food includes */}
              <ListEditor
                label="Food Items Included"
                items={newPkg.includes}
                onAdd={() => addNewListItem('includes')}
                onChange={(idx, val) => setNewListItem('includes', idx, val)}
                onRemove={(idx) => removeNewListItem('includes', idx)}
                placeholder="e.g. Fried Mac & Cheese Balls"
              />

              <div className="admin-pkg__actions">
                <button type="button" className="admin-pkg__reset-btn"
                  onClick={() => { setNewPkg(EMPTY_NEW); setShowCreate(false); }}>
                  Cancel
                </button>
                <button type="submit"
                  className="admin-pkg__save-btn admin-pkg__save-btn--dirty"
                  disabled={creating}>
                  {creating ? 'Creating…' : 'Create Package →'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ── Preview strip ──────────────────────────────── */}
      <div className="admin-pkg__preview-strip">
        {packages.map((pkg) => {
          const d = drafts[pkg._id] || {};
          return (
            <div key={pkg._id}
              className={`admin-pkg__preview-card
                ${d.featured       ? 'admin-pkg__preview-card--featured' : ''}
                ${isDirty(pkg._id) ? 'admin-pkg__preview-card--dirty'    : ''}`}
              onClick={() => setExpanded((e) => e === pkg._id ? null : pkg._id)}
            >
              {isDirty(pkg._id) && <div className="admin-pkg__dirty-dot" />}
              <div className="admin-pkg__preview-stub">
                {STUB_LABELS[pkg.slug] || '№ — · Admit One'}
              </div>
              <div className="admin-pkg__preview-label">{d.label}</div>
              <div className="admin-pkg__preview-name">The <em>{d.name}</em></div>
              <div className="admin-pkg__preview-price">
                ${d.price}<span>/pp</span>
              </div>
              <div className="admin-pkg__preview-chevron">
                {expanded === pkg._id ? '▲' : '▼'}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Accordion panels ───────────────────────────── */}
      <div className="admin-pkg__panels">
        {packages.map((pkg) => {
          const d        = drafts[pkg._id] || {};
          const isOpen   = expanded === pkg._id;
          const dirty    = isDirty(pkg._id);
          const isSaving = saving === pkg._id;

          return (
            <div key={pkg._id}
              className={`admin-pkg__panel ${isOpen ? 'admin-pkg__panel--open' : ''}`}>

              <button className="admin-pkg__panel-toggle"
                onClick={() => setExpanded((e) => e === pkg._id ? null : pkg._id)}>
                <div className="admin-pkg__panel-toggle-left">
                  <span className="admin-pkg__panel-folio">{d.label}</span>
                  <span className="admin-pkg__panel-name">The {d.name}</span>
                  {dirty && <span className="admin-pkg__unsaved-badge">Unsaved</span>}
                </div>
                <span className="admin-pkg__panel-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="admin-pkg__panel-body">
                  <div className="admin-pkg__form-grid">

                    <div className="admin-pkg__field">
                      <label className="admin-pkg__label">Tier Label</label>
                      <input className="admin-pkg__input" value={d.label || ''}
                        placeholder="e.g. Signature"
                        onChange={(e) => setField(pkg._id, 'label', e.target.value)} />
                    </div>

                    <div className="admin-pkg__field">
                      <label className="admin-pkg__label">Package Name</label>
                      <input className="admin-pkg__input" value={d.name || ''}
                        placeholder="e.g. Celebration"
                        onChange={(e) => setField(pkg._id, 'name', e.target.value)} />
                    </div>

                    <div className="admin-pkg__field">
                      <label className="admin-pkg__label">Price (per person)</label>
                      <div className="admin-pkg__input-prefix-wrap">
                        <span className="admin-pkg__input-prefix">$</span>
                        <input className="admin-pkg__input admin-pkg__input--prefixed"
                          type="number" min="0" step="0.01" value={d.price || ''}
                          onChange={(e) => setField(pkg._id, 'price', e.target.value)} />
                      </div>
                    </div>

                    <div className="admin-pkg__field">
                      <label className="admin-pkg__label">Guest Range</label>
                      <input className="admin-pkg__input" value={d.guests || ''}
                        placeholder="e.g. Up to 150 guests"
                        onChange={(e) => setField(pkg._id, 'guests', e.target.value)} />
                    </div>

                    <div className="admin-pkg__field">
                      <label className="admin-pkg__label">Minimum</label>
                      <input className="admin-pkg__input" value={d.minimum || ''}
                        placeholder="e.g. Min. 30 guests"
                        onChange={(e) => setField(pkg._id, 'minimum', e.target.value)} />
                    </div>

                    <div className="admin-pkg__field admin-pkg__field--toggle">
                      <div className="admin-pkg__label">Featured Package</div>
                      <button type="button"
                        className={`admin-pkg__toggle ${d.featured ? 'admin-pkg__toggle--on' : ''}`}
                        onClick={() => setField(pkg._id, 'featured', !d.featured)}>
                        <span className="admin-pkg__toggle-knob" />
                        <span className="admin-pkg__toggle-label">
                          {d.featured ? 'Featured' : 'Standard'}
                        </span>
                      </button>
                    </div>

                  </div>

                  {/* Service features */}
                  <ListEditor
                    label="Service Features"
                    items={d.features || []}
                    onAdd={() => addListItem(pkg._id, 'features')}
                    onChange={(idx, val) => setListItem(pkg._id, 'features', idx, val)}
                    onRemove={(idx) => removeListItem(pkg._id, 'features', idx)}
                    placeholder="e.g. Full Setup & Breakdown"
                  />

                  {/* Food includes */}
                  <ListEditor
                    label="Food Items Included"
                    items={d.includes || []}
                    onAdd={() => addListItem(pkg._id, 'includes')}
                    onChange={(idx, val) => setListItem(pkg._id, 'includes', idx, val)}
                    onRemove={(idx) => removeListItem(pkg._id, 'includes', idx)}
                    placeholder="e.g. Fried Mac & Cheese Balls"
                  />

                  <div className="admin-pkg__actions">
                    <button type="button" className="admin-pkg__reset-btn"
                      onClick={() => handleReset(pkg._id)} disabled={!dirty}>
                      ↩ Reset changes
                    </button>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="button" className="admin-pkg__reset-btn"
                        style={{ color: '#B0502E' }}
                        onClick={() => handleDelete(pkg._id, pkg.name)}>
                        Delete package
                      </button>
                      <button type="button"
                        className={`admin-pkg__save-btn ${dirty ? 'admin-pkg__save-btn--dirty' : ''}`}
                        onClick={() => handleSave(pkg._id)}
                        disabled={isSaving || !dirty}>
                        {isSaving ? 'Saving…' : dirty ? 'Save Changes →' : 'Up to date ✓'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
