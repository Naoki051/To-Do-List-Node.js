// Importa os módulos necessários
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Define as rotas para as operações CRUD de tarefas

// Cria uma nova tarefa
router.post('/tasks', auth, taskController.createTask);

// Obtém todas as tarefas
router.get('/tasks', auth, taskController.getAllTasks);

// Obtém uma tarefa específica pelo ID
router.get('/tasks/:id', auth, taskController.getTaskById);

// Atualiza uma tarefa existente
router.put('/tasks/:id', auth, taskController.updateTask);

// Remove uma tarefa
router.delete('/tasks/:id', auth, taskController.deleteTask);

// Alterna o status de conclusão de uma tarefa
router.patch('/tasks/:id/toggle', auth, taskController.toggleTaskStatus);

// Exporta o router para uso em outros módulos
module.exports = router;
