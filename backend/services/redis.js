const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', (err) => console.log('Erro no Redis Client', err));

async function connect() {
    try {
        await client.connect();
        console.log('Conectado ao Redis');
    } catch (error) {
        console.error('Erro ao conectar ao Redis:', error);
        throw error;
    }
}

module.exports = {
    connect,
    getAll: async (prefix) => {
        try {
            const keys = await client.keys(`${prefix}:*`);
            const tasks = await Promise.all(keys.map(async (key) => {
                const value = await client.get(key);
                return { id: key.split(':')[1], ...JSON.parse(value) };
            }));
            return tasks;
        } catch (error) {
            console.error('Erro ao obter todas as tarefas:', error);
            return [];
        }
    },
    get: async (key) => {
        try {
            const value = await client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Erro ao obter item:', error);
            return null;
        }
    },
    set: async (key, data) => {
        try {
            await client.set(key, JSON.stringify(data));
            console.log('Item definido no Redis:', key, data);
        } catch (error) {
            console.error('Erro ao definir item:', error);
        }
    },
    del: async (key) => {
        try {
            await client.del(key);
        } catch (error) {
            console.error('Erro ao deletar item:', error);
        }
    }
};
