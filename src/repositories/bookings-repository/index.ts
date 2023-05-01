import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getUserBookings(userId: number): Promise<Booking & { Room: Room }> {
  return await prisma.booking.findFirst({
    where: { userId: userId },
    include: { Room: true },
  });
}

async function getUserBookingsByUserId(userId: number): Promise<Booking> {
  return await prisma.booking.findFirst({
    where: { userId: userId },
  });
}

async function createUserBooking(userId: number, roomId: number): Promise<Booking> {
  return await prisma.booking.create({ data: { userId, roomId } });
}

async function getBookingRoom(roomId: number): Promise<Room & { Booking: Booking[] }> {
  return await prisma.room.findUnique({
    where: { id: roomId },
    include: { Booking: true },
  });
}

async function findBookingByRoomId(roomId: number) {
  return await prisma.booking.findFirst({
    where: {
      roomId: roomId,
    },
  });
}

async function updateUserBooking(userId: number, roomId: number, bookingId: number): Promise<Booking> {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId: roomId },
  });
}

const bookingsRepository = {
  getUserBookings,
  createUserBooking,
  getBookingRoom,
  updateUserBooking,
  findBookingByRoomId,
  getUserBookingsByUserId,
};

export default bookingsRepository;
