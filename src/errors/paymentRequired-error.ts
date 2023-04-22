import { ApplicationError } from '@/protocols';

export function paymentRequired(): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: 'Ticket must be paid to perform the action',
  };
}
