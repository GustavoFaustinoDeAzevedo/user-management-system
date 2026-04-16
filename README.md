# User Management System

## Descrição

Aplicação backend desenvolvida para gerenciamento de usuários, com foco em boas práticas de API REST, validação de dados e organização de código.

---

## Tecnologias

- Node.js
- TypeScript
- Express
- Nodemon

---

## Funcionalidades implementadas

- Cadastro de usuário (POST /users/register)
- Validação de email e senha
- Estrutura organizada com controllers e rotas
- Padrão de resposta consistente (success, data, error)

---

## Funcionalidades em desenvolvimento

- Login e autenticação
- Listagem de usuários (GET /users)
- Edição de usuários
- Exclusão de usuários
- Controle de acesso (admin/usuário)
- Integração com frontend

---

## Estrutura do projeto

```
backend/
  src/
    controllers/
    routes/
    models/
    middlewares/
    server.ts
```

---

## Como rodar o projeto

```bash
npm install
npm run dev
```

---

## Endpoints

### Cadastro de usuário

POST /users/register

#### Body:

```json
{
  "email": "teste@email.com",
  "password": "Senha123!"
}
```

#### Resposta de sucesso:

```json
{
  "success": true,
  "data": {
    "email": "teste@email.com"
  }
}
```

#### Resposta de erro:

```json
{
  "success": false,
  "error": "mensagem de erro"
}
```

---

## Regras de negócio (planejadas)

- Usuários não autenticados não podem acessar o sistema
- Apenas administradores podem gerenciar outros usuários
- Não permitir emails duplicados
- Sessão persistente após login

---

## Objetivo

Projeto criado para prática e demonstração de habilidades em desenvolvimento backend, com foco em evolução progressiva até um sistema completo.

---

## Status do projeto

Em desenvolvimento
