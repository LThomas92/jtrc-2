export default function PrivacyPage() {
  return (
    <section className="page page--narrow">
      <header className="page__header">
        <div className="page__folio">Help — Privacy</div>
        <h1 className="page__title">
          Privacy <em>Policy</em>
        </h1>
        <p className="page__sub">Last updated: January 1, 2025</p>
      </header>

      <div className="policy__body">

        <div className="policy__section">
          <h2 className="policy__heading">Information We Collect</h2>
          <p>When you place an order or contact us, we collect the following information:</p>
          <ul className="policy__list">
            <li><strong>Order information:</strong> Name, phone number, event date, and special instructions.</li>
            <li><strong>Payment information:</strong> Processed securely by Stripe. We never see or store your full card number.</li>
            <li><strong>Contact form submissions:</strong> Name, email, phone, and message content.</li>
            <li><strong>Usage data:</strong> Standard web analytics including pages visited and browser type, collected anonymously.</li>
          </ul>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">How We Use Your Information</h2>
          <p>We use the information we collect solely to:</p>
          <ul className="policy__list">
            <li>Process and fulfill your catering orders.</li>
            <li>Communicate with you about your order, including pickup confirmation and changes.</li>
            <li>Respond to inquiries submitted via our contact form.</li>
            <li>Improve our website and services through aggregated, anonymous analytics.</li>
          </ul>
          <p>We do not use your information for advertising, and we do not sell or rent your personal data to any third party under any circumstances.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Data Sharing</h2>
          <p>We only share your information with trusted service providers necessary to operate our business:</p>
          <ul className="policy__list">
            <li><strong>Stripe:</strong> Payment processing. Subject to Stripe's own privacy policy.</li>
            <li><strong>Cloudinary:</strong> Image storage for menu and site content. No customer data is stored here.</li>
            <li><strong>MongoDB Atlas:</strong> Secure cloud database hosting for order and contact records.</li>
          </ul>
          <p>All third-party providers are contractually required to protect your data and may not use it for their own purposes.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Data Retention</h2>
          <p>Order records are retained for up to 2 years for accounting and legal compliance purposes. Contact form submissions are retained for 12 months. You may request deletion of your data at any time by contacting us directly.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Cookies</h2>
          <p>Our website uses minimal cookies necessary for functionality — specifically, a session token to keep you logged in to the admin portal. We do not use tracking cookies or third-party advertising cookies.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Your Rights</h2>
          <p>You have the right to request access to, correction of, or deletion of any personal data we hold about you. To make a request, contact us via our <a href="/contact">contact page</a>. We will respond within 30 days.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Contact</h2>
          <p>For privacy-related questions, please contact us via our <a href="/contact">contact page</a>.</p>
        </div>

      </div>
    </section>
  );
}
