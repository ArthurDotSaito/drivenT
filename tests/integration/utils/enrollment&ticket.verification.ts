import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypeRemote,
  createTicketTypeWithNoHotel,
  createUser,
} from '../../factories';
import { generateValidToken } from '../../helpers';
import app from '@/app';

const server = supertest(app);

export default function enrollmentAndTicketVerification(
  route: string,
  operation: 'get' | 'post' | 'put' | 'delete',
  body?: { roomId: number },
) {
  it('should respond with status 404 when user has no enrollment ', async () => {
    const token = await generateValidToken();

    const response = await server[operation](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when user have enrollment, however do not have a ticket ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server[operation](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 when user have a ticket, but it is not PAID ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();

    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server[operation](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 when user have a PAID ticket, but it is REMOTE ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server[operation](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it("should respond with status 403 when user's ticket does not includes hotel", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithNoHotel();

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server[operation](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });
}
