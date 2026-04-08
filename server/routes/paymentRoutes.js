import express from 'express';
import { createPaymentIntentHandler } from '../controllers/paymentController.js';

const router = express.Router();
router.post('/create-intent', createPaymentIntentHandler);

export default router;