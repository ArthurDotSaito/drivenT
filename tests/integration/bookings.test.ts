import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { createRoom, createRoomWithCapacity } from '../factories/hotel-factory';
import { createBooking } from '../factories/booking-factory';
import tokenVerification from './utils/token-verificaton';
import enrollmentAndTicketVerification from './utils/enrollment&ticket.verification';
import { createCorrectProperties } from './utils/createProperties';
import bodyAndRoomVerification from './utils/bodyAndRoom.verification';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  tokenVerification('/booking', 'get');
  describe('When token is valid', () => {
    it('No booking found: Should respond with status 404 if there is no booking to current user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('Booking found: Should respond with status 200', async () => {
      const properties = await createCorrectProperties();
      const room = await createRoom(properties.hotel.id);
      const booking = await createBooking(properties.user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${properties.token}`);
      expect(response.status).toEqual(httpStatus.OK);
    });

    it('Booking found: Should respond with correct booking data', async () => {
      const properties = await createCorrectProperties();
      const room = await createRoom(properties.hotel.id);
      const booking = await createBooking(properties.user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${properties.token}`);
      expect(response.body).toEqual({
        id: booking.id,
        Room: { ...room, createdAt: room.createdAt.toISOString(), updatedAt: room.updatedAt.toISOString() },
      });
    });
  });
});

describe('POST /booking', () => {
  tokenVerification('/booking', 'post');

  describe('when token is valid', () => {
    enrollmentAndTicketVerification('/booking', 'post', { roomId: 1 });
    bodyAndRoomVerification('/booking', 'post');

    it('PASS: Should respond with status 200 if everything is fine', async () => {
      const properties = await createCorrectProperties();
      const room = await createRoomWithCapacity(properties.hotel.id, 2); //should change this, if the database becomes 1:N
      await createBooking(properties.user.id, room.id);

      const response = await server
        .post('/booking')
        .send({ roomId: room.id })
        .set('Authorization', `Bearer ${properties.token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });

    it('PASS: Should respond with correct bookingId if everything is fine', async () => {
      const properties = await createCorrectProperties();
      const room = await createRoomWithCapacity(properties.hotel.id, 2); //should change this, if the database becomes 1:N
      await createBooking(properties.user.id, room.id);

      const response = await server
        .post('/booking')
        .send({ roomId: room.id })
        .set('Authorization', `Bearer ${properties.token}`);

      expect(response.body).toMatchObject({ bookingId: expect.any(Number) });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  tokenVerification('/booking/1', 'put');

  describe('when token is valid', () => {
    enrollmentAndTicketVerification('/booking/1', 'put', { roomId: 1 });

    it('Should respond with status 400 if wrong type is passed to params (bookingId)', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .put(`/booking/${faker.word.verb()}`)
        .send({ roomId: 1 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    bodyAndRoomVerification('/booking/1', 'put');

    it('Should respond with status 403 if user does not have a booking', async () => {
      const properties = await createCorrectProperties();
      const room = await createRoom(properties.hotel.id); //should change this, if the database becomes 1:N

      const response = await server
        .put(`/booking/1`)
        .send({ roomId: 1 })
        .set('Authorization', `Bearer ${properties.token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});
