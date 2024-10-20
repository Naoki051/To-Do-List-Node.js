// Importações necessárias
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/tasks');
const redis = require('./services/redis');
const { Storage } = require('@google-cloud/storage');
const { initializeGoogleCloudStorage } = require('./services/googleCloudService');

// Inicialização do aplicativo Express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/tasks', taskRoutes);

// Configuração do Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Função de inicialização do servidor
async function startServer() {
  try {
    // Conexão com Redis
    await redis.connect();
    console.log('Conexão com Redis realizada com sucesso');
    
    // Inicialização do Google Cloud Storage
    await initializeGoogleCloudStorage();
    
    // Iniciar o servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Iniciar o servidor
startServer();
