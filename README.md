# MimoRH API

API REST desenvolvida como projeto final de avaliação em **QA**, com foco em automação de testes de API, validação de regras de negócio, autenticação, autorização, documentação e integração contínua.

---

## 📋 Sobre o projeto

A **MimoRH API** foi criada para auxiliar o RH na gestão de colaboradores, datas especiais, presentes e envios.

A proposta é permitir que o RH cadastre datas importantes, como aniversários e datas comemorativas, e organize presentes e entregas para os colaboradores.

O projeto foi desenvolvido sem banco de dados externo, utilizando arquivos JSON para persistência dos dados, mantendo o escopo adequado para um projeto educacional de QA.

---

## 🎯 Objetivo

O objetivo do projeto é demonstrar a aplicação de práticas de QA durante todo o ciclo de desenvolvimento de uma API, incluindo:

- levantamento e documentação de requisitos;
- definição de regras de negócio;
- planejamento de testes;
- elaboração de casos de teste;
- automação de testes de API;
- testes positivos e negativos;
- validação de códigos HTTP;
- testes de autenticação e autorização;
- validação de dados;
- documentação OpenAPI/Swagger;
- integração contínua com GitHub Actions.

---

## 🛠️ Tecnologias

| Tecnologia | Utilização |
|---|---|
| **Node.js** | Ambiente de execução |
| **Express** | Framework da API |
| **JavaScript** | Linguagem do projeto |
| **JWT** | Autenticação |
| **bcrypt** | Hash de senhas |
| **Cypress** | Automação de testes de API |
| **Swagger / OpenAPI** | Documentação da API |
| **GitHub Actions** | Integração contínua |
| **JSON** | Persistência dos dados |

---

## 🧪 Estratégia de testes

A automação foi desenvolvida utilizando **Cypress**, com foco na validação dos endpoints e das regras de negócio da API.

A suíte contempla cenários relacionados a:

- autenticação;
- cadastro e login;
- colaboradores;
- datas especiais;
- presentes;
- envios;
- autenticação JWT;
- autorização por perfil;
- validações de payload;
- recursos inexistentes;
- códigos de status HTTP;
- regras de negócio;
- máquina de estados dos envios;
- health check;
- contrato OpenAPI.

Os testes estão organizados em:

```text
cypress/
└── e2e/
    └── api/
        ├── auth.cy.js
        ├── employees.cy.js
        ├── gifts.cy.js
        ├── mimorh-api.cy.js
        ├── shipments.cy.js
        └── specialDates.cy.js
```

## ▶️ Como executar o projeto

### Pré-requisitos

- Node.js 22+
- npm

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

Utilize o arquivo [.env.example](.env.example) como referência para criar o arquivo `.env`.

O arquivo `.env` não deve ser versionado.

### Iniciar a API

```bash
npm start
```

A API será disponibilizada em `http://localhost:3000`.

## 🔎 Health Check

Para verificar se a API está funcionando:

`GET /api/health`

URL: `http://localhost:3000/api/health`

## 📖 Swagger / OpenAPI

Com a API em execução, a documentação Swagger pode ser acessada em:

`http://localhost:3000/api-docs`

O contrato OpenAPI em JSON está disponível em:

`http://localhost:3000/api-docs.json`

## 🧪 Executando os testes

### Executar a suíte de testes

```bash
npm test
```

### Abrir o Cypress em modo interativo

```bash
npm run cy:open
```

### Executar os testes em modo headless

```bash
npx cypress run
```

## 📊 Cobertura de testes

A suíte automatizada possui cenários para os principais domínios da API:

### Autenticação

- cadastro de usuário;
- login;
- validação de credenciais;
- JWT;
- acesso sem token;
- token inválido;
- permissões por perfil.

### Colaboradores

- criação;
- consulta;
- atualização;
- exclusão;
- validações;
- e-mail duplicado;
- recursos inexistentes;
- autorização.

### Datas especiais

- criação;
- consulta;
- atualização;
- exclusão;
- consulta de próximas datas;
- tipos de datas;
- relacionamento com colaboradores;
- validações.

### Presentes

- criação;
- consulta;
- atualização;
- exclusão;
- validação de preço;
- validação de dados;
- autorização.

### Envios

- criação;
- consulta;
- atualização de status;
- relacionamento entre colaborador, presente e data especial;
- validação de status;
- máquina de estados;
- cancelamento;
- estados finais.

## 🔐 Autenticação

A API utiliza JWT (JSON Web Token) para autenticação.

As rotas protegidas utilizam o header:

```text
Authorization: Bearer <token>
```

As senhas dos usuários são armazenadas utilizando hash com bcrypt.

A API também diferencia usuários comuns e administradores para controle de autorização.

## 🔄 CI — GitHub Actions

O projeto possui uma pipeline de integração contínua em [.github/workflows/ci.yml](.github/workflows/ci.yml).

A pipeline realiza:

- checkout do código;
- configuração do Node.js;
- instalação das dependências;
- inicialização da API;
- validação do health check;
- execução dos testes automatizados.

A execução da CI permite validar automaticamente o projeto a cada alteração enviada ao repositório.

## 📚 Documentação

A documentação completa está organizada na pasta [`docs/`](docs/).

| Documento | Descrição |
|---|---|
| [1. Visão da API](docs/01-visao-da-api.md) | Visão geral, objetivo e escopo da API |
| [2. Endpoints e Swagger](docs/02-endpoints-e-swagger.md) | Endpoints e documentação OpenAPI |
| [3. Regras de Negócio](docs/03-regras-de-negocio.md) | Regras funcionais da API |
| [4. Testes da API](docs/04-testes-da-api.md) | Estratégia e tipos de testes |
| [5. CI da API](docs/05-ci-da-api.md) | Configuração da integração contínua |
| [6. Plano de Testes](docs/06-plano-de-testes.md) | Planejamento e estratégia de testes |
| [7. Casos de Teste](docs/07-casos-de-teste-da-api.md) | Casos de teste e rastreabilidade |

## 📁 Estrutura do projeto

```text
portfolio-mentoria/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── cypress/
│   └── e2e/
│       └── api/
│           ├── auth.cy.js
│           ├── employees.cy.js
│           ├── gifts.cy.js
│           ├── mimorh-api.cy.js
│           ├── shipments.cy.js
│           └── specialDates.cy.js
│
├── docs/
│   ├── 01-visao-da-api.md
│   ├── 02-endpoints-e-swagger.md
│   ├── 03-regras-de-negocio.md
│   ├── 04-testes-da-api.md
│   ├── 05-ci-da-api.md
│   ├── 06-plano-de-testes.md
│   └── 07-casos-de-teste-da-api.md
│
├── src/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

## 📌 Status do projeto

Projeto em desenvolvimento e validação como parte de uma avaliação final de QA.

A suíte de testes automatizados e a pipeline de CI fazem parte do processo de validação contínua do projeto.

## 👩‍💻 Projeto

MimoRH API

Projeto desenvolvido para fins educacionais e de avaliação em QA, com foco em automação de testes de API e aplicação de práticas de qualidade de software.
