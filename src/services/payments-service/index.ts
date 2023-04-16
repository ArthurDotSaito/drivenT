import ticketsRepository from '@/repositories/tickets-repository';
import paymentsRepository from '@/repositories/payments-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, unauthorizedError } from '@/errors';

async function findPaymentById(payment: { userId: number; ticketId: number }) {
  const { userId, ticketId } = payment;

  const verifyTicketExistence = await ticketsRepository.findTicketById(ticketId);
  if (!verifyTicketExistence) throw notFoundError();

  const verifyEnrollment = await enrollmentRepository.findEnrollmentById(verifyTicketExistence.enrollmentId);
  if (!verifyEnrollment) throw unauthorizedError();
  if (verifyEnrollment.userId !== userId) throw unauthorizedError();

  const paymentResponse = await paymentsRepository.findPaymentsById(ticketId);
  return {
    id: paymentResponse.id,
    ticketId: paymentResponse.ticketId,
    value: paymentResponse.value,
    cardIssuer: paymentResponse.cardIssuer,
    cardLastDigits: paymentResponse.cardLastDigits,
    createdAt: paymentResponse.createdAt,
    updatedAt: paymentResponse.updatedAt,
  };
}

const paymentsService = {
  findPaymentById,
};

export default paymentsService;
