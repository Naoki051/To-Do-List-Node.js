const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { body } = require('express-validator');

// Rota para obter todas as tarefas
router.get('/', taskController.getAllTasks);

// Rota para criar uma nova tarefa
router.post('/', [
  body('titulo').notEmpty().withMessage('O título é obrigatório')
], taskController.createTask);

// Rota para atualizar uma tarefa existente
router.put('/:id', [
  body('titulo').optional().notEmpty().withMessage('O título não pode ser vazio'),
  body('concluida').optional().isBoolean().withMessage('O campo concluída deve ser um booleano')
], taskController.updateTask);

// Rota para excluir uma tarefa
router.delete('/:id', taskController.deleteTask);

// Rota para sincronizar tarefas com o Google Cloud
router.post('/sync', taskController.syncToGoogleCloud);

module.exports = router;
