import { prisma } from '@/config';
import { client } from '@/config/redis';

async function findFirst() {
  const eventRedis = await client.get('event');
  if (eventRedis) {
    return JSON.parse(eventRedis);
  }
  const value = await prisma.event.findFirst();
  await client.set('event', JSON.stringify(value));
  return value;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
