import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
    include: { Room: true },
  });
}

export async function createMockBooking({
  userId = 1,
  roomId = 1,
  Room = { id: 1, name: 'random Room', capacity: 1, hotelId: 1 },
} = {}) {
  return {
    id: 1,
    userId,
    roomId,
    createdAt: new Date(),
    updatedAt: new Date(),
    Room: {
      ...Room,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}
