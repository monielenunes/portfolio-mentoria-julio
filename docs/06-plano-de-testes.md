# 06. Plano e Estratégia de Testes — MimoRH API

Este documento define a estratégia de testes da MimoRH API. Ele cobre o comportamento funcional dos endpoints, autenticação, autorização, validações, regras de negócio, relacionamentos entre recursos, transições de status e execução automatizada com Cypress.

---

## 1. Informações do Documento

| Campo | Informação |
|---|---|
| Projeto | MimoRH API |
| Tipo | Plano de Testes de API |
| Linguagem | JavaScript |
| Framework de automação | Cypress |
| Forma de execução | Cypress com `cy.request()` |
| Persistência testada | Arquivos JSON locais |
| CI/CD | GitHub Actions |
| Ambiente de CI | Node.js 22 em `ubuntu-latest` |

---

## 2. Objetivo dos Testes

Os testes têm como objetivo validar que a MimoRH API atende às regras funcionais definidas para gerenciamento de usuários, colaboradores, datas especiais, presentes e envios.

A estratégia busca verificar:

- disponibilidade da API e da especificação OpenAPI;
- cadastro e autenticação de usuários;
- geração e validação de tokens JWT;
- autorização baseada em perfil;
- operações de criação, consulta, atualização e exclusão;
- validações de payload;
- códigos HTTP esperados;
- integridade dos relacionamentos entre recursos;
- regras de negócio dos diferentes módulos;
- máquina de estados dos envios;
- cenários positivos e negativos;
- execução automatizada da regressão.

---

## 3. Escopo de Testes

### 3.1 Health e documentação da API

Validar a disponibilidade da API por meio de `GET /api/health`.

Também é validada a disponibilidade da especificação OpenAPI por meio de `GET /api-docs.json`, verificando o status da resposta, a versão OpenAPI e o título da API.

---

### 3.2 Autenticação e autorização

Validar:

- cadastro de usuários;
- atribuição automática da role `user`;
- proteção da senha na resposta de cadastro;
- validação de campos obrigatórios;
- validação do formato do e-mail;
- bloqueio de e-mails duplicados;
- login com credenciais válidas;
- geração de JWT;
- validação das claims do token;
- rejeição de credenciais inválidas;
- bloqueio de rotas sem token;
- bloqueio de tokens inválidos;
- bloqueio de tokens expirados;
- diferenciação entre usuários comuns e administradores.

---

### 3.3 Colaboradores

Validar:

- listagem de colaboradores;
- consulta por identificador;
- criação;
- atualização completa com `PUT`;
- atualização parcial com `PATCH`;
- exclusão;
- autenticação;
- autorização administrativa;
- campos obrigatórios;
- e-mail inválido;
- e-mail duplicado;
- endereço incompleto;
- data de nascimento futura;
- data de nascimento calendariamente inválida;
- colaborador inexistente.

---

### 3.4 Datas especiais

Validar:

- criação;
- consulta de próximas datas;
- atualização parcial;
- atualização completa;
- exclusão;
- relacionamento com colaborador;
- tipos permitidos;
- campos obrigatórios;
- data calendariamente inválida;
- colaborador inexistente;
- autorização administrativa;
- recurso inexistente.

---

### 3.5 Presentes

Validar:

- criação;
- consulta por identificador;
- atualização parcial;
- atualização completa;
- exclusão;
- campos obrigatórios;
- preço positivo;
- preço zero;
- preço negativo;
- preço não numérico;
- autorização administrativa;
- recurso inexistente.

---

### 3.6 Envios

Validar:

- listagem;
- consulta por identificador;
- criação;
- campos obrigatórios;
- mensagem obrigatória;
- relacionamentos com colaborador, presente e data especial;
- status inicial `PENDING`;
- autorização administrativa;
- transições permitidas;
- transições inválidas;
- cancelamento;
- terminalidade dos status `DELIVERED` e `CANCELLED`;
- recurso inexistente.

---

## 4. Fora do Escopo

Esta avaliação é focada em automação de API.

Não fazem parte do escopo atual:

- frontend ou interface gráfica;
- testes visuais;
- testes E2E de interface;
- banco de dados externo;
- integrações externas;
- testes de carga;
- testes de stress;
- testes de performance;
- testes de segurança especializados ou penetration testing.

A API utiliza arquivos JSON locais para persistência, portanto não é necessário um banco de dados externo para esta avaliação.

---

## 5. Estratégia de Testes

### 5.1 Testes funcionais

Os endpoints são exercitados diretamente por meio do Cypress utilizando `cy.request()`.

São avaliados:

- status HTTP;
- corpo das respostas;
- propriedades relevantes;
- criação e alteração dos registros;
- regras de negócio;
- relacionamentos entre recursos;
- comportamento esperado em situações de erro.

---

### 5.2 Testes positivos

Os cenários positivos utilizam dados válidos e, quando necessário, autenticação com usuário administrador.

São contempladas operações como:

- criação de recursos;
- consultas;
- atualização;
- exclusão;
- autenticação;
- geração de JWT;
- transições permitidas de status;
- criação de recursos relacionados.

---

### 5.3 Testes negativos

Os cenários negativos verificam o comportamento da API diante de entradas inválidas ou operações não permitidas.

São contemplados:

- campos obrigatórios ausentes;
- e-mail inválido;
- e-mail duplicado;
- datas futuras;
- datas calendariamente inválidas;
- endereço incompleto;
- preço zero;
- preço negativo;
- preço não numérico;
- token ausente;
- token inválido;
- token expirado;
- usuário comum tentando realizar operações administrativas;
- recursos inexistentes;
- relacionamentos inexistentes;
- status inválido;
- transições de status não permitidas.

---

### 5.4 Testes de autenticação e autorização

A estratégia diferencia os principais cenários de acesso:

| Situação | Resultado esperado |
|---|---|
| Sem token | HTTP 401 |
| Token inválido | HTTP 401 |
| Token expirado | HTTP 401 |
| Usuário comum em operação administrativa | HTTP 403 |
| Administrador com dados válidos | Operação permitida |

---

### 5.5 Testes de validação e regras de negócio

As validações dos diferentes módulos são exercitadas diretamente pela suíte Cypress.

Entre as principais regras verificadas estão:

- usuário cadastrado publicamente recebe role `user`;
- senha não é retornada na resposta de cadastro;
- e-mails devem possuir formato válido;
- e-mails duplicados são rejeitados;
- datas de nascimento não podem estar no futuro;
- datas calendariamente inválidas são rejeitadas;
- endereços incompletos são rejeitados;
- presentes devem possuir preço maior que zero;
- envios devem possuir relacionamentos válidos;
- novos envios iniciam com `PENDING`;
- transições de status devem seguir a máquina de estados;
- estados `DELIVERED` e `CANCELLED` não permitem novas transições.

As regras de negócio são detalhadas no documento `03-regras-de-negocio.md`.

---

### 5.6 Testes de regressão

A suíte completa deve ser executada após alterações na API para verificar se comportamentos anteriormente implementados continuam funcionando.

Os specs executam `cy.resetData()` antes dos cenários, utilizando uma baseline fixa para reduzir dependências entre os testes.

---

## 6. Critérios de Entrada

Antes da execução dos testes, devem estar disponíveis:

- dependências instaladas com `npm install` ou `npm ci`;
- API iniciada em `http://localhost:3000`;
- health check disponível em `GET /api/health`;
- arquivos de dados em `src/data/` acessíveis para a API;
- baseline de dados disponível para o reset dos testes;
- Cypress configurado com `baseUrl` igual a `http://localhost:3000`.

---

## 7. Critérios de Saída

A execução pode ser considerada concluída quando:

- a suíte Cypress foi executada;
- os cenários críticos de autenticação e autorização foram executados;
- as principais validações foram executadas;
- os relacionamentos entre recursos foram validados;
- os cenários da máquina de estados foram executados;
- o health check da API respondeu corretamente;
- os resultados da execução foram registrados;
- quando executado no CI, o workflow concluiu as etapas previstas com sucesso.

---

## 8. Ambiente de Testes

| Item | Configuração |
|---|---|
| Runtime de CI | Node.js 22 |
| Gerenciador de pacotes | npm |
| Ferramenta de automação | Cypress `^15.20.1` |
| Base URL | `http://localhost:3000` |
| Porta da API | `3000` |
| Persistência | Arquivos JSON locais |
| CI | GitHub Actions |
| Sistema operacional do CI | `ubuntu-latest` |
| JWT no CI | Variável `JWT_SECRET` |

O ambiente local pode utilizar o arquivo `.env`, tendo `.env.example` como referência.

A API também utiliza `JWT_EXPIRES_IN` para controlar a duração do token quando configurado.

---

## 9. Dados de Teste

A aplicação utiliza arquivos JSON locais para persistência:

```text
src/data/
├── users.json
├── employees.json
├── specialDates.json
├── gifts.json
└── shipments.json
````

Os testes utilizam fixtures para dados reutilizáveis:

```text
cypress/fixtures/
├── validUser.json
├── validEmployee.json
├── validSpecialDate.json
├── validGift.json
└── validShipment.json
```

Também existe uma baseline de dados utilizada pelo comando `cy.resetData()` para restaurar o estado inicial esperado pelos testes.

Os cenários que precisam de dados relacionados criam os registros necessários durante a execução.

Por exemplo, os testes de envio criam:

1. colaborador;
2. presente;
3. data especial;
4. envio.

Dessa forma, o cenário possui os relacionamentos necessários para validar o fluxo.

---

## 10. Organização da Automação

A automação está organizada por domínio funcional:

```text
cypress/
├── e2e/
│   └── api/
│       ├── auth.cy.js
│       ├── employees.cy.js
│       ├── gifts.cy.js
│       ├── mimorh-api.cy.js
│       ├── shipments.cy.js
│       └── specialDates.cy.js
│
├── fixtures/
│   ├── database/
│   ├── validEmployee.json
│   ├── validGift.json
│   ├── validShipment.json
│   ├── validSpecialDate.json
│   └── validUser.json
│
└── support/
    ├── commands.js
    └── e2e.js
```

### Responsabilidade dos specs

| Arquivo              | Cobertura                                                 |
| -------------------- | --------------------------------------------------------- |
| `mimorh-api.cy.js`   | Health check e especificação OpenAPI                      |
| `auth.cy.js`         | Cadastro, login e segurança do JWT                        |
| `employees.cy.js`    | CRUD, autorização e validações de colaboradores           |
| `specialDates.cy.js` | Datas especiais, upcoming, CRUD e validações              |
| `gifts.cy.js`        | Presentes, preços, CRUD e autorização                     |
| `shipments.cy.js`    | Envios, relacionamentos, autorização e máquina de estados |

Os comandos compartilhados são utilizados para autenticação e preparação dos dados dos cenários.

---

## 11. Matriz de Cobertura

| Módulo           | Funcionalidade                                          | Casos automatizados                                      |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Health / OpenAPI | Health check e especificação                            | `CT-API-001`, `CT-API-045`                               |
| Auth             | Cadastro, login, JWT e autenticação                     | `CT-API-005` a `CT-API-012`, `CT-API-046`                |
| Employees        | CRUD, autorização e validações                          | `CT-API-013` a `CT-API-025`, `CT-API-047` a `CT-API-049` |
| Special Dates    | Criação, consulta, atualização, exclusão e validações   | `CT-API-026` a `CT-API-029`, `CT-API-050` a `CT-API-054` |
| Gifts            | Criação, consulta, atualização, exclusão e validações   | `CT-API-030` a `CT-API-033`, `CT-API-055` a `CT-API-058` |
| Shipments        | Consulta, criação, relacionamentos e máquina de estados | `CT-API-034` a `CT-API-044`, `CT-API-059` a `CT-API-066` |

---

## 12. Casos de Teste e Rastreabilidade

Os cenários automatizados utilizam o padrão `CT-API-XXX` diretamente no título dos testes Cypress.

Atualmente, a suíte possui **63 cenários automatizados**, distribuídos entre os seis arquivos de teste da API.

Os identificadores não são necessariamente sequenciais, pois novos cenários foram adicionados posteriormente aos primeiros casos.

A rastreabilidade é mantida entre:

```text
Regra de negócio
       ↓
Caso de teste CT-API-XXX
       ↓
Teste automatizado Cypress
       ↓
Endpoint da API
       ↓
Resultado da execução
```

Os casos de teste detalhados estão documentados em:

`07-casos-de-teste-da-api.md`

---

## 13. Testes de Segurança

Dentro do escopo da avaliação, a suíte contempla verificações relacionadas à autenticação e autorização.

São testados:

* autenticação utilizando JWT;
* acesso sem token;
* token inválido;
* token expirado;
* diferenciação entre `user` e `admin`;
* bloqueio de operações administrativas para usuários comuns;
* não exposição da senha na resposta do cadastro.

A suíte não tem como objetivo substituir testes especializados de segurança ou penetration testing.

---

## 14. Contrato e Documentação

A API disponibiliza sua especificação OpenAPI por meio de:

```text
GET /api-docs.json
```

O cenário `CT-API-045` valida:

* HTTP 200;
* versão OpenAPI `3.0.3`;
* título `MimoRH API`.

Esse teste valida a disponibilidade e informações básicas do contrato OpenAPI.

Não são realizados, nesta suíte, testes automatizados completos de todos os schemas, exemplos e respostas documentadas no Swagger.

---

## 15. Automação e Execução

Os testes são executados utilizando Cypress e requisições HTTP por meio de `cy.request()`.

Comandos principais:

| Comando            | Utilização                                          |
| ------------------ | --------------------------------------------------- |
| `npm start`        | Inicia a API                                        |
| `npm run dev`      | Inicia a API em modo watch                          |
| `npm run cy:open`  | Abre o Cypress em modo interativo                   |
| `npm run cy:run`   | Executa Cypress em modo headless                    |
| `npm run test:api` | Executa os testes localizados em `cypress/e2e/api/` |

Para execução dos testes de API:

```bash
npm run test:api
```

A aplicação deve estar disponível antes da execução do Cypress.

---

## 16. CI/CD

O projeto possui workflow de CI configurado no GitHub Actions.

O fluxo contempla:

1. checkout do repositório;
2. configuração do Node.js 22;
3. instalação das dependências com `npm ci`;
4. inicialização da API;
5. verificação do health check;
6. execução da suíte Cypress.

O health check é utilizado para confirmar que a API está disponível antes da execução dos testes.

Caso a API não esteja disponível ou a execução do Cypress retorne erro, o workflow é considerado como falha.

---

## 17. Critérios de Aprovação

Para considerar a regressão coberta por este plano como aprovada, espera-se:

* API disponível;
* health check respondendo corretamente;
* dados de teste restaurados;
* suíte Cypress executada;
* cenários críticos de autenticação aprovados;
* cenários de autorização aprovados;
* principais validações aprovadas;
* relacionamentos entre recursos funcionando corretamente;
* máquina de estados dos envios funcionando conforme definida;
* ausência de falhas bloqueadoras nos endpoints cobertos;
* execução do CI concluída com sucesso quando aplicável.

---

## 18. Riscos e Observações

| ID     | Descrição                                                               | Impacto                                                                                              |
| ------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| RSK-01 | A persistência da API utiliza arquivos JSON compartilhados.             | Execuções concorrentes podem disputar os mesmos arquivos de dados.                                   |
| RSK-02 | A suíte depende da disponibilidade da API antes da execução do Cypress. | Caso a API não esteja disponível, os testes não poderão ser executados.                              |
| RSK-03 | A avaliação não utiliza banco de dados externo.                         | O comportamento validado está limitado à implementação de persistência em JSON utilizada no projeto. |

---

## 19. Resumo da Estratégia

A estratégia de testes da MimoRH API combina testes funcionais positivos e negativos, autenticação, autorização, validações de entrada, regras de negócio, relacionamentos entre recursos e controle de estados.

A automação é realizada com Cypress utilizando requisições HTTP, permitindo validar o comportamento da API sem dependência de uma interface gráfica.

Os casos são identificados por `CT-API-XXX` e documentados separadamente, permitindo rastreabilidade entre os requisitos, os cenários de teste e a automação.

O objetivo da suíte é fornecer uma regressão automatizada simples, organizada e reproduzível para os principais comportamentos da MimoRH API.


