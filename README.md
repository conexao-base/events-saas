# SaaS Retiro

Plataforma de criação e gerenciamento de eventos para organizações.

O SaaS Retiro permite criar eventos personalizados, configurar formulários de inscrição e centralizar a gestão dos participantes em uma única plataforma, com foco em praticidade e organização.

## Funcionalidades

- Criação e gerenciamento de eventos.
- Personalização das páginas de eventos.
- Formulários de inscrição personalizados.
- Estrutura para inscrições e pagamentos online.

## Tecnologias

- React e TypeScript
- Node.js e Express
- PostgreSQL
- Docker

## Como executar

### 1. Pré-requisitos

Instale o [Git](https://git-scm.com/) e o [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 2. Clone o repositório

```bash
git clone https://github.com/conexao-base/saas-retiro.git
cd saas-retiro
```

### 3. Configure o ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
NODE_ENV=development

DB_HOST=db
DB_PORT=5432
DB_NAME=conexao
DB_USER=conexao
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d

SEED_ADMIN_NAME=Administrador
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=sua_senha_admin
```

Substitua os valores de exemplo por credenciais próprias. Não compartilhe o arquivo `.env`.

### 4. Inicie a aplicação

```bash
docker compose up --build -d
```

### 5. Acesse a plataforma

- **Aplicação:** http://localhost:5173
- **API:** http://localhost:4000

### 6. Gerencie os containers

Para visualizar os logs:

```bash
docker compose logs -f
```

Para parar a aplicação:

```bash
docker compose down
```

## Estrutura do projeto

```text
saas-retiro/
├── frontend/
├── backend/
├── compose.yaml
├── .env
└── README.md
```

## Licença

Licença ainda não definida.
