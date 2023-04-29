import { ApplicationError } from '@/protocols';

export function noReserveError(): ApplicationError {
  return {
    name: 'noReserveError',
    message: 'Current user do not have a booking',
  };
}
