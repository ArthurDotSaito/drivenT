import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getUserBookings(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({
    where: { userId: userId },
    include: { Room: true },
  });
}

const bookingsRepository = {
  getUserBookings,
};

export default bookingsRepository;
