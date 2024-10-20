const Task = require('../models/Task');
const redisClient = require('../config/redis');
const { formatarData } = require('../utils/dateFormatter');

const CACHE_EXPIRATION = 3600; // 1 hora em segundos

const taskController = {
  createTask: async (req, res) => {
    try {
      const { title } = req.body;
      const task = await Task.create(title);
      // Removemos a conversão para ISO string, pois já está formatada
      await redisClient.setex(`task:${task.id}`, CACHE_EXPIRATION, JSON.stringify(task));
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllTasks: async (req, res) => {
    try {
      // Removemos o uso do cache para garantir dados atualizados
      const tasks = await Task.findAll();
      
      // Atualizamos o cache com os dados mais recentes
      await redisClient.setex('all_tasks', CACHE_EXPIRATION, JSON.stringify(tasks));
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const cachedTask = await redisClient.get(`task:${id}`);
      if (cachedTask) {
        return res.json(JSON.parse(cachedTask));
      }
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      await redisClient.setex(`task:${id}`, CACHE_EXPIRATION, JSON.stringify(task));
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      await task.update(title);
      await Promise.all([
        redisClient.setex(`task:${id}`, CACHE_EXPIRATION, JSON.stringify(task)),
        redisClient.del('all_tasks')
      ]);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      await task.delete();
      await redisClient.del(`task:${id}`);
      await redisClient.del('all_tasks');
      res.json({ message: 'Tarefa removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      
      await task.toggleCompleted();
      
      await Promise.all([
        redisClient.setex(`task:${id}`, CACHE_EXPIRATION, JSON.stringify(task)),
        redisClient.del('all_tasks')
      ]);
      
      res.json(task);
    } catch (error) {
      console.error('Erro ao alternar status da tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = taskController;
