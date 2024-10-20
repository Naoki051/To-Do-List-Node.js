const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { body } = require('express-validator');

router.get('/', taskController.getAllTasks);

router.post('/', [
  body('titulo').notEmpty().withMessage('O título é obrigatório')
], taskController.createTask);

router.put('/:id', [
  body('titulo').optional().notEmpty().withMessage('O título não pode ser vazio'),
  body('concluida').optional().isBoolean().withMessage('O campo concluída deve ser um booleano')
], taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

router.post('/sync', taskController.syncToGoogleCloud);

module.exports = router;
