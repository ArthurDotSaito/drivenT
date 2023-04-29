import { notFoundError } from '@/errors';
import { noReserveError } from '@/errors/noReserve-error';
import bookingsRepository from '@/repositories/bookings-repository';

async function getUserBookings(userId: number) {
  const booking = await bookingsRepository.getUserBookings(userId);
  if (!booking) throw notFoundError();
  return booking;
}

const bookingsService = { getUserBookings };

export default bookingsService;
