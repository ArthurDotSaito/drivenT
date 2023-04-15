import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicketByUserId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  findAllTicketTypes,
  findTicketByUserId,
};

export default ticketsRepository;
