const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
  console.error('Erro na conexão com o Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conectado ao Redis com sucesso');
});

module.exports = redisClient;

