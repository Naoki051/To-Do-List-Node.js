// Importa a classe Storage do pacote @google-cloud/storage
const { Storage } = require('@google-cloud/storage');

// Cria uma instância do Storage com as credenciais e ID do projeto
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Nome do bucket do Google Cloud Storage
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

// Função para inicializar a conexão com o Google Cloud Storage
async function initializeGoogleCloudStorage() {
  console.log('Tentando conectar ao Google Cloud Storage...');
  try {
    await storage.getBuckets();
    console.log('Conexão com o Google Cloud Storage estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao Google Cloud Storage:', error);
  }
}

// Função para fazer upload de um arquivo para o Google Cloud Storage
async function uploadToGoogleCloud(filename, data) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  try {
    await file.save(JSON.stringify(data));
    console.log(`${filename} enviado para o Google Cloud Storage com sucesso.`);
  } catch (error) {
    console.error(`Erro ao enviar ${filename} para o Google Cloud Storage:`, error);
  }
}

// Exporta as funções para uso em outros módulos
module.exports = { initializeGoogleCloudStorage, uploadToGoogleCloud };
