import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.business(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId: hotelId,
    },
  });
}

export async function createHotelWithRooms() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.business(),
      Rooms: {
        createMany: {
          data: {
            name: faker.name.findName(),
            capacity: parseInt(faker.random.numeric(2)),
          },
        },
      },
    },
    select: {
      id: true,
    },
  });
}
