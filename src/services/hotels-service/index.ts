import { Hotel, Room } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { paymentRequired } from '@/errors/paymentRequired-error';

async function getAllHotels(userId: number): Promise<Hotel[]> {
  const verifyEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!verifyEnrollment) throw notFoundError();

  const verifyTicket = await ticketsRepository.findTicketByEnrollmentId(verifyEnrollment.id);
  if (!verifyTicket) throw notFoundError();

  if (verifyTicket.status === 'RESERVED' || verifyTicket.TicketType.includesHotel || verifyTicket.TicketType.isRemote)
    throw paymentRequired();

  const hotel = await hotelsRepository.getAllHotels();
  if (hotel.length === 0) throw notFoundError();
  return hotel;
}

async function getHotelsRoomsById(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  const verifyEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!verifyEnrollment) throw notFoundError();

  const verifyTicket = await ticketsRepository.findTicketByEnrollmentId(verifyEnrollment.id);
  if (!verifyTicket) throw notFoundError();

  if (verifyTicket.status === 'RESERVED' || verifyTicket.TicketType.includesHotel || verifyTicket.TicketType.isRemote)
    throw paymentRequired();

  const hotelRooms = await hotelsRepository.getHotelsRoomsById(hotelId);
  if (!hotelRooms) throw notFoundError();

  return hotelRooms;
}

const hotelService = {
  getAllHotels,
  getHotelsRoomsById,
};

export default hotelService;
