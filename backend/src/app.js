const express = require('express');
const redisClient = require('./config/redis');
const dbPool = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Middleware para verificar a conexão com o Redis
app.use((req, res, next) => {
  if (!redisClient.status === 'ready') {
    return res.status(500).json({ error: 'Serviço Redis indisponível' });
  }
  next();
});

// Middleware para verificar a conexão com o banco de dados
app.use(async (req, res, next) => {
  try {
    const connection = await dbPool.getConnection();
    connection.release();
    next();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return res.status(500).json({ error: 'Serviço de banco de dados indisponível' });
  }
});

// Suas rotas e outros middlewares aqui

app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
