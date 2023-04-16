import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { findPaymentById } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);
paymentsRouter.get('/', findPaymentById);

export { paymentsRouter };
