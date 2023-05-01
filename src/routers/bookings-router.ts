import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { createUserBooking, getUserBookings, updateUserBooking } from '@/controllers/bookings-controller';
import { ParamsRoomIdSchema, PostBookingIdSchema } from '@/schemas/bookings-schemas';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', getUserBookings);
bookingRouter.post('/', validateBody(PostBookingIdSchema), createUserBooking);
bookingRouter.put(
  '/:bookingId',
  validateBody(PostBookingIdSchema),
  validateParams(ParamsRoomIdSchema),
  updateUserBooking,
);

export { bookingRouter };
