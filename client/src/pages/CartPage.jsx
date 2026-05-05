import { Link } from 'react-router-dom';
import { useCart } from '@store/useCart';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const total = subtotal();

  return (
    <section className="page">
      <header className="page__header">
        <div className="page__folio">Ch. 07 — Your Basket</div>
        <h1 className="page__title">
          Your <em>basket</em>
        </h1>
        <p className="page__sub">Review your order before checkout.</p>
      </header>

      {items.length === 0 ? (
        <div className="page__empty">
          <p style={{ marginBottom: '32px' }}>Your basket is empty.</p>
          <Link to="/menu" className="btn-primary">
            Browse the Menu <span className="btn-primary__arrow">→</span>
          </Link>
        </div>
      ) : (
        <div className="cart__content">
          <div className="cart__list">
            {items.map((item) => (
              <div key={item.id} className="cart__row">
                <div className="cart__emoji">{item.emoji || '🍽️'}</div>
                <div className="cart__info">
                  <div className="cart__name">{item.name}</div>
                  {item.variationNote && (
                    <div className="cart__variation-note">{item.variationNote}</div>
                  )}
                  <div className="cart__price">${Number(item.price).toFixed(2)} each</div>
                </div>
                <div className="cart__qty">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <div className="cart__line-total">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                <button
                  className="cart__remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <aside className="cart__summary">
            <div className="cart__summary-title">Order Summary</div>
            <div className="cart__summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart__summary-row">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="cart__summary-row cart__summary-row--total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="cart__checkout-btn">
              Proceed to Checkout <span>→</span>
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
