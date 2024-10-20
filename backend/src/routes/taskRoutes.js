// Importa os módulos necessários
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define as rotas para as operações CRUD de tarefas

// Cria uma nova tarefa
router.post('/tasks', taskController.createTask);

// Obtém todas as tarefas
router.get('/tasks', taskController.getAllTasks);

// Obtém uma tarefa específica pelo ID
router.get('/tasks/:id', taskController.getTaskById);

// Atualiza uma tarefa existente
router.put('/tasks/:id', taskController.updateTask);

// Remove uma tarefa
router.delete('/tasks/:id', taskController.deleteTask);

// Alterna o status de conclusão de uma tarefa
router.patch('/tasks/:id/toggle', taskController.toggleTaskStatus);

// Exporta o router para uso em outros módulos
module.exports = router;
