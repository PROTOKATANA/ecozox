import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import checkoutRoutes from '../routes/checkoutRoutes.js';
import webhookRoutes from '../routes/webhookRoutes.js';
import paymentRoutes from '../routes/paymentRoutes.js';
import errorHandler from '../middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/webhooks', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payment', paymentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`EcoZox server running on port ${PORT}`);
});

export default app;
