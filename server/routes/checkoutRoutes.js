import express from 'express';
import { createCheckout } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/create-session', createCheckout);

export default router;
