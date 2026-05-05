const STEPS = [
  {
    n: '01', title: 'Browse & Build', em: 'Build',
    desc: "Explore our full menu online. Add individual items to your basket, or pick a curated package that fits your event's size and style.",
    icon: '🧾',
  },
  {
    n: '02', title: 'Set Your Date', em: 'Date',
    desc: 'Choose your event date and delivery window. We confirm availability within 24 hours by email or text.',
    icon: '📅',
  },
  {
    n: '03', title: 'Checkout Securely', em: 'Securely',
    desc: 'Pay by card, Apple Pay, or split a deposit. Get instant confirmation and real-time order tracking from the kitchen.',
    icon: '💳',
  },
  {
    n: '04', title: 'We Show Up', em: 'Show Up',
    desc: 'JT and the team arrive on time with everything hot, fresh, and beautifully presented. You focus on your guests.',
    icon: '🍽️',
  },
];

export default function Process() {
  return (
    <section className="process">
      <div
        className="coffee-stain"
        style={{ top: 100, left: '6%', transform: 'rotate(-20deg)' }}
      />

      <div className="process__wrap">
        <aside className="process__left">
          <div className="process__folio">
            <strong>Ch. 05</strong>
            <span>How It Works</span>
          </div>
          <h2 className="process__heading">
            From click<br />
            to <em>catered</em>,<br />
            simply.
          </h2>
          <p className="process__sub">
            Four steps from your first click to our team serving your guests.
          </p>

          <div className="process__yield">
            <div className="process__yield-label">Recipe For Ordering</div>
            <div className="process__yield-time">≈ 10 minutes</div>
            <div className="process__yield-details">
              <div>4 steps<span>Process</span></div>
              <div>24hr<span>Confirmation</span></div>
            </div>
          </div>
        </aside>

        <div className="process__right">
          {STEPS.map((step) => (
            <div key={step.n} className="process__step">
              <div className="process__n">{step.n}</div>
              <div className="process__body">
                <h3 className="process__step-title">
                  {step.title.replace(step.em, '')}
                  <em>{step.em}</em>
                </h3>
                <p className="process__desc">{step.desc}</p>
              </div>
              <div className="process__icon">{step.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
