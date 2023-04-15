import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTicketsTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getAllTicketsTypes);

export { ticketsRouter };
