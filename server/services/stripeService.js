import Stripe from 'stripe';

let stripe = null;

function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export async function createCheckoutSession(cartItems, customerEmail) {
  const s = getStripe();
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : []
      },
      unit_amount: item.price
    },
    quantity: item.quantity || 1
  }));

  const session = await s.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success.html`,
    cancel_url: `${process.env.FRONTEND_URL}/carrito.html`,
    customer_email: customerEmail,
    metadata: {
      items: JSON.stringify(cartItems.map(item => ({ name: item.name, quantity: item.quantity || 1 })))
    }
  });

  return session;
}

export async function retrieveSession(sessionId) {
  return await getStripe().checkout.sessions.retrieve(sessionId);
}

export function constructWebhookEvent(payload, signature) {
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

export async function createPaymentIntent(amount, email, metadata) {
  return await getStripe().paymentIntents.create({
    amount,
    currency: 'eur',
    receipt_email: email,
    metadata
  });
}