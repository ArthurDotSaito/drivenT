import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { MakePaymentType } from '@/types/makePaymentType';

async function findPaymentsById(ticketId: number): Promise<Payment> {
  return await prisma.payment.findFirst({
    where: { ticketId: ticketId },
  });
}

async function makePayment({ ticketId, cardData, price }: MakePaymentType & { price: number }) {
  return prisma.payment.create({
    data: {
      ticketId,
      value: price,
      cardIssuer: cardData.issuer,
      cardLastDigits: cardData.number.toString().slice(-4),
    },
  });
}

const paymentsRepository = {
  findPaymentsById,
  makePayment,
};

export default paymentsRepository;
