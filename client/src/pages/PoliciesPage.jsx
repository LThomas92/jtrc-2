export default function PoliciesPage() {
  return (
    <section className="page page--narrow">
      <header className="page__header">
        <div className="page__folio">Help — Policies</div>
        <h1 className="page__title">
          Our <em>Policies</em>
        </h1>
        <p className="page__sub">
          Last updated: January 1, 2025
        </p>
      </header>

      <div className="policy__body">

        <div className="policy__section">
          <h2 className="policy__heading">Cancellation & Refunds</h2>
          <p>We understand that plans change. Our cancellation policy is designed to be fair to both parties:</p>
          <ul className="policy__list">
            <li><strong>More than 7 days before the event:</strong> Full refund, including any deposit paid.</li>
            <li><strong>3–7 days before the event:</strong> 50% refund of the total order value. Deposits are non-refundable.</li>
            <li><strong>Less than 72 hours before the event:</strong> No refund. The full amount or deposit is forfeited as we will have already begun food preparation.</li>
            <li><strong>Same-day cancellations:</strong> No refund. All ingredients and labor costs are committed at this point.</li>
          </ul>
          <p>To cancel an order, contact us immediately via the contact page or by phone. Cancellations must be confirmed in writing.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Order Changes</h2>
          <p>We will accommodate order modifications whenever possible:</p>
          <ul className="policy__list">
            <li>Item additions or substitutions requested more than 48 hours before pickup are usually accommodated at no extra charge.</li>
            <li>Changes within 48 hours are subject to availability and may incur additional fees.</li>
            <li>Reductions in order size within 72 hours of the event are treated as partial cancellations under the cancellation policy above.</li>
          </ul>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Food Safety</h2>
          <p>All food is prepared in a licensed commercial kitchen following New York State Department of Health guidelines. We take food safety seriously:</p>
          <ul className="policy__list">
            <li>All staff hold current food handler certifications.</li>
            <li>Hot food is delivered or held at 140°F or above. Cold food is kept at 40°F or below.</li>
            <li>Once food leaves our possession, we cannot be held responsible for improper storage or handling by the customer.</li>
            <li>We recommend consuming all food within 4 hours of pickup when kept at proper serving temperature.</li>
          </ul>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Allergen Disclaimer</h2>
          <p>Our kitchen handles common allergens including tree nuts, peanuts, dairy, eggs, gluten, shellfish, and soy. While we take precautions for allergy requests, we cannot guarantee a completely allergen-free environment. Customers with severe allergies should contact us prior to ordering to discuss their specific needs.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Payment Policy</h2>
          <p>All prices are listed in USD. Payment is due at checkout unless a deposit option is selected. In the case of a deposit, the remaining balance is due at pickup. We reserve the right to cancel an order if the remaining balance is not settled prior to food handoff.</p>
        </div>

        <div className="policy__section">
          <h2 className="policy__heading">Contact</h2>
          <p>For policy questions or concerns, please reach out via our <a href="/contact">contact page</a>. We aim to respond within 24 hours.</p>
        </div>

      </div>
    </section>
  );
}
