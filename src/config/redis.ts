import Radis from 'ioredis';

export const redisClient  = new Radis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
})
redisClient.on('connect', () => {
    console.log('Redis client connected');
});
redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});