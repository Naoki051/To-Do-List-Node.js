// Importa o módulo Redis e configura as variáveis de ambiente
const Redis = require('ioredis');
require('dotenv').config();

// Cria uma instância do cliente Redis com as configurações
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Trata erros de conexão
redisClient.on('error', (err) => {
  console.error('Erro na conexão com o Redis:', err);
});

// Confirma conexão bem-sucedida
redisClient.on('connect', () => {
  console.log('Conectado ao Redis com sucesso');
});

// Exporta o cliente Redis para uso em outros módulos
module.exports = redisClient;
