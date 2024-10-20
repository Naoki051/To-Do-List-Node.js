const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Adicionar uma nova tarefa (POST)
router.post('/tasks', taskController.createTask);

// Consultar todas as tarefas (GET)
router.get('/tasks', taskController.getAllTasks);

// Consultar uma tarefa específica (GET)
router.get('/tasks/:id', taskController.getTaskById);

// Atualizar uma tarefa (PUT)
router.put('/tasks/:id', taskController.updateTask);

// Apagar uma tarefa (DELETE)
router.delete('/tasks/:id', taskController.deleteTask);

// Toggle status de uma tarefa (PATCH)
router.patch('/tasks/:id/toggle', taskController.toggleTaskStatus);

module.exports = router;
