import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useCart } from '@store/useCart';
import { ordersAPI } from '@lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DEPOSIT_PERCENT = 0.25;

// ── Payment form — inside Elements context ──────────────
function PaymentForm({ orderId, chargedAmount, remainingAmount, paymentMode, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying,   setPaying]   = useState(false);
  const [ready,    setReady]    = useState(false); // ← tracks PaymentElement mount

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !ready) return;
    setPaying(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setPaying(false);
      return;
    }

    try {
      await ordersAPI.confirmPayment(orderId);
      onSuccess();
    } catch {
      toast.error('Payment confirmed but order update failed. Please contact us.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="checkout__payment-form">
      <div className="checkout__payment-summary">
        <div className="checkout__payment-row">
          <span>
            {paymentMode === 'deposit'
              ? `Deposit today (${DEPOSIT_PERCENT * 100}%)`
              : 'Total due now'}
          </span>
          <span className="checkout__payment-amount">
            ${chargedAmount.toFixed(2)}
          </span>
        </div>
        {paymentMode === 'deposit' && (
          <div className="checkout__payment-row checkout__payment-row--muted">
            <span>Remaining due at pickup</span>
            <span>${remainingAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* onReady fires when PaymentElement has fully mounted */}
      <PaymentElement
        onReady={() => setReady(true)}
        onLoadError={(e) => {
          console.error('Stripe load error:', e);
          toast.error('Payment form failed to load. Please refresh.');
        }}
      />

      {/* Loading hint while Stripe element mounts */}
      {!ready && (
        <div className="checkout__stripe-loading">
          <span className="checkout__pay-spinner" />
          <span>Loading payment form…</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !ready || paying}
        className="checkout__pay-btn"
      >
        {paying ? (
          <><span className="checkout__pay-spinner" /> Processing…</>
        ) : !ready ? (
          <><span className="checkout__pay-spinner" /> Loading…</>
        ) : (
          <>
            Pay ${chargedAmount.toFixed(2)}
            {paymentMode === 'deposit' && ' deposit'}
            <span>→</span>
          </>
        )}
      </button>
    </form>
  );
}

// ── Main checkout page ──────────────────────────────────
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [step,         setStep]         = useState('details');
  const [paymentMode,  setPaymentMode]  = useState('full');
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId,      setOrderId]      = useState(null);
  const [chargedAmt,   setChargedAmt]   = useState(0);
  const [remainingAmt, setRemainingAmt] = useState(0);
  const [submitting,   setSubmitting]   = useState(false);

  const total        = subtotal();
  const depositAmt   = Math.round(total * DEPOSIT_PERCENT * 100) / 100;
  const chargePreview = paymentMode === 'deposit' ? depositAmt : total;

  const [form, setForm] = useState({
    name:         '',
    phone:        '',
    eventDate:    '',
    eventTime:    '',
    instructions: '',
  });

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const eventDate = new Date(`${form.eventDate}T${form.eventTime || '12:00'}`);

    try {
      const res = await ordersAPI.create({
        customer: {
          name:         form.name,
          phone:        form.phone,
          eventDate:    eventDate.toISOString(),
          instructions: form.instructions,
        },
        items: items.map((i) => ({
          menuItemId: i.id,
          name:       i.name,
          price:      i.price,
          quantity:   i.qty,
        })),
        subtotal: total,
        paymentMode,
      });

      setClientSecret(res.data.clientSecret);
      setOrderId(res.data.order._id);
      setChargedAmt(res.data.chargedAmount);
      setRemainingAmt(res.data.remainingAmount);
      setStep('payment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = () => {
    clear();
    setStep('success');
  };

  // ── Success ─────────────────────────────────────────
  if (step === 'success') {
    return (
      <section className="checkout__success">
        <div className="checkout__success-icon">✓</div>
        <div className="checkout__success-folio">Order Confirmed</div>
        <h1 className="checkout__success-title">
          We'll see you <em>soon</em>
        </h1>
        <p className="checkout__success-sub">
          {paymentMode === 'deposit'
            ? `Your 25% deposit of $${chargedAmt.toFixed(2)} has been received. The remaining $${remainingAmt.toFixed(2)} is due at pickup.`
            : `Your payment of $${chargedAmt.toFixed(2)} has been received.`}
          <br />
          Jessica will be in touch to confirm your pickup details.
        </p>
        <button className="checkout__success-btn" onClick={() => navigate('/')}>
          Back to Home <span>→</span>
        </button>
      </section>
    );
  }

  return (
    <section className="page page--narrow">
      <header className="page__header">
        <div className="page__folio">
          {step === 'details' ? 'Ch. 08 — Your Details' : 'Ch. 08 — Payment'}
        </div>
        <h1 className="page__title">
          {step === 'details' ? <>Almost <em>there</em></> : <>Secure <em>checkout</em></>}
        </h1>
      </header>

      {/* Progress */}
      <div className="checkout__steps">
        <div className={`checkout__step ${step === 'details' ? 'checkout__step--active' : 'checkout__step--done'}`}>
          <span className="checkout__step-num">01</span>
          <span className="checkout__step-label">Your Details</span>
        </div>
        <div className="checkout__step-line" />
        <div className={`checkout__step ${step === 'payment' ? 'checkout__step--active' : ''}`}>
          <span className="checkout__step-num">02</span>
          <span className="checkout__step-label">Payment</span>
        </div>
      </div>

      {/* ── Step 1: Details ─────────────────────────── */}
      {step === 'details' && (
        <div className="checkout__layout">
          <form className="checkout__form" onSubmit={handleDetailsSubmit}>

            <div className="checkout__section">
              <h2 className="checkout__section-title">Pickup Details</h2>
              <div className="checkout__grid">

                <label className="checkout__field checkout__field--full">
                  <span>Your Name</span>
                  <input required placeholder="Full name"
                    value={form.name} onChange={set('name')} />
                </label>

                <label className="checkout__field checkout__field--full">
                  <span>Phone Number</span>
                  <input required type="tel" placeholder="(555) 000-0000"
                    value={form.phone} onChange={set('phone')} />
                </label>

                <label className="checkout__field">
                  <span>Event Date</span>
                  <input required type="date"
                    value={form.eventDate} onChange={set('eventDate')}
                    min={new Date().toISOString().split('T')[0]} />
                </label>

                <label className="checkout__field">
                  <span>Pickup Time</span>
                  <input required type="time"
                    value={form.eventTime} onChange={set('eventTime')} />
                </label>

                <label className="checkout__field checkout__field--full">
                  <span>Special Instructions <em>(optional)</em></span>
                  <textarea rows={3}
                    placeholder="Allergies, special requests, anything we should know…"
                    value={form.instructions} onChange={set('instructions')} />
                </label>

              </div>
            </div>

            {/* Payment mode */}
            <div className="checkout__section">
              <h2 className="checkout__section-title">Payment Option</h2>
              <div className="checkout__payment-modes">

                <button type="button"
                  className={`checkout__mode-card ${paymentMode === 'full' ? 'checkout__mode-card--active' : ''}`}
                  onClick={() => setPaymentMode('full')}>
                  <div className="checkout__mode-icon">💳</div>
                  <div className="checkout__mode-body">
                    <div className="checkout__mode-title">Pay in Full</div>
                    <div className="checkout__mode-desc">Pay the full ${total.toFixed(2)} today</div>
                  </div>
                  <div className="checkout__mode-amount">${total.toFixed(2)}</div>
                </button>

                <button type="button"
                  className={`checkout__mode-card ${paymentMode === 'deposit' ? 'checkout__mode-card--active' : ''}`}
                  onClick={() => setPaymentMode('deposit')}>
                  <div className="checkout__mode-icon">🤝</div>
                  <div className="checkout__mode-body">
                    <div className="checkout__mode-title">Pay 25% Deposit</div>
                    <div className="checkout__mode-desc">
                      ${depositAmt.toFixed(2)} now · ${(total - depositAmt).toFixed(2)} at pickup
                    </div>
                  </div>
                  <div className="checkout__mode-amount">${depositAmt.toFixed(2)}</div>
                </button>

              </div>
            </div>

            <button type="submit" disabled={submitting || items.length === 0}
              className="checkout__submit">
              {submitting ? 'Creating order…' : 'Continue to Payment →'}
            </button>
          </form>

          {/* Summary */}
          <aside className="checkout__summary">
            <div className="checkout__summary-title">Order Summary</div>
            <div className="checkout__summary-items">
              {items.map((item) => (
                <div key={item.id} className="checkout__summary-row">
                  <span className="checkout__summary-qty">{item.qty}×</span>
                  <span className="checkout__summary-name">{item.name}</span>
                  <span className="checkout__summary-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout__summary-divider" />
            <div className="checkout__summary-total-row">
              <span>Order Total</span>
              <span className="checkout__summary-total">${total.toFixed(2)}</span>
            </div>
            <div className="checkout__summary-charge-row">
              <span>Due today</span>
              <span className="checkout__summary-charge">${chargePreview.toFixed(2)}</span>
            </div>
            <div className="checkout__pickup-badge"><span>🥡</span> Pickup order</div>
          </aside>
        </div>
      )}

      {/* ── Step 2: Payment ─────────────────────────── */}
      {step === 'payment' && clientSecret && (
        <div className="checkout__layout">
          <div className="checkout__section">
            <h2 className="checkout__section-title">Card Details</h2>

            {/* Elements must wrap PaymentForm — clientSecret unlocks it */}
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'flat',
                  variables: {
                    colorPrimary:    '#B0502E',
                    colorBackground: '#ECE2CD',
                    colorText:       '#1C1811',
                    colorDanger:     '#B0502E',
                    fontFamily:      'EB Garamond, Georgia, serif',
                    borderRadius:    '0px',
                  },
                },
              }}
            >
              <PaymentForm
                orderId={orderId}
                chargedAmount={chargedAmt}
                remainingAmount={remainingAmt}
                paymentMode={paymentMode}
                onSuccess={handleSuccess}
              />
            </Elements>

            <button className="checkout__back-btn" onClick={() => setStep('details')}>
              ← Back to details
            </button>
          </div>

          <aside className="checkout__summary">
            <div className="checkout__summary-title">Order Summary</div>
            <div className="checkout__summary-items">
              {items.map((item) => (
                <div key={item.id} className="checkout__summary-row">
                  <span className="checkout__summary-qty">{item.qty}×</span>
                  <span className="checkout__summary-name">{item.name}</span>
                  <span className="checkout__summary-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout__summary-divider" />
            <div className="checkout__summary-total-row">
              <span>Order Total</span>
              <span className="checkout__summary-total">${total.toFixed(2)}</span>
            </div>
            <div className="checkout__summary-charge-row">
              <span>Charging today</span>
              <span className="checkout__summary-charge">${chargedAmt.toFixed(2)}</span>
            </div>
            {paymentMode === 'deposit' && (
              <div className="checkout__summary-remaining-row">
                <span>Due at pickup</span>
                <span>${remainingAmt.toFixed(2)}</span>
              </div>
            )}
            <div className="checkout__pickup-badge"><span>🥡</span> Pickup order</div>
          </aside>
        </div>
      )}
    </section>
  );
}
