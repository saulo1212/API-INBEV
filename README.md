# Projeto - API com Swagger, Redis e Postgres

![ChatGPT Image 27 de abr  de 2025, 07_56_34](https://github.com/user-attachments/assets/ce5a0a07-9ebb-4a82-ad18-aa8dba09acf4)


 Acesso em Produção ou local, é necessario autenticar

# Swagger (Documentação da API)

http://67.205.168.76:3333/api

Usuário: admin

Senha: 123456

# Banco de Dados - Interface Adminer

http://67.205.168.76:5050/login?next=/

Email: saulotm90@outlook.com

Senha: 123456

# Redis
Para visualizar os dados do Redis foi utilizado o My Redis Database.

# Pré-requisitos

Node.js na versão 20.11

PostgreSQL na versão 17.4.1 (ou usando Docker)

Docker e Docker Compose instalados


# Instalação e Configuração

git clone <URL_DO_REPOSITORIO>
cd <nome_do_projeto>

# Instale as dependências:

yarn install

# Subindo os serviços com Docker

Para facilitar o ambiente de desenvolvimento, foi criado um docker-compose.yml que sobe

PostgreSQL

PgAdmin4

Redis

Comando para subir os containers: docker-compose up -d

# Configure o banco de dados

Suba o banco Postgres localmente com ou use o Adminer para conectar a uma instância existente

# Realize as migrações do banco de dados

npx prisma migrate dev --name nome_da_migracao

# Execute o projeto

yarn start

# Acesse a API localmente: http://localhost:3333/api

Usuário: admin

Senha: 123456
