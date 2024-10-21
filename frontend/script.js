// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // URL base da API
    const API_URL = 'http://localhost:3000/api';
    
    // Elementos do DOM
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

    // IDs das tarefas em edição ou exclusão
    let tarefaEditandoId = null;
    let tarefaExcluindoId = null;

    // Objeto com métodos para chamadas à API
    const api = {
        async request(method, endpoint, data = null) {
            const url = `${API_URL}${endpoint}`;
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${obterToken()}`,
                },
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido ou expirado, faça logout
                    logout();
                }
                throw new Error('Falha na requisição');
            }
            return method === 'DELETE' ? null : response.json();
        },
        get(endpoint) {
            return this.request('GET', endpoint);
        },
        post(endpoint, data) {
            return this.request('POST', endpoint, data);
        },
        put(endpoint, data) {
            return this.request('PUT', endpoint, data);
        },
        delete(endpoint) {
            return this.request('DELETE', endpoint);
        },
        patch(endpoint) {
            return this.request('PATCH', endpoint);
        },
    };

    // Função de logout
    function logout() {
        localStorage.removeItem('jwtToken');
        // Redirecionar para a página de login ou recarregar a página
        location.reload();
    }

    // Carrega as tarefas do servidor
    async function carregarTarefas() {
        if (!obterToken()) {
            exibirModalAutenticacao();
            return;
        }

        try {
            const tarefas = await api.get('/tasks');
            atualizarLista(tarefas);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            if (error.message.includes('401')) {
                exibirModalAutenticacao();
            }
        }
    }

    // Adiciona uma nova tarefa
    async function adicionarNovaTarefa(titulo) {
        try {
            await api.post('/tasks', { title: titulo, createdAt: new Date().toISOString() });
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    // Atualiza uma tarefa existente
    async function atualizarTarefa(id, titulo) {
        try {
            await api.put(`/tasks/${id}`, { title: titulo });
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    // Exclui uma tarefa
    async function excluirTarefa(id) {
        try {
            await api.delete(`/tasks/${id}`);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }

    // Alterna o status de conclusão de uma tarefa
    async function alternarStatusTarefa(id) {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error);
        }
    }

    // Atualiza a lista de tarefas na interface
    function atualizarLista(tarefas) {
        // Filtra as tarefas conforme seleção do usuário
        const filtro = elementos.filtroTarefas.value;
        const tarefasFiltradas = tarefas.filter(tarefa => 
            filtro === 'todas' || 
            (filtro === 'pendentes' && !tarefa.completed) || 
            (filtro === 'concluidas' && tarefa.completed)
        );

        // Renderiza as tarefas filtradas
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

        // Adiciona event listeners para a lista
        elementos.listaTarefas.addEventListener('click', handleListClick);
        elementos.listaTarefas.addEventListener('change', handleListChange);
    }

    // Lida com cliques na lista de tarefas
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

    // Lida com mudanças na lista de tarefas (checkbox)
    function handleListChange(e) {
        const target = e.target;
        if (target.classList.contains('concluir')) {
            alternarStatusTarefa(target.dataset.id);
        }
    }

    // Abre o modal de edição
    function abrirModalEditar(id, titulo) {
        tarefaEditandoId = id;
        elementos.tarefaEditada.value = titulo;
        elementos.modalEditar.style.display = 'block';
    }

    // Abre o modal de confirmação de exclusão
    function abrirModalConfirmar(id) {
        tarefaExcluindoId = id;
        elementos.modalConfirmar.style.display = 'block';
    }

    // Event listener para adicionar nova tarefa
    elementos.adicionarTarefa.addEventListener('click', () => {
        const texto = elementos.novaTarefa.value.trim();
        if (texto) {
            adicionarNovaTarefa(texto);
            elementos.novaTarefa.value = '';
        }
    });

    // Event listener para filtrar tarefas
    elementos.filtroTarefas.addEventListener('change', carregarTarefas);

    // Event listener para adicionar tarefa com Enter
    elementos.novaTarefa.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const texto = elementos.novaTarefa.value.trim();
            if (texto) {
                adicionarNovaTarefa(texto);
                elementos.novaTarefa.value = '';
            }
        }
    });

    // Event listener para salvar edição
    elementos.salvarEdicao.addEventListener('click', () => {
        const novoTitulo = elementos.tarefaEditada.value.trim();
        if (novoTitulo) {
            atualizarTarefa(tarefaEditandoId, novoTitulo);
            elementos.modalEditar.style.display = 'none';
        }
    });

    // Event listener para cancelar edição
    elementos.cancelarEdicao.addEventListener('click', () => {
        elementos.modalEditar.style.display = 'none';
    });

    // Event listener para confirmar exclusão
    elementos.confirmarExclusao.addEventListener('click', () => {
        excluirTarefa(tarefaExcluindoId);
        elementos.modalConfirmar.style.display = 'none';
    });

    // Event listener para cancelar exclusão
    elementos.cancelarExclusao.addEventListener('click', () => {
        elementos.modalConfirmar.style.display = 'none';
    });

    // Função para exibir o modal de autenticação
    function exibirModalAutenticacao() {
        const modal = document.getElementById('modalAutenticacao');
        modal.style.display = 'block';
    }

    // Função para fechar o modal de autenticação
    function fecharModalAutenticacao() {
        const modal = document.getElementById('modalAutenticacao');
        modal.style.display = 'none';
    }

    // Adicionar evento de clique ao botão de autenticação
    document.getElementById('botaoAutenticacao').addEventListener('click', exibirModalAutenticacao);

    // Adicionar evento de clique ao botão de entrar no modal
    document.getElementById('entrarUsuario').addEventListener('click', async function() {
        const usuario = document.getElementById('loginUsuario').value;
        const senha = document.getElementById('senhaUsuario').value;
        
        try {
            const token = await login(usuario, senha);
            salvarToken(token);
            fecharModalAutenticacao();
            // Recarregar as tarefas após o login bem-sucedido
            carregarTarefas();
        } catch (error) {
            alert('Falha na autenticação. Por favor, tente novamente.');
        }
    });

    // Função para autenticar o usuário
    async function login(nome_user, senha) {
        console.log('Iniciando processo de login...');
        console.log('Dados de login:', { nome_user, senha });

        try {
            console.log('Enviando requisição para:', `${API_URL}/auth/login`);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome_user, senha }),
            });

            console.log('Resposta recebida. Status:', response.status);

            if (!response.ok) {
                console.error('Erro na resposta. Status:', response.status);
                const errorData = await response.text();
                console.error('Detalhes do erro:', errorData);
                throw new Error(`Falha na autenticação: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados recebidos após autenticação:', data);
            return data.token;
        } catch (error) {
            console.error('Erro durante o processo de login:', error);
            throw error;
        }
    }

    // Função para salvar o token JWT
    function salvarToken(token) {
        localStorage.setItem('jwtToken', token);
    }

    // Função para obter o token JWT
    function obterToken() {
        return localStorage.getItem('jwtToken');
    }

    // Resto do seu código JavaScript existente...

    // Carrega as tarefas iniciais
    carregarTarefas();

    // Adicionar evento de clique ao botão de logout
    document.getElementById('botaoLogout').addEventListener('click', function() {
        logout();
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome_user = document.getElementById('nome_user').value;
      const senha = document.getElementById('senha').value;

      try {
        const token = await login(nome_user, senha);
        console.log('Token recebido:', token);
        // Armazene o token (por exemplo, no localStorage)
        localStorage.setItem('token', token);
        // Redirecione para a página principal ou atualize a UI
        window.location.href = '/dashboard.html';
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        // Exiba uma mensagem de erro para o usuário
        document.getElementById('errorMessage').textContent = 'Falha no login. Verifique suas credenciais.';
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM carregado, adicionando event listener ao formulário');
      
      const loginForm = document.getElementById('loginForm');
      
      if (loginForm) {
        console.log('Formulário de login encontrado');
        
        loginForm.addEventListener('submit', async (e) => {
          console.log('Formulário submetido');
          e.preventDefault();

          const nome_user = document.getElementById('nome_user').value;
          const senha = document.getElementById('senha').value;

          console.log('Dados do formulário:', { nome_user, senha });

          try {
            console.log('Tentando fazer login...');
            const token = await login(nome_user, senha);
            console.log('Login bem-sucedido, token:', token);
            
            localStorage.setItem('token', token);
            window.location.href = '/dashboard.html';
          } catch (error) {
            console.error('Erro no login:', error);
            document.getElementById('errorMessage').textContent = 'Falha no login. Verifique suas credenciais.';
          }
        });
      } else {
        console.error('Formulário de login não encontrado');
      }
    });

    console.log('DOM carregado, inicializando script de autenticação');

    const loginForm = document.getElementById('loginForm');
    const botaoAutenticacao = document.getElementById('botaoAutenticacao');
    const modalAutenticacao = document.getElementById('modalAutenticacao');
    const errorMessage = document.getElementById('errorMessage');

    // Função para mostrar o modal de autenticação
    function mostrarModalAutenticacao() {
        modalAutenticacao.style.display = 'block';
    }

    // Função para esconder o modal de autenticação
    function esconderModalAutenticacao() {
        modalAutenticacao.style.display = 'none';
    }

    // Função para atualizar o botão baseado no estado de autenticação
    function atualizarBotaoAutenticacao() {
        const token = localStorage.getItem('token');
        if (token) {
            botaoAutenticacao.textContent = 'Logout';
            botaoAutenticacao.onclick = logout;
        } else {
            botaoAutenticacao.textContent = 'Login';
            botaoAutenticacao.onclick = mostrarModalAutenticacao;
        }
    }

    // Função de logout
    function logout() {
        localStorage.removeItem('token');
        atualizarBotaoAutenticacao();
        console.log('Usuário deslogado');
        // Aqui você pode adicionar lógica adicional para atualizar a UI após o logout
    }

    // Função de login
    async function login(nome_user, senha) {
        console.log('Tentando fazer login com:', { nome_user, senha });
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome_user, senha }),
            });

            console.log('Resposta recebida:', response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Detalhes do erro:', errorData);
                throw new Error('Falha na autenticação');
            }

            const data = await response.json();
            console.log('Dados recebidos:', data);
            return data.token;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    // Event listener para o formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulário de login submetido');

        const nome_user = document.getElementById('loginUsuario').value;
        const senha = document.getElementById('senhaUsuario').value;

        try {
            const token = await login(nome_user, senha);
            console.log('Login bem-sucedido, token:', token);
            localStorage.setItem('token', token);
            esconderModalAutenticacao();
            atualizarBotaoAutenticacao();
            // Aqui você pode adicionar lógica para atualizar a UI após o login
        } catch (error) {
            console.error('Erro ao processar o login:', error);
            errorMessage.textContent = 'Falha no login. Verifique suas credenciais.';
        }
    });

    // Inicializar o estado do botão de autenticação
    atualizarBotaoAutenticacao();
});
