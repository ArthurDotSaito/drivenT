import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findPaymentsById(ticketId: number): Promise<Payment> {
  return await prisma.payment.findFirst({
    where: { ticketId: ticketId },
  });
}

const paymentsRepository = {
  findPaymentsById,
};

export default paymentsRepository;
