# 06. Plano e Estratégia de Testes — MimoRH API

Este documento define a estratégia de testes da MimoRH API. Ele cobre comportamento funcional dos endpoints, autenticação, autorização, validações, regras de negócio, relacionamentos entre recursos, transições de status e execução automatizada com Cypress.

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

Os testes validam que a API atende às regras funcionais para gestão de colaboradores, datas especiais, presentes e envios.

O foco da estratégia é verificar:

- disponibilidade da API e contrato OpenAPI;
- cadastro e login de usuários;
- autenticação JWT e autorização por role;
- operações de CRUD disponíveis nos módulos;
- validações de payload e códigos HTTP;
- integridade dos relacionamentos entre colaboradores, datas, presentes e envios;
- máquina de estados dos envios;
- cenários positivos, negativos e de regressão automatizada;
- execução da suíte na integração contínua.

---

## 3. Escopo de Testes

### Health e documentação da API

Validar a disponibilidade por `GET /api/health` e a especificação por `GET /api-docs.json`, incluindo a versão OpenAPI e o título da API.

### Autenticação

Validar cadastro público, atribuição da role `user`, proteção da senha na resposta, formato e duplicidade de e-mail, login, JWT, credenciais inválidas, token ausente, token inválido e token expirado.

### Colaboradores

Validar consulta, criação, consulta por identificador, `PUT`, `PATCH` e exclusão. A cobertura inclui permissões, e-mail inválido ou duplicado, dados obrigatórios, endereço incompleto, data de nascimento inválida ou futura e recurso inexistente.

### Datas especiais

Validar CRUD, consulta de próximas datas, relacionamento com colaborador, tipos permitidos, data válida, payload obrigatório, permissões e identificadores inexistentes.

### Presentes

Validar CRUD, preço positivo, dados obrigatórios, preço zero, negativo ou não numérico, permissões e recurso inexistente.

### Envios

Validar listagem, consulta por identificador, criação, mensagem obrigatória, relacionamentos obrigatórios, status inicial `PENDING`, autorização e alteração de status conforme a máquina de estados.

---

## 4. Fora do Escopo

Esta avaliação é focada em automação de API. Não fazem parte do escopo atual:

- frontend ou interface gráfica;
- testes visuais e testes E2E de interface;
- banco de dados externo, pois a API persiste dados em arquivos JSON locais;
- integrações externas, pois a API não possui integrações desse tipo documentadas;
- testes de desempenho, carga ou tempo de resposta, pois não há cenários automatizados para essas categorias.

---

## 5. Estratégia de Testes

### Testes funcionais

Os endpoints documentados são exercitados com `cy.request()`. São verificados status HTTP, propriedades relevantes da resposta e persistência funcional necessária para o fluxo de cada cenário.

### Testes positivos

Os cenários positivos usam payloads válidos e, nas rotas protegidas, tokens de administrador. Incluem criação, consulta, atualização, exclusão e transições permitidas de envios.

### Testes negativos

Os testes negativos verificam, entre outros cenários:

- campos obrigatórios ausentes;
- e-mail inválido ou duplicado;
- data inexistente, formato de data inválido e data futura;
- preço zero, negativo ou não numérico;
- token ausente, inválido ou expirado;
- usuário comum em operação administrativa;
- recurso ou relacionamento inexistente;
- status inexistente e transição de status bloqueada.

### Testes de autorização

A estratégia diferencia:

- requisição sem token, com resposta esperada `401`;
- token inválido ou expirado, com resposta esperada `401`;
- usuário comum em operação administrativa, com resposta esperada `403`;
- administrador com payload válido, autorizado a criar, atualizar ou excluir recursos administrativos.

### Testes de validação e regras de negócio

As validações dos domínios são verificadas pela suíte Cypress e detalhadas em [03-regras-de-negocio.md](03-regras-de-negocio.md). O foco inclui unicidade de e-mail, datas reais, preços positivos, relações existentes e o fluxo de status do envio.

### Testes de regressão

A suíte completa deve ser executada após alterações para confirmar que os comportamentos já cobertos continuam funcionando. O reset da baseline de dados é aplicado antes e depois de cada cenário para reduzir dependência de ordem entre os testes.

---

## 6. Critérios de Entrada

Antes de executar os testes, devem estar disponíveis:

- dependências instaladas com `npm install` ou `npm ci`;
- API iniciada em `http://localhost:3000`;
- health check disponível em `GET /api/health`;
- arquivos de dados em `src/data/` acessíveis para a API;
- baseline em `cypress/fixtures/database/` acessível para o reset dos testes;
- Cypress configurado com `baseUrl` igual a `http://localhost:3000`.

---

## 7. Critérios de Saída

A execução pode ser considerada apta quando:

- a suíte Cypress é concluída;
- os cenários críticos de autenticação, autorização, validações e estados de envio são aprovados;
- não há falha bloqueadora nos endpoints cobertos;
- a API responde ao health check;
- a execução de CI conclui as etapas de instalação, health check e Cypress com sucesso.

---

## 8. Ambiente de Testes

| Item | Configuração atual |
|---|---|
| Runtime de CI | Node.js 22 |
| Gerenciador de pacotes | npm |
| Ferramenta de automação | Cypress `^15.20.1` |
| Base URL do Cypress | `http://localhost:3000` |
| Porta padrão da API | `3000` |
| Persistência | JSON local em `src/data/` |
| CI | GitHub Actions em `ubuntu-latest` |
| JWT no CI | Variável `JWT_SECRET` definida pelo workflow |

O ambiente local pode usar `.env`, com `.env.example` como referência. A API também considera `JWT_EXPIRES_IN` para controlar a duração do token; quando ausente, o comportamento local usa a duração padrão implementada pela API.

---

## 9. Dados de Teste

Os dados operacionais da API ficam em arquivos JSON locais:

```text
src/data/users.json
src/data/employees.json
src/data/specialDates.json
src/data/gifts.json
src/data/shipments.json
```

Os testes utilizam fixtures de payload, como `validUser.json`, `validEmployee.json`, `validSpecialDate.json`, `validGift.json` e `validShipment.json`.

Para isolamento, `cypress.config.js` lê uma baseline fixa e versionada em:

```text
cypress/fixtures/database/
```

O comando `resetData` restaura os cinco arquivos JSON da API para essa baseline. Os specs também executam reset antes dos cenários, e o suporte global restaura os dados após cada teste.

---

## 10. Organização da Automação

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
├── fixtures/
│   ├── database/
│   ├── validEmployee.json
│   ├── validGift.json
│   ├── validShipment.json
│   ├── validSpecialDate.json
│   └── validUser.json
└── support/
    ├── commands.js
    └── e2e.js
```

Responsabilidades dos specs:

- `mimorh-api.cy.js`: health check e contrato OpenAPI;
- `auth.cy.js`: cadastro, login e segurança do JWT;
- `employees.cy.js`: regras e CRUD de colaboradores;
- `specialDates.cy.js`: regras, CRUD e próximas datas;
- `gifts.cy.js`: regras e CRUD de presentes;
- `shipments.cy.js`: criação, consulta e estados de envio.

Os comandos compartilhados incluem login administrativo, login de usuário comum e reset dos dados.

---

## 11. Matriz de Cobertura

| Módulo | Funcionalidade | Cobertura automatizada |
|---|---|---|
| Health / OpenAPI | Health check e especificação | `CT-API-001`, `CT-API-045` |
| Auth | Cadastro, login, JWT e falhas de autenticação | `CT-API-005` a `CT-API-012`, `CT-API-046` |
| Employees | CRUD, autorização e validações | `CT-API-013` a `CT-API-025`, `CT-API-047` a `CT-API-049` |
| Special Dates | CRUD, upcoming, relação e validações | `CT-API-026` a `CT-API-029`, `CT-API-050` a `CT-API-054` |
| Gifts | CRUD, preço e autorização | `CT-API-030` a `CT-API-033`, `CT-API-055` a `CT-API-058` |
| Shipments | Consulta, criação, relações e máquina de estados | `CT-API-034` a `CT-API-044`, `CT-API-059` a `CT-API-066` |

---

## 12. Casos de Teste e Rastreabilidade

Os cenários automatizados usam o padrão `CT-API-XXX` no título de cada teste Cypress.

Foram identificados 63 cenários nos specs atuais:

```text
CT-API-001
CT-API-005 a CT-API-066
```

Há uma divergência de rastreabilidade: [07-casos-de-teste-da-api.md](07-casos-de-teste-da-api.md) lista somente sete casos (`CT-API-001`, `005`, `012`, `027`, `032`, `036` e `043`), enquanto os seis specs Cypress contêm todos os 63 cenários acima. O padrão de identificação é consistente entre os arquivos, mas o documento de casos ainda não enumera a cobertura completa dos specs.

---

## 13. Testes Não Funcionais

### Segurança

A suíte verifica aspectos de segurança compatíveis com o escopo de API:

- autenticação por JWT;
- acesso sem token e com token inválido ou expirado;
- autorização por role `user` e `admin`;
- não exposição da senha em cadastro e login;
- uso de hash bcrypt para credenciais pela API.

### Contrato e documentação

O contrato OpenAPI é validado por teste automatizado em `GET /api-docs.json`, verificando a versão `3.0.3` e o título `MimoRH API`.

Não há cenários automatizados de desempenho, carga, disponibilidade contínua ou tempo de resposta.

---

## 14. Automação e Execução

Os comandos disponíveis em `package.json` são:

| Comando | Uso |
|---|---|
| `npm start` | Inicia a API. |
| `npm run dev` | Inicia a API em modo watch. |
| `npm test` | Executa `npm run cy:run`. |
| `npm run cy:open` | Abre o Cypress em modo interativo. |
| `npm run cy:run` | Executa Cypress em modo headless. |
| `npm run test:api` | Executa os specs de `cypress/e2e/api/**/*.cy.js`. |

Para a execução local dos testes de API, a aplicação deve estar em execução antes do comando Cypress.

---

## 15. CI/CD

O workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) é executado em `push` e `pull_request`.

O job configurado:

1. executa checkout do repositório;
2. configura Node.js 22 e cache npm;
3. executa `npm ci`;
4. inicia a API;
5. aguarda `GET /api/health` por até 30 tentativas;
6. executa `npx cypress run`.

O health check encerra com erro quando a API não fica disponível. A etapa Cypress também faz o workflow falhar caso o comando retorne erro.

---

## 16. Critérios de Aprovação

Para aprovação da regressão coberta por este plano, espera-se:

- API iniciada e health check disponível;
- dados de teste restaurados pela baseline;
- execução da suíte Cypress;
- aprovação dos cenários críticos de autenticação, autorização, validações, relacionamentos e máquina de estados;
- ausência de falhas bloqueadoras nos endpoints cobertos;
- workflow de CI concluído com sucesso.

---

## 17. Defeitos Conhecidos / Riscos

| ID | Descrição | Impacto | Status |
|---|---|---|---|
| RSK-01 | `docs/07-casos-de-teste-da-api.md` relaciona sete casos, enquanto os specs Cypress atuais possuem 63 cenários identificados. | A rastreabilidade documental não representa toda a cobertura automatizada. | Aberto |
| RSK-02 | Os testes restauram arquivos JSON compartilhados em `src/data/`. | Execuções concorrentes sobre o mesmo diretório podem disputar os mesmos arquivos de dados. | Aberto |
