import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getUserBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = +req.userId;
  try {
    const { id, Room } = await bookingsService.getUserBookings(userId);
    res.status(httpStatus.OK).send({ id, Room });
  } catch (error) {
    next(error);
  }
}
