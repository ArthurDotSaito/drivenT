import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getUserBookings(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({
    where: { userId: userId },
    include: { Room: true },
  });
}

async function createUserBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function getBookingRoom(roomId: number): Promise<Room & { Booking: Booking[] }> {
  return prisma.room.findUnique({
    where: { id: roomId },
    include: { Booking: true },
  });
}

async function updateUserBooking(userId: number, roomId: number, bookingId: number): Promise<Booking> {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { userId, roomId },
  });
}

const bookingsRepository = {
  getUserBookings,
  createUserBooking,
  getBookingRoom,
  updateUserBooking,
};

export default bookingsRepository;
