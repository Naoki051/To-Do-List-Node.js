document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const elementos = {
        novaTarefa: document.getElementById('novaTarefa'),
        adicionarTarefa: document.getElementById('adicionarTarefa'),
        listaTarefas: document.getElementById('listaTarefas'),
        filtroTarefas: document.getElementById('filtroTarefas'),
        modalEditar: document.getElementById('modalEditar'),
        tarefaEditada: document.getElementById('tarefaEditada'),
        salvarEdicao: document.getElementById('salvarEdicao'),
        cancelarEdicao: document.getElementById('cancelarEdicao'),
        modalConfirmar: document.getElementById('modalConfirmar'),
        confirmarExclusao: document.getElementById('confirmarExclusao'),
        cancelarExclusao: document.getElementById('cancelarExclusao')
    };

    let tarefaEditandoId = null;
    let tarefaExcluindoId = null;

    const api = {
        async get(endpoint) {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) throw new Error('Falha na requisição');
            return response.json();
        },
        async post(endpoint, data) {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Falha na requisição');
            return response.json();
        },
        async put(endpoint, data) {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Falha na requisição');
            return response.json();
        },
        async delete(endpoint) {
            const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha na requisição');
        },
        async patch(endpoint) {
            const response = await fetch(`${API_URL}${endpoint}`, { method: 'PATCH' });
            if (!response.ok) throw new Error('Falha na requisição');
            return response.json();
        }
    };

    async function carregarTarefas() {
        try {
            const tarefas = await api.get('/tasks');
            atualizarLista(tarefas);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    async function adicionarNovaTarefa(titulo) {
        try {
            await api.post('/tasks', { title: titulo, createdAt: new Date().toISOString() });
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    async function atualizarTarefa(id, titulo) {
        try {
            await api.put(`/tasks/${id}`, { title: titulo });
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    async function excluirTarefa(id) {
        try {
            await api.delete(`/tasks/${id}`);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }

    async function alternarStatusTarefa(id) {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error);
        }
    }

    function atualizarLista(tarefas) {
        const filtro = elementos.filtroTarefas.value;
        const tarefasFiltradas = tarefas.filter(tarefa => 
            filtro === 'todas' || 
            (filtro === 'pendentes' && !tarefa.completed) || 
            (filtro === 'concluidas' && tarefa.completed)
        );

        elementos.listaTarefas.innerHTML = tarefasFiltradas.map(tarefa => `
            <li class="tarefa">
                <input type="checkbox" class="concluir" ${tarefa.completed ? 'checked' : ''} data-id="${tarefa.id}">
                <div class="tarefa-conteudo">
                    <span class="titulo ${tarefa.completed ? 'concluida' : ''}">${tarefa.title}</span>
                    <span class="data-criacao">${tarefa.createdAt}</span>
                </div>
                <div class="acoes">
                    <button class="editar" data-id="${tarefa.id}" data-title="${tarefa.title}"><i class="fas fa-edit"></i></button>
                    <button class="excluir" data-id="${tarefa.id}"><i class="fas fa-trash"></i></button>
                </div>
            </li>
        `).join('');

        elementos.listaTarefas.addEventListener('click', handleListClick);
        elementos.listaTarefas.addEventListener('change', handleListChange);
    }

    function handleListClick(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const { id, title } = target.dataset;
        if (target.classList.contains('editar')) {
            abrirModalEditar(id, title);
        } else if (target.classList.contains('excluir')) {
            abrirModalConfirmar(id);
        }
    }

    function handleListChange(e) {
        const target = e.target;
        if (target.classList.contains('concluir')) {
            alternarStatusTarefa(target.dataset.id);
        }
    }

    function abrirModalEditar(id, titulo) {
        tarefaEditandoId = id;
        elementos.tarefaEditada.value = titulo;
        elementos.modalEditar.style.display = 'block';
    }

    function abrirModalConfirmar(id) {
        tarefaExcluindoId = id;
        elementos.modalConfirmar.style.display = 'block';
    }

    elementos.adicionarTarefa.addEventListener('click', () => {
        const texto = elementos.novaTarefa.value.trim();
        if (texto) {
            adicionarNovaTarefa(texto);
            elementos.novaTarefa.value = '';
        }
    });

    elementos.filtroTarefas.addEventListener('change', carregarTarefas);

    elementos.novaTarefa.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const texto = elementos.novaTarefa.value.trim();
            if (texto) {
                adicionarNovaTarefa(texto);
                elementos.novaTarefa.value = '';
            }
        }
    });

    elementos.salvarEdicao.addEventListener('click', () => {
        const novoTitulo = elementos.tarefaEditada.value.trim();
        if (novoTitulo) {
            atualizarTarefa(tarefaEditandoId, novoTitulo);
            elementos.modalEditar.style.display = 'none';
        }
    });

    elementos.cancelarEdicao.addEventListener('click', () => {
        elementos.modalEditar.style.display = 'none';
    });

    elementos.confirmarExclusao.addEventListener('click', () => {
        excluirTarefa(tarefaExcluindoId);
        elementos.modalConfirmar.style.display = 'none';
    });

    elementos.cancelarExclusao.addEventListener('click', () => {
        elementos.modalConfirmar.style.display = 'none';
    });

    carregarTarefas();
});
