# User Management System

> Projeto criado para prática e demonstração de habilidades em desenvolvimento backend, com foco em evolução progressiva até um sistema full-stack.

## Ultimo Update do README

`16-04-2026`

---

## Descrição

Aplicação full-stack desenvolvida para gerenciamento de usuários, com foco em boas práticas de API REST, validação de dados e organização de código.

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

## Como Executar (Provisório)

```bash
git clone https://github.com/GustavoFaustinoDeAzevedo/user-management-system
cd user-management-system/backend
npm install
 # Opções para execução:
npm run dev (recomendado para desenvolvimento)
npx daemon (alternativa)
```

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
  "error": "mensagem que depende do erro"
}
```

---

## Regras de negócio (planejadas)

- Usuários não autenticados não podem acessar o sistema
- Apenas administradores podem gerenciar outros usuários
- Não permitir emails duplicados
- Sessão persistente após login

---

## Status do projeto

Em desenvolvimento
