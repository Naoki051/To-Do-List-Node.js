const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(titulo, status = 'pendente') {
    this.id = uuidv4();
    this.titulo = titulo;
    this.status = status;
    this.dataCriacao = new Date();
  }

  static fromJSON(json) {
    const task = new Task(json.titulo, json.status);
    task.id = json.id;
    task.dataCriacao = new Date(json.dataCriacao);
    return task;
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      dataCriacao: this.dataCriacao
    };
  }
}

module.exports = Task;
