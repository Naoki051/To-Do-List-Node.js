# Documentação do Projeto To-Do List

## 1. Visão Geral
Este projeto é uma aplicação de lista de tarefas (To-Do List) com um frontend em HTML, CSS e JavaScript, e um backend em Node.js. A aplicação permite aos usuários criar, visualizar, atualizar e excluir tarefas, além de marcar tarefas como concluídas. O projeto agora inclui autenticação de usuários.

## 2. Estrutura do Projeto
O projeto está dividido em duas partes principais:

### 2.1 Frontend
O frontend está localizado na pasta `frontend` e consiste em:
- `index.html`: A estrutura HTML da aplicação
- `style.css`: Estilos CSS para a interface do usuário
- `script.js`: Lógica JavaScript para interatividade e comunicação com o backend

### 2.2 Backend
O backend está localizado na pasta `backend` e inclui:
- `server.js`: Ponto de entrada do servidor Node.js
- `app.js`: Configuração principal do Express
- `routes/`: Diretório contendo as rotas da API
- `controllers/`: Diretório contendo a lógica de controle
- `models/`: Diretório contendo os modelos de dados
- `config/`: Diretório contendo configurações (banco de dados, Redis)
- `middleware/`: Diretório contendo middlewares (autenticação)

## 3. Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Cache**: Redis
- **Autenticação**: JSON Web Tokens (JWT)
- **Armazenamento em Nuvem**: Google Cloud Storage

## 4. Funcionalidades Principais

### 4.1 Frontend
- Autenticação de usuários (login/logout)
- Adicionar novas tarefas
- Listar todas as tarefas
- Marcar tarefas como concluídas
- Editar tarefas existentes
- Excluir tarefas
- Filtrar tarefas por status (todas, pendentes, concluídas)

### 4.2 Backend
- API RESTful para gerenciamento de tarefas
- Autenticação de usuários usando JWT
- Armazenamento de tarefas no banco de dados MySQL
- Cache de tarefas usando Redis para melhorar o desempenho
- Integração com Google Cloud Storage para armazenamento e backup

## 5. Configuração e Instalação

### 5.1 Requisitos
- Node.js (versão 14 ou superior)
- MySQL
- Redis
- Conta no Google Cloud com Storage configurado

### 5.2 Instalação
1. Clone o repositório.
2. Instale as dependências do backend:
   -’cd backend’
   -’npm install’
3. Configure as variáveis de ambiente no arquivo `.env` (veja o exemplo em `.env_sample`) e adicione as credenciais do Google Cloud para conexão e armazenamento.
4. Inicie o servidor backend:
   -’npm start’
5. Abra o arquivo `frontend/index.html` em um navegador web.

## 6. Estrutura da API
A API do backend inclui os seguintes endpoints:

- `POST /auth/login`: Autentica um usuário
- `GET /api/tasks`: Retorna todas as tarefas (requer autenticação)
- `POST /api/tasks`: Cria uma nova tarefa (requer autenticação)
- `PUT /api/tasks/:id`: Atualiza uma tarefa existente (requer autenticação)
- `DELETE /api/tasks/:id`: Exclui uma tarefa (requer autenticação)
- `PATCH /api/tasks/:id/toggle`: Alterna o status de uma tarefa (requer autenticação)

## 7. Autenticação
A autenticação é implementada usando JSON Web Tokens (JWT). Veja o código completo da autenticação [aqui](./src/controllers/authController.js) e do middleware [aqui](./src/middleware/auth.js).
O usuário deve estar previamente criado na tabela de Users.

Processo básico:
1. O usuário faz login através do endpoint `/auth/login`.
2. Se as credenciais estiverem corretas, o servidor retorna um token JWT.
3. O frontend armazena este token no `localStorage`.
4. Requisições subsequentes devem incluir o token no cabeçalho de autorização.
5. O middleware no backend valida o token para proteger as rotas.

## 8. Segurança
- Utiliza CORS para controle de acesso.
- Armazena senhas e chaves sensíveis em variáveis de ambiente.
- Implementa autenticação JWT para proteger rotas sensíveis.
- Usa HTTPS em produção (recomendado, não implementado no código fornecido).

## 9. Integração com Google Cloud
O projeto utiliza o Google Cloud Storage para armazenamento e backup de dados. A configuração é feita no arquivo `server.js`.


## 10. Desafios Enfrentados e Melhorias Futuras

### 10.1 Desafios
- Configuração da instância no Google Cloud e problemas de autenticação.
- Problemas de desempenho, com delay visível em algumas ações.
- Dificuldades no design da interface do usuário.
- Implementação parcial do sistema de autenticação devido a restrições de tempo e conhecimento limitado sobre JWT.

### 10.2 Melhorias Futuras
- Implementar um sistema completo de registro de usuários.
- Adicionar funcionalidade de recuperação de senha.
- Melhorar a segurança do token JWT, evitando expô-lo diretamente na resposta JSON.
- Implementar refresh tokens para melhor gerenciamento de sessões.
- Adicionar testes automatizados.
- Melhorar a interface do usuário, possivelmente migrando para um framework frontend como React ou Vue.js.
- Implementar paginação para lidar com um grande número de tarefas.
- Otimizar o desempenho para reduzir delays.

## 11. Licença
Este projeto está licenciado sob a licença ISC..
