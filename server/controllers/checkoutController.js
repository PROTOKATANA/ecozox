import { createCheckoutSession } from '../services/stripeService.js';

export async function createCheckout(req, res, next) {
  try {
    const { items, email } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }

    const validItems = items.filter(item => item.name && item.price > 0);
    
    if (validItems.length === 0) {
      return res.status(400).json({ error: 'No valid items in cart' });
    }

    // Convertir precio a céntimos (el frontend envía en euros)
    const itemsInCents = validItems.map(item => ({
      ...item,
      price: Math.round(item.price * 100)
    }));

    const session = await createCheckoutSession(itemsInCents, email);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
}
