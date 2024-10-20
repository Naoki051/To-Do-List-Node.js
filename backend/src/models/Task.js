const dbPool = require('../config/database');
const { formatarData } = require('../utils/dateFormatter');

class Task {
  constructor(id, title, completed, createdAt) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.createdAt = createdAt ? formatarData(createdAt) : 'Data não disponível';
  }

  static async create(title) {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await dbPool.execute(
      'INSERT INTO new_table (title, createdAt) VALUES (?, ?)',
      [title, now]
    );
    return new Task(result.insertId, title, false, now);
  }

  static async findAll() {
    const [rows] = await dbPool.query('SELECT * FROM new_table');
    return rows.map(row => new Task(
      row.id,
      row.title,
      row.completed,
      row.createdAt
    ));
  }

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

  async update(title) {
    await dbPool.execute(
      'UPDATE new_table SET title = ? WHERE id = ?',
      [title, this.id]
    );
    this.title = title;
    return this;
  }

  async delete() {
    await dbPool.execute('DELETE FROM new_table WHERE id = ?', [this.id]);
  }

  async toggleCompleted() {
    this.completed = !this.completed;
    await dbPool.execute(
      'UPDATE new_table SET completed = ? WHERE id = ?',
      [this.completed, this.id]
    );
    return this;
  }
}

module.exports = Task;
