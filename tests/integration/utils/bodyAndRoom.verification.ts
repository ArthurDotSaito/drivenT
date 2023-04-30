import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createUser } from '../../factories';
import { generateValidToken } from '../../helpers';
import { createRoom, createRoomWithCapacity } from '../../factories/hotel-factory';
import { createBooking } from '../../factories/booking-factory';
import { createCorrectProperties } from './createProperties';
import app from '@/app';

const server = supertest(app);

export default function bodyAndRoomVerification(route: string, operation: 'get' | 'post' | 'put' | 'delete') {
  it('Body Error: Should respond with status 400 if no body was given', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server[operation](`${route}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('Body Error: Should respond with status 400 if wrong body was given', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server[operation](`${route}`).send({ id: 1 }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('Body Error: Should respond with status 400 if wrong body type was given', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server[operation](`${route}`)
      .send({ roomId: faker.word.verb() })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('No roomId: Should respond with status 404 if roomId does not exist', async () => {
    const properties = await createCorrectProperties();
    const room = await createRoom(properties.hotel.id);

    const response = await server[operation](`${route}`)
      .send({ roomId: room.id + 1 })
      .set('Authorization', `Bearer ${properties.token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('No room capacity: Should respond with status 403 if room capacity is full', async () => {
    const properties = await createCorrectProperties();
    const room = await createRoomWithCapacity(properties.hotel.id, 0);
    await createBooking(properties.user.id, room.id);

    const response = await server[operation](`${route}`)
      .send({ roomId: room.id })
      .set('Authorization', `Bearer ${properties.token}`);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });
}
