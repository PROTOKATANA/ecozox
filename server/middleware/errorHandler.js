export default function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.type === 'StripeCardError' || err.type === 'StripeInvalidRequestError') {
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
