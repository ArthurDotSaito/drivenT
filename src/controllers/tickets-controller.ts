import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getAllTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getAllTicketsTypes();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch {
    return res.status(httpStatus.NOT_FOUND);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  try {
    const userTicket = await ticketsService.getUserTicket(userId);
    if (!userTicket) throw new Error();

    return res.status(httpStatus.OK).send(userTicket);
  } catch {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as { ticketTypeId: number };
  const { userId } = req as { userId: number };
  try {
    const ticketCreated = await ticketsService.createTicket({ ticketTypeId, userId });
    if (!ticketCreated) throw new Error();

    return res.status(httpStatus.CREATED).send(ticketCreated);
  } catch {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
