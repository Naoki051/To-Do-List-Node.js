Documentação do Projeto To-Do List
1. Visão Geral
Este projeto é uma aplicação de lista de tarefas (To-Do List) com um frontend em HTML, CSS e JavaScript, e um backend em Node.js. A aplicação permite aos usuários criar, visualizar, atualizar e excluir tarefas, além de marcar tarefas como concluídas.
2. Estrutura do Projeto
O projeto está dividido em duas partes principais:
2.1 Frontend
O frontend está localizado na pasta frontend e consiste em:
index.html: A estrutura HTML da aplicação
style.css: Estilos CSS para a interface do usuário
script.js: Lógica JavaScript para interatividade e comunicação com o backend
2.2 Backend
O backend está localizado na pasta backend e inclui:
server.js: Ponto de entrada do servidor Node.js
app.js: Configuração principal do Express
routes/: Diretório contendo as rotas da API
controllers/: Diretório contendo a lógica de controle
models/: Diretório contendo os modelos de dados
config/: Diretório contendo configurações (banco de dados, Redis)
services/: Diretório contendo serviços adicionais (Redis, Google Cloud)
3. Tecnologias Utilizadas
Frontend: HTML5, CSS3, JavaScript (ES6+)
Backend: Node.js, Express.js
Banco de Dados: MySQL
Cache: Redis
Armazenamento em Nuvem: Google Cloud Storage
4. Funcionalidades Principais
4.1 Frontend
Adicionar novas tarefas
Listar todas as tarefas
Marcar tarefas como concluídas
Editar tarefas existentes
Excluir tarefas
Filtrar tarefas por status (todas, pendentes, concluídas)
4.2 Backend
API RESTful para gerenciamento de tarefas
Armazenamento de tarefas no banco de dados MySQL
Cache de tarefas usando Redis para melhorar o desempenho
Sincronização de tarefas com o Google Cloud Storage para backup
5. Configuração e Instalação
5.1 Requisitos
Node.js (versão 14 ou superior)
MySQL
Redis
Conta no Google Cloud com um bucket configurado
5.2 Instalação
Clone o repositório
Instale as dependências do backend:
   cd backend
   npm install
3. Configure as variáveis de ambiente no arquivo .env (veja o exemplo em .env.example)
Inicie o servidor backend:
   npm start
Abra o arquivo frontend/index.html em um navegador web
6. Estrutura da API
A API do backend inclui os seguintes endpoints:
GET /api/tasks: Retorna todas as tarefas
POST /api/tasks: Cria uma nova tarefa
PUT /api/tasks/:id: Atualiza uma tarefa existente
DELETE /api/tasks/:id: Excluir uma tarefa
PATCH /api/tasks/:id/toggle: Alterna o status de uma tarefa entre concluída e pendente
7. Segurança
Utiliza CORS para controle de acesso
Armazena senhas e chaves sensíveis em variáveis de ambiente
Implementar validação de entrada usando express-validator
8. Melhorias Futuras
Implementar autenticação de usuários
Adicionar testes automatizados
Melhorar a interface do usuário com um framework frontend (React, Vue.js, etc.)
Implementar paginação para lidar com um grande número de tarefas
9. Licença
Este projeto está licenciado sob a licença ISC.
