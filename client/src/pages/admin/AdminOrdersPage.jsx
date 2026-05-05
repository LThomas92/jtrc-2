import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '@lib/api';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = () => {
    setLoading(true);
    ordersAPI
      .getAll()
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Update failed');
    }
  };

  const filtered = orders.filter((o) => filter === 'all' || o.status === filter);

  return (
    <div className="admin-orders">
      <header className="admin-orders__header">
        <div className="admin-orders__folio">Ch. 09 — Orders</div>
        <h1 className="admin-orders__title">
          Active <em>Orders</em>
        </h1>
        <p className="admin-orders__sub">Manage incoming catering requests.</p>
      </header>

      <div className="admin-orders__filter-row">
        <button
          className={`admin-orders__filter-btn ${
            filter === 'all' ? 'admin-orders__filter-btn--active' : ''
          }`}
          onClick={() => setFilter('all')}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              className={`admin-orders__filter-btn ${
                filter === s ? 'admin-orders__filter-btn--active' : ''
              }`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="admin-dash__empty">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-dash__empty">No orders match this filter.</p>
      ) : (
        <div className="admin-orders__list">
          {filtered.map((o) => (
            <article key={o._id} className="admin-orders__order">
              <div className="admin-orders__order-head">
                <div>
                  <div className="admin-orders__order-id">
                    #{(o._id || '').slice(-6).toUpperCase()}
                  </div>
                  <div className="admin-orders__order-customer">
                    {o.customer?.name || 'Unknown'}
                  </div>
                  <div className="admin-orders__order-meta">
                    {o.customer?.email || ''} · {o.customer?.phone || ''}
                  </div>
                </div>
                <div className="admin-orders__order-right">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className={`admin-orders__status-select admin-orders__status-select--${o.status}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="admin-orders__order-total">
                    ${(o.subtotal || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="admin-orders__order-divider" />

              <div className="admin-orders__order-body">
                <div className="admin-orders__order-detail">
                  <span className="admin-orders__detail-label">Event Date</span>
                  <span>
                    {o.customer?.eventDate
                      ? new Date(o.customer.eventDate).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
                <div className="admin-orders__order-detail">
                  <span className="admin-orders__detail-label">Delivery</span>
                  <span>{o.customer?.address || '—'}</span>
                </div>
                <div className="admin-orders__order-items">
                  <div className="admin-orders__detail-label">Items</div>
                  {(o.items || []).map((item, i) => (
                    <div key={i} className="admin-orders__item-row">
                      <span>{item.quantity}× {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {o.customer?.notes && (
                  <div className="admin-orders__order-notes">
                    <span className="admin-orders__detail-label">Notes</span>
                    <p>{o.customer.notes}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
