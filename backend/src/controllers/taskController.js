// Importações necessárias
const Task = require('../models/Task');
const redisClient = require('../config/redis');

// Tempo de expiração do cache (1 hora)
const CACHE_EXPIRATION = 3600; // 1 hora em segundos

const taskController = {
  // Cria uma nova tarefa
  createTask: async (req, res) => {
    try {
      const { title } = req.body;
      const task = await Task.create(title);
      // Armazena a tarefa no cache
      await redisClient.setex(`task:${task.id}`, CACHE_EXPIRATION, JSON.stringify(task));
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtém todas as tarefas
  getAllTasks: async (req, res) => {
    try {
      // Busca tarefas diretamente do banco de dados
      const tasks = await Task.findAll();
      
      // Atualiza o cache com os dados mais recentes
      await redisClient.setex('all_tasks', CACHE_EXPIRATION, JSON.stringify(tasks));
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtém uma tarefa específica pelo ID
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      // Tenta obter a tarefa do cache
      const cachedTask = await redisClient.get(`task:${id}`);
      if (cachedTask) {
        return res.json(JSON.parse(cachedTask));
      }
      // Se não estiver no cache, busca no banco de dados
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      // Armazena a tarefa no cache
      await redisClient.setex(`task:${id}`, CACHE_EXPIRATION, JSON.stringify(task));
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Atualiza uma tarefa existente
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      await task.update(title);
      // Atualiza o cache e remove a lista de todas as tarefas
      await Promise.all([
        redisClient.setex(`task:${id}`, CACHE_EXPIRATION, JSON.stringify(task)),
        redisClient.del('all_tasks')
      ]);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Remove uma tarefa
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      await task.delete();
      // Remove a tarefa do cache e a lista de todas as tarefas
      await redisClient.del(`task:${id}`);
      await redisClient.del('all_tasks');
      res.json({ message: 'Tarefa removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Alterna o status de uma tarefa entre completa e incompleta
  toggleTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
      
      await task.toggleCompleted();
      
      // Atualiza o cache e remove a lista de todas as tarefas
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
