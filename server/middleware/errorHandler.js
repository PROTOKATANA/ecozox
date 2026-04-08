export default function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(400).json({
      error: 'Payment error',
      message: err.message
    });
  }

  if (err.type === 'StripeSignatureVerificationError') {
    return res.status(400).json({
      error: 'Invalid webhook signature'
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error'
  });
}
