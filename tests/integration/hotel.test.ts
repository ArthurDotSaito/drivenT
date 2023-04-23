import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotel, createHotelWithRooms, createRoom } from '../factories/hotel-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if token is invalid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('Should respond with status 404 when there is no enrollment', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 404 when ticket was not not found for given enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 402 when ticket is not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, 'RESERVED');

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when ticket not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: false,
        },
      });

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when ticket is to a remote event', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: false,
        },
      });

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 200', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const hotel = await createHotel();
      await createRoom(hotel.id);

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if token is invalid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('Should respond with status 404 when there is no enrollment', async () => {
      const { id } = await createHotelWithRooms();
      const token = generateValidToken();

      const response = await server.get(`/hotels/${id}`).set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 404 when ticket was not not found for given enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 402 when ticket is not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, 'RESERVED');

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when ticket not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: false,
        },
      });

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when ticket is to a remote event', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: false,
        },
      });

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 200', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      await createRoom(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});
