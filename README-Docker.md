# Gestão de Estoque - Docker Setup

## Como usar

### Pré-requisitos

- Docker
- Docker Compose

### Estrutura dos projetos

Certifique-se de que os projetos estão organizados assim:

```
ads-2025-2/fabrica-software-3/
├── gestao-de-estoque-back/     # Projeto do backend
├── gestao-de-estoque-front/    # Projeto do frontend
```

### Iniciar aplicação

```bash
# No diretório do frontend
cd gestao-de-estoque-front

# Subir todos os serviços
docker-compose up -d
```

### Acessar aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5011
- **MongoDB**: localhost:27017

### Comandos úteis

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (dados do banco)
docker-compose down -v

# Rebuildar imagens
docker-compose up --build

# Ver status dos containers
docker-compose ps
```

## Configuração

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
