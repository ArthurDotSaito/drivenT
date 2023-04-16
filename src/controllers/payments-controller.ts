import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { badRequestError } from '@/errors/badRequest-error';
import paymentsService from '@/services/payments-service';
import { MakePaymentType } from '@/types/makePaymentType';

export async function findPaymentById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const ticketId = Number(req.query.ticketId);

  try {
    if (!ticketId) throw badRequestError();

    const payment = await paymentsService.findPaymentById({ userId, ticketId });
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function makeTicketPayment(req: AuthenticatedRequest, res: Response) {
  const paymentLoad = req.body as MakePaymentType;
  const { userId } = req as { userId: number };

  try {
    const payment = await paymentsService.makePayment({ paymentLoad, userId });

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
