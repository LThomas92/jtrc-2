import { useEffect, useState } from 'react';
import { ordersAPI } from '@lib/api';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI
      .getAll()
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;

  const stats = [
    { label: 'Total Orders', value: orders.length, accent: 'terracotta' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, accent: 'ochre' },
    { label: 'Pending', value: pendingCount, accent: 'olive' },
    { label: 'Confirmed', value: confirmedCount, accent: 'ink' },
  ];

  const recent = orders.slice(0, 5);

  return (
    <div className="admin-dash">
      <header className="admin-dash__header">
        <div className="admin-dash__folio">Dashboard — At a Glance</div>
        <h1 className="admin-dash__title">Good morning, Chef.</h1>
        <p className="admin-dash__sub">Here's what's cooking today.</p>
      </header>

      <div className="admin-dash__stats">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`admin-dash__stat admin-dash__stat--${s.accent}`}
          >
            <div className="admin-dash__stat-label">{s.label}</div>
            <div className="admin-dash__stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="admin-dash__section-title">Recent Orders</h2>
        {loading ? (
          <p className="admin-dash__empty">Loading orders…</p>
        ) : recent.length === 0 ? (
          <p className="admin-dash__empty">
            No orders yet. Start the server and seed sample data to see them here.
          </p>
        ) : (
          <div className="admin-dash__table">
            <div className="admin-dash__row admin-dash__row--head">
              <div>Order</div>
              <div>Customer</div>
              <div>Event Date</div>
              <div>Status</div>
              <div>Total</div>
            </div>
            {recent.map((o) => (
              <div key={o._id} className="admin-dash__row">
                <div>#{(o._id || '').slice(-6).toUpperCase()}</div>
                <div>{o.customer?.name || '—'}</div>
                <div>
                  {o.customer?.eventDate
                    ? new Date(o.customer.eventDate).toLocaleDateString()
                    : '—'}
                </div>
                <div>
                  <span className={`admin-dash__badge admin-dash__badge--${o.status}`}>
                    {o.status}
                  </span>
                </div>
                <div className="admin-dash__total">
                  ${(o.subtotal || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
