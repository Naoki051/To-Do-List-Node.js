# Documentação do Projeto To-Do List

## 1. Visão Geral
Este projeto é uma aplicação de lista de tarefas (To-Do List) com um frontend em HTML, CSS e JavaScript, e um backend em Node.js. A aplicação permite aos usuários criar, visualizar, atualizar e excluir tarefas, além de marcar tarefas como concluídas.

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
- `services/`: Diretório contendo serviços adicionais (Redis, Google Cloud)

## 3. Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Cache**: Redis
- **Armazenamento em Nuvem**: Google Cloud SQL

## 4. Funcionalidades Principais

### 4.1 Frontend
- Adicionar novas tarefas
- Listar todas as tarefas
- Marcar tarefas como concluídas
- Editar tarefas existentes
- Excluir tarefas
- Filtrar tarefas por status (todas, pendentes, concluídas)

### 4.2 Backend
- API RESTful para gerenciamento de tarefas
- Armazenamento de tarefas no banco de dados MySQL
- Cache de tarefas usando Redis para melhorar o desempenho
- Sincronização de tarefas com o Google Cloud SQL para armazenamento e backup

## 5. Configuração e Instalação

### 5.1 Requisitos
- Node.js (versão 14 ou superior)
- MySQL
- Redis
- Conta no Google Cloud com uma instância MySQL configurada

### 5.2 Instalação
- Clone o repositório.
- Instale as dependências do backend:
  - `cd backend`
  - `npm install`
- Configure as variáveis de ambiente no arquivo `.env` (veja o exemplo em `.env.example`).
- Inicie o servidor backend:
  - `npm start`
- Abra o arquivo `frontend/index.html` em um navegador web.
## 6. Estrutura da API
A API do backend inclui os seguintes endpoints:

- `GET /api/tasks`: Retorna todas as tarefas
- `POST /api/tasks`: Cria uma nova tarefa
- `PUT /api/tasks/:id`: Atualiza uma tarefa existente
- `DELETE /api/tasks/:id`: Exclui uma tarefa
- `PATCH /api/tasks/:id/toggle`: Alterna o status de uma tarefa entre concluída e pendente

## 7. Segurança
- Utiliza CORS para controle de acesso.
- Armazena senhas e chaves sensíveis em variáveis de ambiente.
- Implementar validação de entrada usando express-validator.

## 8. Melhorias Futuras
- Implementar autenticação de usuários para garantir que somente pessoas autorizadas possam criar, alterar ou apagar tarefas.
- Adicionar testes automatizados.
- Melhorar a interface do usuário com um framework frontend (React, Vue.js, etc.).
- Implementar paginação para lidar com um grande número de tarefas.

## 9. Problemas Enfrentados Durante o Desenvolvimento
Durante o desenvolvimento da aplicação To-Do List, alguns desafios foram identificados:

### 9.1 Configuração da Instância no Google Cloud
A configuração da instância no Google Cloud foi um desafio significativo. Houve dificuldades relacionadas à autenticação do meu computador, que eram necessárias para estabelecer conexões adequadas com os serviços do Google Cloud.

### 9.2 Problemas de Desempenho
Identificou-se um problema de desempenho, com um delay visível ao realizar ações na aplicação. Esse atraso pode impactar a experiência do usuário e está sendo monitorado para futuras otimizações.

### 9.3 Dificuldades no Design
Enfrentei dificuldades pessoais ao desenvolver o design da aplicação. Essa parte do projeto requer atenção especial, e a falta de experiência pode ter contribuído para esses desafios.

### 9.4 Autenticação
Devido à quantidade reduzida de tempo e ao meu desconhecimento sobre JWT (JSON Web Tokens), não foi possível implementar um sistema de autenticação com usuário e senha. No entanto, essa funcionalidade poderia ser desenvolvida futuramente. A implementação envolveria a criação de uma tabela Users, contendo os campos id_user, nome_user e senha. Além disso, seria necessária a validação das requisições através de um token JWT, que utilizaria a seção para gerar um token com um tempo de vida específico, permitindo validar as ações do usuário e garantir a segurança da aplicação.

## 10. Licença
Este projeto está licenciado sob a licença ISC.




