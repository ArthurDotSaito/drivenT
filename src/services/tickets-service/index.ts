import { TicketType } from '@prisma/client';
import ticketsRepository from '@/repositories/tickets-repository';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  const ticketsTypes = await ticketsRepository.findAllTicketTypes();
  return ticketsTypes;
}

const ticketsService = {
  getAllTicketsTypes,
};

export default ticketsService;
