import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);
/*
describe('GET /activities', () => {
    it('should respond with status 200 and a list of activities', async () => {
      const response = await server.get('/activities');

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: createdHotel.id,
          name: createdHotel.name,
          image: createdHotel.image,
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
        },
      ]);
    });
});
*/

import activitiesRepository from '@/repositories/activity-repository';

describe('GET /activities', () => {
  it('should respond with status 200 and a list of activities', async () => {
    jest.spyOn(activitiesRepository, 'getActivities').mockResolvedValue([
      {
        id: 1,
        name: 'Activity 1',
        location: 'MAIN',
        startsAt: 1622310000,
        endsAt: 1622313600,
        slots: 10,
        dateId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Activity 2',
        location: 'WORKSHOP',
        startsAt: 1622400000,
        endsAt: 1622403600,
        slots: 8,
        dateId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await server.get('/activities');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Activity 1', location: 'MAIN', startsAt: 1622310000, endsAt: 1622313600, slots: 10, dateId: 1 },
      {
        id: 2,
        name: 'Activity 2',
        location: 'WORKSHOP',
        startsAt: 1622400000,
        endsAt: 1622403600,
        slots: 8,
        dateId: 1,
      },
    ]);
  });

  it('should handle errors and pass them to the error handling middleware', async () => {
    jest.spyOn(activitiesRepository, 'getActivities').mockRejectedValue(new Error('Database connection error'));

    const response = await server.get('/activities');

    expect(response.status).toBe(500);
  });
});
