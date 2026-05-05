import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { contactAPI } from '@lib/api';

export default function ContactMessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchMessages = () => {
    contactAPI.getAll()
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => toast.error('Could not load messages.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleOpen = async (msg) => {
    setExpanded((prev) => prev === msg._id ? null : msg._id);
    if (!msg.read) {
      try {
        await contactAPI.markRead(msg._id);
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, read: true } : m));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactAPI.remove(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expanded === id) setExpanded(null);
      toast.success('Message deleted');
    } catch {
      toast.error('Delete failed.');
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="admin-contact">
      <header className="admin-contact__header">
        <div>
          <div className="admin-contact__folio">Inbox</div>
          <h1 className="admin-contact__title">
            Contact <em>Messages</em>
          </h1>
          <p className="admin-contact__sub">
            Messages submitted via the contact page.
          </p>
        </div>
        <div className="admin-contact__stats">
          <div className="admin-contact__stat">
            <span>{messages.length}</span> total
          </div>
          {unread > 0 && (
            <div className="admin-contact__stat admin-contact__stat--unread">
              <span>{unread}</span> unread
            </div>
          )}
        </div>
      </header>

      {loading ? (
        <p className="admin-dash__empty">Loading messages…</p>
      ) : messages.length === 0 ? (
        <p className="admin-dash__empty">No messages yet.</p>
      ) : (
        <div className="admin-contact__list">
          {messages.map((msg) => (
            <div key={msg._id}
              className={`admin-contact__item ${!msg.read ? 'admin-contact__item--unread' : ''} ${expanded === msg._id ? 'admin-contact__item--open' : ''}`}>

              {/* Summary row */}
              <button className="admin-contact__summary" onClick={() => handleOpen(msg)}>
                {!msg.read && <div className="admin-contact__unread-dot" />}
                <div className="admin-contact__sender">
                  <div className="admin-contact__sender-name">{msg.name}</div>
                  <div className="admin-contact__sender-email">{msg.email}</div>
                </div>
                <div className="admin-contact__subject">
                  {msg.subject || 'No subject'}
                </div>
                <div className="admin-contact__preview">
                  {msg.message.slice(0, 80)}{msg.message.length > 80 ? '…' : ''}
                </div>
                <div className="admin-contact__date">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </div>
                <div className="admin-contact__chevron">
                  {expanded === msg._id ? '▲' : '▼'}
                </div>
              </button>

              {/* Expanded body */}
              {expanded === msg._id && (
                <div className="admin-contact__body">
                  <div className="admin-contact__meta-row">
                    <div className="admin-contact__meta">
                      <span className="admin-contact__meta-label">From</span>
                      <span>{msg.name}</span>
                    </div>
                    <div className="admin-contact__meta">
                      <span className="admin-contact__meta-label">Email</span>
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </div>
                    {msg.phone && (
                      <div className="admin-contact__meta">
                        <span className="admin-contact__meta-label">Phone</span>
                        <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                      </div>
                    )}
                    <div className="admin-contact__meta">
                      <span className="admin-contact__meta-label">Subject</span>
                      <span>{msg.subject || '—'}</span>
                    </div>
                  </div>

                  <div className="admin-contact__message">{msg.message}</div>

                  <div className="admin-contact__actions">
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                      className="admin-pkg__save-btn admin-pkg__save-btn--dirty">
                      Reply via email →
                    </a>
                    <button
                      className="admin-pkg__reset-btn"
                      style={{ color: '#B0502E' }}
                      onClick={() => handleDelete(msg._id)}>
                      Delete message
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
