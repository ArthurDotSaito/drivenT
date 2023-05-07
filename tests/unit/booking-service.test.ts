import faker from '@faker-js/faker';
import { createMockBooking } from '../factories/booking-factory';
import bookingsRepository from '@/repositories/bookings-repository';
import bookingsService from '@/services/bookings-service';

describe('BookingService unit test suite', () => {
  describe('getUserBookings service', () => {
    it('Should return a user booking', async () => {
      const userId = faker.datatype.number({ min: 1, max: 30 });
      const booking = await createMockBooking();

      jest.spyOn(bookingsRepository, 'getUserBookings').mockResolvedValueOnce(booking);

      const response = await bookingsService.getUserBookings(userId);
      expect(response).toEqual(booking);
    });

    it('When booking does not exist: throw a NotFoundError', async () => {
      const userId = faker.datatype.number({ min: 1, max: 30 });

      jest.spyOn(bookingsRepository, 'getUserBookings').mockResolvedValueOnce(undefined);

      const response = bookingsService.getUserBookings(userId);
      console.log(response);
      expect(response).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
});
