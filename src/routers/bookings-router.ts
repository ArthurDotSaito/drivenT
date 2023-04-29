import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createUserBooking, getUserBookings } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', getUserBookings);
bookingRouter.post('/', createUserBooking);

export { bookingRouter };
