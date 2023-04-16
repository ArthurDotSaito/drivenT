import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function findTicketByUserId(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(ticket: { ticketTypeId: number; enrollmentId: number }) {
  return await prisma.ticket.create({
    data: {
      ...ticket,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  findAllTicketTypes,
  findTicketByUserId,
  createTicket,
};

export default ticketsRepository;
