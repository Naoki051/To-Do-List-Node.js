// Importações necessárias
const dbPool = require('../config/database');
const { formatarData } = require('../utils/dateFormatter');

// Classe que representa uma tarefa
class Task {
  constructor(id, title, completed, createdAt) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.createdAt = createdAt ? formatarData(createdAt) : 'Data não disponível';
  }

  // Cria uma nova tarefa
  static async create(title) {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await dbPool.execute(
      'INSERT INTO new_table (title, createdAt) VALUES (?, ?)',
      [title, now]
    );
    return new Task(result.insertId, title, false, now);
  }

  // Busca todas as tarefas
  static async findAll() {
    const [rows] = await dbPool.query('SELECT * FROM new_table');
    return rows.map(row => new Task(
      row.id,
      row.title,
      row.completed,
      row.createdAt
    ));
  }

  // Busca uma tarefa pelo ID
  static async findById(id) {
    const [rows] = await dbPool.query('SELECT * FROM new_table WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new Task(
      row.id,
      row.title,
      row.completed,
      row.createdAt
    );
  }

  // Atualiza o título de uma tarefa
  async update(title) {
    await dbPool.execute(
      'UPDATE new_table SET title = ? WHERE id = ?',
      [title, this.id]
    );
    this.title = title;
    return this;
  }

  // Exclui uma tarefa
  async delete() {
    await dbPool.execute('DELETE FROM new_table WHERE id = ?', [this.id]);
  }

  // Alterna o status de conclusão da tarefa
  async toggleCompleted() {
    this.completed = !this.completed;
    await dbPool.execute(
      'UPDATE new_table SET completed = ? WHERE id = ?',
      [this.completed, this.id]
    );
    return this;
  }
}

// Exporta a classe Task
module.exports = Task;
