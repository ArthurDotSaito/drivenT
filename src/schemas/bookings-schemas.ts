import Joi from 'joi';
import { BookingIdQueryParam, RoomIdFromBooking } from '@/protocols';

export const ParamsRoomIdSchema = Joi.object<BookingIdQueryParam>({
  bookingId: Joi.number().required(),
});

export const PostBookingIdSchema = Joi.object<RoomIdFromBooking>({
  roomId: Joi.number().required(),
});
