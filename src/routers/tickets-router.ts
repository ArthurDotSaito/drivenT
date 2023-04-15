import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTicketsTypes, getUserTicket } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getAllTicketsTypes);
ticketsRouter.get('/', getUserTicket);

export { ticketsRouter };
