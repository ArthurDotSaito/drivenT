import { TicketType } from '@prisma/client';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  const ticketsTypes = await ticketsRepository.findAllTicketTypes();
  return ticketsTypes;
}

async function getUserTicket(userId: number) {
  const { id: enrollmentId } = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentId) throw notFoundError();
  const tickets = await ticketsRepository.findTicketByUserId(enrollmentId);

  return {
    id: tickets.id,
    status: tickets.status,
    ticketTypeId: tickets.ticketTypeId,
    enrollmentId: tickets.enrollmentId,
    TicketType: {
      id: tickets.TicketType.id,
      name: tickets.TicketType.name,
      price: tickets.TicketType.price,
      isRemote: tickets.TicketType.isRemote,
      includesHotel: tickets.TicketType.includesHotel,
      createdAt: tickets.TicketType.createdAt,
      updatedAt: tickets.TicketType.updatedAt,
    },
    createdAt: tickets.createdAt,
    updatedAt: tickets.updatedAt,
  };
}

const ticketsService = {
  getAllTicketsTypes,
  getUserTicket,
};

export default ticketsService;
