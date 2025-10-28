# 📦 Sistema de Gestão de Estoque

Sistema completo para gerenciamento de estoque com Next.js, Node.js e MongoDB.

## 📥 Repositórios

```bash
# Clonar os repositórios
git clone ssh://git@gitlab.fslab.dev:4241/fabrica-de-software-iii-2025-2/gestao-de-estoque/gestao-de-estoque-api.git
git clone ssh://git@gitlab.fslab.dev:4241/fabrica-de-software-iii-2025-2/gestao-de-estoque/gestao-de-estoque-front.git
```

## 🚀 Como usar

### Pré-requisitos

- Docker
- Docker Compose

### Estrutura dos projetos

Certifique-se de que os projetos estão organizados assim:

```
pasta-projeto/
├── gestao-de-estoque-api/      # Backend (Node.js + MongoDB)
├── gestao-de-estoque-front/    # Frontend (Next.js + TypeScript)
```

### Iniciar aplicação

```bash
# No diretório do frontend
cd gestao-de-estoque-front

# Subir todos os serviços
docker-compose up --build -d

# Executar seed do banco (popular com dados de teste)
docker-compose exec api npm run seed
```

## 🔑 Credenciais de Teste

Após executar o seed:

| Perfil           | Email                  | Senha       |
| ---------------- | ---------------------- | ----------- |
| 👑 Administrador | admin@sistema.com      | Admin@123   |
| 👔 Gerente       | gerente@sistema.com    | Gerente@123 |
| 📦 Estoquista    | estoquista@sistema.com | Estoque@123 |

### Acessar aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5011
- **MongoDB**: localhost:27017

### Comandos úteis

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f frontend
docker-compose logs -f api

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (dados do banco)
docker-compose down -v

# Rebuildar imagens
docker-compose up --build

# Ver status dos containers
docker-compose ps

# Executar seed novamente
docker-compose exec api npm run seed
```

## 📁 Funcionalidades

- 👥 **Gestão de Usuários** - CRUD com controle de permissões
- 🏢 **Fornecedores** - Cadastro e vinculação com produtos
- 📦 **Produtos** - Controle completo de estoque
- 📊 **Movimentações** - Entradas/saídas com notas fiscais
- 🔐 **Autenticação** - JWT com grupos de usuários

## ⚙️ Configuração

### Variáveis de ambiente

O arquivo `.env.local` já está configurado para funcionar com o Docker.

Para configurações específicas, edite:

- **Backend**: `../gestao-de-estoque-api/.env`
- **Frontend**: `.env.local`

### Troubleshooting

**Se o frontend não conseguir conectar com a API:**

1. Verifique se todos os containers estão rodando: `docker-compose ps`
2. Verifique os logs da API: `docker-compose logs api`

**Para resetar completamente:**

```bash
docker-compose down -v
docker-compose up --build
```

## 📊 Serviços

| Serviço  | Container               | Porta | Descrição         |
| -------- | ----------------------- | ----- | ----------------- |
| Frontend | gestao-de-estoque-front | 3000  | Interface Next.js |
| Backend  | gestao-de-estoque-api   | 5011  | API Node.js       |
| Banco    | mongodb                 | 27017 | MongoDB 8         |

## 🔄 Desenvolvimento

Para desenvolvimento local, você pode rodar apenas o banco:

```bash
# Rodar apenas MongoDB
docker-compose up mongodb -d

# Frontend e backend localmente
npm run dev
```
