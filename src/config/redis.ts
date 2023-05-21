import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const conectRedis = async () => await client.connect();

conectRedis();

export { client };
