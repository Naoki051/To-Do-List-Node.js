const Task = require('../models/Task');
const redis = require('../services/redis');
const { uploadToGoogleCloud } = require('../services/googleCloudService');
const { validationResult } = require('express-validator');

const taskController = {
  // Função auxiliar para padronizar mensagens de erro
  handleError: (res, status, action, error) => {
    console.error(`Erro em ${action}:`, error);
    res.status(status).json({ message: { action, error: error.message } });
  },

  // Obter todas as tarefas
  getAllTasks: async (req, res) => {
    try {
      const tasks = await redis.getAll('task');
      res.json({ message: { action: 'getAllTasks', source: 'redis', count: tasks.length }, data: tasks });
    } catch (error) {
      taskController.handleError(res, 500, 'getAllTasks', error);
    }
  },

  // Criar uma nova tarefa
  createTask: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: { action: 'createTask', errors: errors.array() } });
    }

    try {
      const novaTarefa = new Task(req.body.titulo);
      await redis.set(`task:${novaTarefa.id}`, novaTarefa.toJSON());
      
      const filename = `task_${novaTarefa.id}_${new Date().toISOString()}.json`;
      await uploadToGoogleCloud(filename, novaTarefa.toJSON());
      
      res.status(201).json({ 
        message: { 
          action: 'createTask', 
          id: novaTarefa.id, 
          cloudSync: 'success',
          cloudFilename: filename 
        }, 
        data: novaTarefa 
      });
    } catch (error) {
      taskController.handleError(res, 400, 'createTask', error);
    }
  },

  // Atualizar uma tarefa existente
  updateTask: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: { action: 'updateTask', errors: errors.array() } });
    }

    try {
      const { id } = req.params;
      const tarefaExistente = await redis.get(`task:${id}`);
      if (!tarefaExistente) {
        return res.status(404).json({ message: { action: 'updateTask', error: 'Tarefa não encontrada' } });
      }
      const tarefaAtualizada = { ...tarefaExistente, ...req.body };
      await redis.set(`task:${id}`, tarefaAtualizada);
      
      const filename = `task_${id}_${new Date().toISOString()}.json`;
      await uploadToGoogleCloud(filename, tarefaAtualizada);
      
      res.json({ 
        message: { 
          action: 'updateTask', 
          id, 
          cloudSync: 'success',
          cloudFilename: filename 
        }, 
        data: tarefaAtualizada 
      });
    } catch (error) {
      taskController.handleError(res, 400, 'updateTask', error);
    }
  },

  // Excluir uma tarefa
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const tarefaExistente = await redis.get(`task:${id}`);
      if (!tarefaExistente) {
        return res.status(404).json({ message: { action: 'deleteTask', error: 'Tarefa não encontrada' } });
      }
      
      await redis.del(`task:${id}`);
      
      const deletionRecord = {
        action: 'delete',
        taskId: id,
        deletedAt: new Date().toISOString()
      };
      const filename = `task_deletion_${id}_${deletionRecord.deletedAt}.json`;
      await uploadToGoogleCloud(filename, deletionRecord);
      
      res.json({ 
        message: { 
          action: 'deleteTask', 
          id, 
          status: 'success',
          cloudSync: 'success',
          cloudFilename: filename 
        } 
      });
    } catch (error) {
      taskController.handleError(res, 500, 'deleteTask', error);
    }
  },

  // Sincronizar com o Google Cloud
  syncToGoogleCloud: async (req, res) => {
    try {
      const tasks = await redis.getAll('task');
      const filename = `tasks_backup_${new Date().toISOString()}.json`;
      await uploadToGoogleCloud(filename, tasks);
      res.json({ message: { action: 'syncToGoogleCloud', filename, taskCount: tasks.length, status: 'success' } });
    } catch (error) {
      taskController.handleError(res, 500, 'syncToGoogleCloud', error);
    }
  }
};

module.exports = taskController;
