const dbPool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  constructor(id_user, nome_user, senha) {
    this.id_user = id_user;
    this.nome_user = nome_user;
    this.senha = senha;
  }

  // Busca um usuário pelo nome de usuário
  static async findByNomeUser(nome_user) {
    try {
      const [rows] = await dbPool.execute(
        'SELECT * FROM Users WHERE nome_user = ?',
        [nome_user]
      );
      if (rows.length === 0) return null;
      const user = rows[0];
      return new User(user.id_user, user.nome_user, user.senha);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Cria um novo usuário
  static async create(nome_user, senha) {
    try {
      const hashedSenha = await bcrypt.hash(senha, 10);
      const [result] = await dbPool.execute(
        'INSERT INTO Users (nome_user, senha) VALUES (?, ?)',
        [nome_user, hashedSenha]
      );
      return new User(result.insertId, nome_user, hashedSenha);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Verifica se a senha está correta
  async verifyPassword(senha) {
    return this.senha === senha; // Comparação direta, já que as senhas estão em texto simples
  }

  // Atualiza a senha do usuário
  async updatePassword(novaSenha) {
    try {
      const hashedSenha = await bcrypt.hash(novaSenha, 10);
      await dbPool.execute(
        'UPDATE Users SET senha = ? WHERE id = ?',
        [hashedSenha, this.id_user]
      );
      this.senha = hashedSenha;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  }

  // Exclui um usuário
  async delete() {
    try {
      await dbPool.execute('DELETE FROM Users WHERE id = ?', [this.id_user]);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }

}

module.exports = User;
