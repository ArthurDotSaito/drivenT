import Joi from 'joi';

export const createTicketSchema = Joi.object<{ ticketTypeId: number }>({
  ticketTypeId: Joi.number().required(),
});
