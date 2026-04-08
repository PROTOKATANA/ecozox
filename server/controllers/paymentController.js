import { createPaymentIntent } from '../services/stripeService.js';

export async function createPaymentIntentHandler(req, res, next) {
  try {
    console.log('PaymentIntent request:', req.body);
    
    const { amount, email, items, shipping } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Missing amount' });
    }

    const intent = await createPaymentIntent(amount, email || 'customer@example.com', {
      items: JSON.stringify(items),
      shipping: JSON.stringify(shipping)
    });

    console.log('PaymentIntent created:', intent.id);

    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    next(error);
  }
}