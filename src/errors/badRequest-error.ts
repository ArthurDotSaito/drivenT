import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'BadRequestError',
    message: 'Error: BadRequest',
  };
}
