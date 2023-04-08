import { ApplicationError } from '@/protocols';

export function cepFormatInvalid(): ApplicationError {
  return {
    name: 'CepFormatInvalidError',
    message: 'CEP must contain 8 digits',
  };
}
