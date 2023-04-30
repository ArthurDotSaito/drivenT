import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from '../../factories';
import { generateValidToken } from '../../helpers';

export async function createCorrectProperties() {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketTypeWithHotel();
  await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  const hotel = await createHotel();

  return { user, token, enrollment, ticketType, hotel };
}
