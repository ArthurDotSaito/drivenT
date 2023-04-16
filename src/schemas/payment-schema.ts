import Joi from 'joi';
import { MakePaymentType } from '@/types/makePaymentType';

export const makePaymentSchema = Joi.object<MakePaymentType>({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required(),
});
