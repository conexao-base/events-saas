# SaaS Retiro

Plataforma de criação e gerenciamento de eventos para organizações.

O SaaS Retiro permite criar eventos personalizados, configurar formulários de inscrição e centralizar a gestão dos participantes em uma única plataforma, com foco em praticidade e organização.

## Funcionalidades

- Criação e gerenciamento de eventos.
- Personalização das páginas de eventos.
- Formulários de inscrição personalizados.
- Estrutura para inscrições e pagamentos online.
- Gerenciamento de participantes.

## Tecnologias

- React e TypeScript
- Node.js e Express
- PostgreSQL
- Docker

## Como executar

### 1. Pré-requisitos

Instale as seguintes ferramentas:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Clone o repositório

```bash
git clone https://github.com/conexao-base/saas-retiro.git
cd saas-retiro
```

### 3. Configure o ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development

DB_HOST=db
DB_PORT=5432
DB_NAME=conexao
DB_USER=conexao
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta_com_no_minimo_32_caracteres
JWT_EXPIRES_IN=7d

SEED_ADMIN_EMAIL=teste@email.com
SEED_ADMIN_PASSWORD=teste123456
```

Substitua os valores de exemplo pelas credenciais desejadas.

**Validações das credenciais:**

- `JWT_SECRET`: deve conter, no mínimo, 32 caracteres.
- `SEED_ADMIN_EMAIL`: deve ser um endereço de e-mail válido.
- `SEED_ADMIN_PASSWORD`: deve conter entre 8 e 72 caracteres.

Os valores `teste@email.com` e `teste123456` são apenas exemplos. Você pode utilizar qualquer outro e-mail e senha que respeitem essas validações.

O e-mail e a senha configurados serão utilizados para criar a conta inicial de administrador.

### 4. Inicie a aplicação

Execute:

```bash
docker compose up --build -d
```

Aguarde os containers iniciarem.

### 5. Execute as migrations

Com os containers em execução, execute:

```bash
docker compose exec backend npm run db:migrate
```

Esse comando cria as tabelas necessárias no PostgreSQL.

### 6. Execute os seeders

Em seguida, execute:

```bash
docker compose exec backend npm run db:seed
```

Esse comando cria automaticamente o usuário administrador utilizando as credenciais configuradas no `.env`.

Caso o usuário já exista, o seeder será ignorado.

### 7. Acesse a aplicação

- **Aplicação:** http://localhost:5173
- **API:** http://localhost:4000
- **Documentação Swagger:** http://localhost:4000/api-docs

Faça login utilizando o e-mail e a senha definidos nas variáveis `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.

### 8. Gerencie os containers

**Visualizar os logs:**

```bash
docker compose logs -f
```

**Parar os containers:**

```bash
docker compose down
```

**Iniciar novamente:**

```bash
docker compose up -d
```

## Estrutura do projeto

```text
saas-retiro/
├── backend/
├── frontend/
├── compose.yaml
├── .env
└── README.md
```

## Licença

Licença ainda não definida.
