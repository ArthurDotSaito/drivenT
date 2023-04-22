import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getAllHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function getHotelsRoomsById(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findFirst({
    where: { id: hotelId },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getAllHotels,
  getHotelsRoomsById,
};

export default hotelsRepository;
