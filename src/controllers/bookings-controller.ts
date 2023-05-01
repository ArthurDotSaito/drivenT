import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getUserBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = +req.userId;
  try {
    const { id, Room } = await bookingsService.getUserBookings(userId);
    return res.status(httpStatus.OK).send({ id, Room });
  } catch (error) {
    next(error);
  }
}

export async function createUserBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = +req.userId;
  const { roomId } = req.body as { roomId: number };
  try {
    const { id } = await bookingsService.createUserBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: id });
  } catch (error) {
    next(error);
  }
}

export async function updateUserBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = +req.userId;
  const { roomId } = req.body as { roomId: number };
  const { bookingId } = req.params;
  try {
    const updatedBooking = await bookingsService.updateUserBooking(userId, roomId, +bookingId);
    return res.status(httpStatus.OK).send({ bookingId: updatedBooking.id });
  } catch (error) {
    next(error);
  }
}
