import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getUserBookings } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', getUserBookings);

export { bookingRouter };
