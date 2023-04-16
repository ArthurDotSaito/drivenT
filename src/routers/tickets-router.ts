import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, getAllTicketsTypes, getUserTicket } from '@/controllers/tickets-controller';
import { createTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getAllTicketsTypes);
ticketsRouter.get('/', getUserTicket);
ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
