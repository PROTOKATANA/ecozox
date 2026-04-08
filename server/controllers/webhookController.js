import { constructWebhookEvent } from '../services/stripeService.js';
import { procesarPedidoDropshipping } from '../services/dropshippingService.js';

export async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['stripe-signature'];
    const event = constructWebhookEvent(req.body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const datosCliente = {
          customerEmail: session.customer_email,
          customerId: session.customer,
          paymentIntent: session.payment_intent,
          amountTotal: session.amount_total,
          currency: session.currency,
          metadata: session.metadata,
          sessionId: session.id
        };
        
        console.log('Checkout completado:', session.id);
        
        await procesarPedidoDropshipping(datosCliente);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}
