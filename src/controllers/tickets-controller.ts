import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';

export async function getAllTicketsTypes(req: Request, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getAllTicketsTypes();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch {
    return res.status(httpStatus.NOT_FOUND);
  }
}
