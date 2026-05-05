# Patch 25 — Cloudinary + Stripe + Pickup Checkout

## Files
server/src/middleware/cloudinary.js    ← NEW  replaces upload.js
server/src/controllers/menuController.js ← REPLACE
server/src/controllers/ordersController.js ← REPLACE
server/src/routes/menu.js              ← REPLACE
server/src/routes/orders.js            ← REPLACE
server/src/models/Order.js             ← REPLACE
client/src/pages/CheckoutPage.jsx      ← REPLACE
client/src/styles/pages/_checkout.scss ← REPLACE
client/src/lib/api.snippet.js          ← copy ordersAPI block into api.js

---

## 1. Install new packages

### Server
cd server
npm install cloudinary stripe

### Client
cd client
npm install @stripe/react-stripe-js @stripe/stripe-js

---

## 2. Cloudinary setup
1. Sign up free at https://cloudinary.com
2. Dashboard → Settings → API Keys → copy Cloud Name, API Key, API Secret
3. Add to server/.env:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

---

## 3. Stripe setup
1. Sign up at https://stripe.com (use Test mode)
2. Developers → API Keys → copy Publishable key + Secret key
3. Add to server/.env:

STRIPE_SECRET_KEY=sk_test_...

4. Add to client/.env:

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

---

## 4. api.js — replace ordersAPI with:

export const ordersAPI = {
  create:         (data)       => api.post('/orders', data),
  confirmPayment: (id)         => api.post(`/orders/${id}/confirm-payment`),
  getMine:        ()           => api.get('/orders/mine'),
  getAll:         ()           => api.get('/orders'),
  getOne:         (id)         => api.get(`/orders/${id}`),
  updateStatus:   (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

---

## 5. main.scss — _checkout.scss is already imported, no change needed

---

## Notes
- Cloudinary replaces the local /uploads folder entirely. New images go to Cloudinary CDN.
- Old images in MongoDB with /uploads/ paths will still show via the static server until you re-upload them.
- Stripe is in TEST mode. Use card 4242 4242 4242 4242, any future date, any CVC.
- Deposit is locked at 25%. Change DEPOSIT_PERCENT in ordersController.js + CheckoutPage.jsx to adjust.
