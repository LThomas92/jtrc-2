import { useState } from 'react';
import { contactAPI } from '@lib/api';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'General Inquiry',
  'Catering Quote',
  'Event Planning',
  'Package Question',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactAPI.send(form);
      setSent(true);
    } catch {
      toast.error('Could not send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="contact__success">
        <div className="contact__success-icon">✉</div>
        <div className="contact__success-folio">Message received</div>
        <h1 className="contact__success-title">
          We'll be in <em>touch</em>
        </h1>
        <p className="contact__success-sub">
          Thanks for reaching out, {form.name.split(' ')[0]}. JT personally
          reviews every message and will get back to you within 24 hours.
        </p>
        <button className="contact__success-btn" onClick={() => { setForm({ name:'',email:'',phone:'',subject:'',message:'' }); setSent(false); }}>
          Send another message <span>→</span>
        </button>
      </section>
    );
  }

  return (
    <section className="page page--narrow">
      <header className="page__header">
        <div className="page__folio">Ch. 09 — Contact</div>
        <h1 className="page__title">
          Let's talk <em>food</em>
        </h1>
        <p className="page__sub">
          Whether it's a question about packages, a custom menu, or just
          saying hello — we'd love to hear from you.
        </p>
      </header>

      <div className="contact__layout">
        <form className="contact__form" onSubmit={handleSubmit}>

          <div className="contact__grid">
            <label className="contact__field">
              <span>Your Name</span>
              <input required placeholder="Full name"
                value={form.name} onChange={set('name')} />
            </label>

            <label className="contact__field">
              <span>Email Address</span>
              <input required type="email" placeholder="you@example.com"
                value={form.email} onChange={set('email')} />
            </label>

            <label className="contact__field">
              <span>Phone <em>(optional)</em></span>
              <input type="tel" placeholder="(555) 000-0000"
                value={form.phone} onChange={set('phone')} />
            </label>

            <label className="contact__field">
              <span>Subject</span>
              <select value={form.subject} onChange={set('subject')}>
                <option value="">Select a topic…</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="contact__field contact__field--full">
              <span>Message</span>
              <textarea required rows={6}
                placeholder="Tell us about your event, guest count, date, or anything else on your mind…"
                value={form.message} onChange={set('message')} />
            </label>
          </div>

          <button type="submit" disabled={sending} className="contact__submit">
            {sending ? 'Sending…' : <>Send Message <span>→</span></>}
          </button>
        </form>

        {/* Info sidebar */}
        <aside className="contact__info">
          <div className="contact__info-block">
            <div className="contact__info-label">Based in</div>
            <div className="contact__info-value">Long Island, New York</div>
          </div>
          <div className="contact__info-block">
            <div className="contact__info-label">Serving</div>
            <div className="contact__info-value">NYC & Long Island area</div>
          </div>
          <div className="contact__info-block">
            <div className="contact__info-label">Response time</div>
            <div className="contact__info-value">Within 24 hours</div>
          </div>
          <div className="contact__info-block">
            <div className="contact__info-label">For urgent inquiries</div>
            <div className="contact__info-value">
              Use the Order Now button to start a booking directly.
            </div>
          </div>
          <a href="/packages" className="contact__pkg-link">
            <span>View Catering Packages</span>
            <span>→</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
