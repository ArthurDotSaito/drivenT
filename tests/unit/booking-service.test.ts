import faker from '@faker-js/faker';
import { createMockBooking } from '../factories/booking-factory';
import bookingsRepository from '@/repositories/bookings-repository';
import bookingsService from '@/services/bookings-service';

describe('BookingService unit test suite', () => {
  describe('getUserBookings service', () => {
    it('Should return a user booking', async () => {
      const userId = faker.datatype.number({ min: 1, max: 30 });
      const booking = createMockBooking();

      jest.spyOn(bookingsRepository, 'getUserBookings').mockResolvedValueOnce(booking);

      const response = bookingsService.getUserBookings(userId);
      expect(response).toEqual(booking);
    });
  });
});
