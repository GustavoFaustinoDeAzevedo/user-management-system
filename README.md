# User Management System

> Projeto criado para prática e demonstração de habilidades em desenvolvimento backend, com foco em evolução progressiva até um sistema full-stack.

## Ultimo Update do README

`25-06-2026`

---

## Descrição

Aplicação full-stack desenvolvida para gerenciamento de usuários, com foco em boas práticas de API REST, validação de dados e organização de código.

---

## Funcionalidades implementadas

- Cadastro de usuário (POST /users/register)
- Validação de email e senha
- Estrutura organizada com controllers e rotas
- Padrão de resposta consistente (success, data, error)
- Login e autenticação
- Listagem de usuários (GET /users)
- Edição de usuários (backend)
- Exclusão de usuários (backend)
- Controle de acesso (admin/usuário)
- Integração com frontend

---

## Funcionalidades em desenvolvimento

- Edição de usuários (frontend)
- Exclusão de usuários (frontend)

---

## Como Executar

```bash
git clone https://github.com/GustavoFaustinoDeAzevedo/user-management-system
cd user-management-system/backend
npm install
 # Opções para execução:
npm run dev (recomendado para desenvolvimento)
npx daemon (alternativa)
```

> Para executar o frontend é o mesmo processo, entretanto, a pasta a ser acessada pelo cd é o 'user-management-system/frontend'

---

## Tecnologias Usadas

- Node.js
- TypeScript
- Express
- Nodemon

---

## Endpoints

### Cadastro de usuário

POST /users/register

### Fazer Login

POST /users/login

### Renovar Access Token

POST /users/refresh

### Fazer Logout

POST /users/logout

### Listar Usuários

GET /users

### Atualizar Usuário

PATCH /users/:id

### Deletar Usuário

DELETE /users/:id

#### Body:

```json
{
  "email": "admin@email.com",
  "password": "Admin@123"
}
```

#### Resposta de sucesso:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "id": "1",
      "email": "admin@email.com",
      "role": "admin"
    }
  }
}
```

#### Resposta de erro:

```json
{
  "success": false,
  "error": "mensagem que depende do erro"
}
```

---

## Regras de negócio

- Usuários não autenticados não podem acessar o sistema
- Apenas administradores podem gerenciar outros usuários
- Não permitir emails duplicados
- Sessão persistente após login

---

## Status do projeto

Em desenvolvimento
