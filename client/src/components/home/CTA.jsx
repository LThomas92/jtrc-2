export default function CTA() {
  return (
    <section className="cta">
      <div className="cta__flap" />
      <div className="cta__inner">
        <div className="cta__folio">Ready to book?</div>
        <h2 className="cta__heading">
          Let's make your event<br />
          <span className="cta__script">unforgettable</span>.
        </h2>
        <p className="cta__sub">
          Start your order online, select a package, or reach out for a fully
          custom quote. We'll handle the rest — with love, of course.
        </p>
        <div className="cta__btns">
          <a href="/menu" className="cta__primary">
            Start Your Order
            <span className="cta__arrow">→</span>
          </a>
          <a href="/contact" className="cta__ghost">
            Request Custom Quote
          </a>
        </div>
        <div className="cta__signature">
          <div className="cta__sig-text">— Chef JT</div>
          <div className="cta__sig-label">Founder &amp; Head Chef</div>
        </div>
      </div>
    </section>
  );
}
