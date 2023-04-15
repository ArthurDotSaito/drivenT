import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

const ticketsRepository = {
  findAllTicketTypes,
};

export default ticketsRepository;
