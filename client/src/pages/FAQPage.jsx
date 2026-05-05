import { useState } from 'react';

const FAQS = [
  {
    category: 'Ordering',
    items: [
      {
        q: 'How far in advance should I place my order?',
        a: 'We recommend booking at least 2 weeks in advance to guarantee availability, especially for weekends. For larger events (50+ guests), 3–4 weeks is ideal. We do accept last-minute orders based on availability — reach out via the contact page and we\'ll do our best.',
      },
      {
        q: 'What is the minimum order size?',
        a: 'For individual menu items, there is no minimum — you can order as little as one tray. For full catering packages, minimums vary by tier: the Gathering package requires 20 guests, and the Celebration package requires 30 guests.',
      },
      {
        q: 'Can I mix and match items from different packages?',
        a: 'Absolutely. Our À la Carte menu lets you build a custom spread from any of our dishes. For larger events, our Grand Feast package includes a fully custom menu consultation.',
      },
      {
        q: 'Do you accommodate dietary restrictions?',
        a: 'Yes — we offer vegetarian, gluten-free, and allergy-conscious options across all tiers. Please note your requirements in the Special Instructions field at checkout, or contact us directly so we can plan accordingly.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) as well as Apple Pay via our secure checkout. All payments are processed through Stripe.',
      },
      {
        q: 'What is the deposit policy?',
        a: 'You can choose to pay in full at checkout or place a 25% deposit to secure your booking. The remaining balance is due at the time of pickup. Deposits are non-refundable within 72 hours of the event date.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. We never store your card details on our servers. All payment processing is handled by Stripe, which is PCI-DSS Level 1 compliant — the highest level of security certification available.',
      },
    ],
  },
  {
    category: 'Pickup & Delivery',
    items: [
      {
        q: 'Do you offer delivery?',
        a: 'Currently all orders are pickup only. We are based in Long Island, New York and you\'ll select your preferred pickup time at checkout. We\'ll confirm the exact pickup address when we confirm your order.',
      },
      {
        q: 'How should I transport and store the food?',
        a: 'All food is packed in insulated containers. For best quality, food should be served within 2 hours of pickup. If you need to hold it longer, keep hot items in a 200°F oven and cold items refrigerated.',
      },
      {
        q: 'What if I need to change my pickup time?',
        a: 'Contact us as soon as possible and we\'ll do our best to accommodate. Changes made more than 24 hours before the event are usually no problem. Within 24 hours, changes are subject to availability.',
      },
    ],
  },
  {
    category: 'Food & Quality',
    items: [
      {
        q: 'Is everything made from scratch?',
        a: 'Yes — every dish is prepared fresh the morning of your event in our New York kitchen. We never use pre-made bases, frozen proteins, or reheated leftovers. Real ingredients, real recipes, every time.',
      },
      {
        q: 'Where do you source your ingredients?',
        a: 'We source from local suppliers wherever possible and prioritize fresh, seasonal ingredients. Our proteins are sourced from quality vendors and our produce is chosen for freshness over convenience.',
      },
      {
        q: 'How long does the food stay fresh?',
        a: 'Our food is best consumed within 4 hours of pickup when kept at proper temperature. Leftovers can be refrigerated for up to 2 days. We don\'t recommend freezing as it affects texture and quality.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq__item ${open ? 'faq__item--open' : ''}`}>
      <button className="faq__question" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <span className="faq__chevron">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq__answer">{a}</div>}
    </div>
  );
}

export default function FAQPage() {
  return (
    <section className="page page--narrow">
      <header className="page__header">
        <div className="page__folio">Help — FAQ</div>
        <h1 className="page__title">
          Frequently Asked <em>Questions</em>
        </h1>
        <p className="page__sub">
          Everything you need to know about ordering, payment, and pickup.
          Can't find your answer?{' '}
          <a href="/contact" style={{ color: 'var(--color-terracotta)' }}>
            Contact us directly →
          </a>
        </p>
      </header>

      <div className="faq__body">
        {FAQS.map((section) => (
          <div key={section.category} className="faq__section">
            <div className="faq__section-label">{section.category}</div>
            <div className="faq__list">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="faq__cta">
        <p>Still have a question?</p>
        <a href="/contact" className="btn-primary">
          Get in touch <span className="btn-primary__arrow">→</span>
        </a>
      </div>
    </section>
  );
}
