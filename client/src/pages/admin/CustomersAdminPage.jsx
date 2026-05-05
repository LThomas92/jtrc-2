import { useEffect, useState } from 'react';
import { ordersAPI } from '@lib/api';

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    ordersAPI.getAll()
      .then((res) => {
        const orders = res.data.orders || [];

        // Aggregate customers from orders — group by phone number
        const map = {};
        orders.forEach((order) => {
          const key  = order.customer?.phone || order.customer?.name;
          if (!key) return;

          if (!map[key]) {
            map[key] = {
              name:       order.customer.name,
              phone:      order.customer.phone,
              orders:     [],
              totalSpent: 0,
              lastOrder:  null,
            };
          }

          map[key].orders.push(order);
          map[key].totalSpent += order.chargedAmount || order.subtotal || 0;

          const date = new Date(order.createdAt);
          if (!map[key].lastOrder || date > new Date(map[key].lastOrder)) {
            map[key].lastOrder = order.createdAt;
          }
        });

        // Sort by most recent order
        const sorted = Object.values(map).sort(
          (a, b) => new Date(b.lastOrder) - new Date(a.lastOrder)
        );
        setCustomers(sorted);
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="admin-customers">

      <header className="admin-customers__header">
        <div>
          <div className="admin-customers__folio">Customer Records</div>
          <h1 className="admin-customers__title">
            Your <em>Guests</em>
          </h1>
          <p className="admin-customers__sub">
            All customers derived from completed orders.
          </p>
        </div>
        <div className="admin-customers__count">
          <span>{customers.length}</span>
          {customers.length === 1 ? 'customer' : 'customers'}
        </div>
      </header>

      {/* Search */}
      <div className="admin-customers__search-row">
        <div className="admin-customers__search-wrap">
          <svg width="15" height="15" fill="none" stroke="currentColor"
            strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            className="admin-customers__search"
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="admin-customers__search-clear"
              onClick={() => setSearch('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="admin-dash__empty">Loading customers…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-dash__empty">
          {search ? 'No customers match that search.' : 'No orders yet — customers appear here once orders are placed.'}
        </p>
      ) : (
        <>
          {/* Table header */}
          <div className="admin-customers__table">
            <div className="admin-customers__row admin-customers__row--head">
              <div>Name</div>
              <div>Phone</div>
              <div>Orders</div>
              <div>Total Spent</div>
              <div>Last Order</div>
            </div>

            {filtered.map((c, i) => (
              <div key={i} className="admin-customers__row">
                <div className="admin-customers__name">{c.name}</div>
                <div className="admin-customers__phone">
                  <a href={`tel:${c.phone}`}>{c.phone}</a>
                </div>
                <div>
                  <span className="admin-customers__order-count">
                    {c.orders.length}
                  </span>
                </div>
                <div className="admin-customers__spent">
                  ${c.totalSpent.toFixed(2)}
                </div>
                <div className="admin-customers__date">
                  {c.lastOrder
                    ? new Date(c.lastOrder).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })
                    : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Order detail cards */}
          <div className="admin-customers__details">
            <h2 className="admin-customers__details-title">Order History</h2>
            {filtered.map((c, i) => (
              <div key={i} className="admin-customers__customer-card">
                <div className="admin-customers__customer-head">
                  <div>
                    <div className="admin-customers__customer-name">{c.name}</div>
                    <div className="admin-customers__customer-meta">
                      {c.phone} · {c.orders.length} order{c.orders.length !== 1 ? 's' : ''} · ${c.totalSpent.toFixed(2)} total
                    </div>
                  </div>
                </div>

                <div className="admin-customers__order-list">
                  {c.orders.map((order) => (
                    <div key={order._id} className="admin-customers__order-row">
                      <div className="admin-customers__order-id">
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="admin-customers__order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                      <div className="admin-customers__order-items">
                        {(order.items || []).map((item) =>
                          `${item.quantity}× ${item.name}`
                        ).join(', ')}
                      </div>
                      <div className="admin-customers__order-mode">
                        {order.paymentMode === 'deposit' ? '25% deposit' : 'Full payment'}
                      </div>
                      <div>
                        <span className={`admin-dash__badge admin-dash__badge--${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="admin-customers__order-amount">
                        ${(order.chargedAmount || order.subtotal || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
