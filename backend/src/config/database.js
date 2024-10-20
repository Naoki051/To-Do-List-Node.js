// Importa o módulo mysql2/promise e configura as variáveis de ambiente
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Cria um pool de conexões
const pool = mysql.createPool(dbConfig);

// Função para verificar a conexão com o banco de dados
const verificarConexao = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    connection.release();
    return true;
  } catch (erro) {
    console.error('Erro ao conectar ao banco de dados:', erro);
    return false;
  }
};

// Verifica a conexão ao inicializar o módulo
verificarConexao()
  .then((conectado) => {
    if (!conectado) {
      console.error('Falha ao estabelecer conexão inicial com o banco de dados');
      process.exit(1); // Encerra o processo se a conexão falhar
    }
  })
  .catch((erro) => {
    console.error('Erro ao verificar conexão inicial:', erro);
    process.exit(1); // Encerra o processo em caso de erro
  });

// Exporta o pool de conexões
module.exports = pool;
