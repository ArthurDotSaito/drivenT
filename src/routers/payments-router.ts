import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { findPaymentById, makeTicketPayment } from '@/controllers/payments-controller';
import { makePaymentSchema } from '@/schemas/payment-schema';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);
paymentsRouter.get('/', findPaymentById);
paymentsRouter.post('/process', validateBody(makePaymentSchema), makeTicketPayment);

export { paymentsRouter };
