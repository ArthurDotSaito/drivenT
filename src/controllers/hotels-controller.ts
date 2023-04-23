import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotels-service';
import { badRequestError } from '@/errors/badRequest-error';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const hotels = await hotelService.getAllHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelsRoomsById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const hotelId = +req.params.hotelId;
    if (isNaN(hotelId)) throw badRequestError();

    const hotelRoom = await hotelService.getHotelsRoomsById(userId, hotelId);
    return res.status(httpStatus.OK).send(hotelRoom);
  } catch (error) {
    next(error);
  }
}
