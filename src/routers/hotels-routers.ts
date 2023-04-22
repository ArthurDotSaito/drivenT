import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelsRoomsById } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('*/', authenticateToken);
hotelsRouter.get('/', getAllHotels);
hotelsRouter.get('/:hotelId', getHotelsRoomsById);

export { hotelsRouter };
