import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingsRepository from '@/repositories/bookings-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  return;
}

async function checkRoomAndCapacity(roomId: number) {
  const room = await bookingsRepository.getBookingRoom(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw forbiddenError();
}

async function getUserBookings(userId: number) {
  const booking = await bookingsRepository.getUserBookings(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function createUserBooking(userId: number, roomId: number) {
  await checkEnrollmentAndTicket(userId);
  await checkRoomAndCapacity(roomId);

  const booking = await bookingsRepository.createUserBooking(userId, roomId);
  return booking;
}

async function updateUserBooking(userId: number, roomId: number, bookingId: number) {
  await checkEnrollmentAndTicket(userId);
  await checkRoomAndCapacity(roomId);

  const checkIfRoomIsAlreadyBooked = await bookingsRepository.findBookingByRoomId(roomId);
  if (checkIfRoomIsAlreadyBooked) throw forbiddenError();

  const booking = await bookingsRepository.getUserBookingsByUserId(userId);
  if (!booking || booking.id !== bookingId) throw forbiddenError();

  return await bookingsRepository.updateUserBooking(userId, roomId, bookingId);
}

const bookingsService = {
  getUserBookings,
  createUserBooking,
  updateUserBooking,
};

export default bookingsService;
