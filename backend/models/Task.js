const { v4: uuidv4 } = require('uuid');

// Classe que representa uma tarefa
class Task {
  // Construtor da classe
  constructor(titulo, status = 'pendente') {
    this.id = uuidv4(); // Gera um ID único
    this.titulo = titulo;
    this.status = status;
    this.dataCriacao = new Date(); // Define a data de criação
  }

  // Método estático para criar uma tarefa a partir de um objeto JSON
  static fromJSON(json) {
    const task = new Task(json.titulo, json.status);
    task.id = json.id;
    task.dataCriacao = new Date(json.dataCriacao);
    return task;
  }

  // Método para converter a tarefa em um objeto JSON
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
