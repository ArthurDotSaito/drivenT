import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function findTicketById(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: { id: ticketId },
  });
}

async function findTicketTypeById(ticketTypeId: number) {
  return await prisma.ticketType.findFirst({
    where: { id: ticketTypeId },
  });
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

async function updateToPaidStatusById(ticketId: number) {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: 'PAID',
    },
  });
}

const ticketsRepository = {
  findAllTicketTypes,
  findTicketByUserId,
  createTicket,
  findTicketById,
  findTicketTypeById,
  updateToPaidStatusById,
};

export default ticketsRepository;
