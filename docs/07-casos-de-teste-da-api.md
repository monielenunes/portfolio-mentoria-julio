# 07. Casos de Teste da API — MimoRH

Este documento reúne os principais casos de teste definidos para validação da MimoRH API.

Os casos estão organizados por domínio funcional e possuem rastreabilidade por meio dos identificadores `CT-API-XXX`, utilizados também na automação Cypress.

---

## 1. Informações do Documento

| Campo | Informação |
|---|---|
| Projeto | MimoRH API |
| Tipo | Casos de Teste de API |
| Automação | Cypress |
| Linguagem | JavaScript |
| Identificação | CT-API-XXX |
| Execução | Cypress |
| Persistência | Arquivos JSON locais |
| Ambiente | Local / CI |
| Base URL | `http://localhost:3000` |

---

# 2. Health Check e Documentação

## CT-API-001 — Health check da API

| Campo | Detalhe |
|---|---|
| Objetivo | Validar se a API está disponível |
| Método | GET |
| Endpoint | `/api/health` |
| Pré-condição | API em execução |
| Resultado esperado | HTTP 200 e `status: ok` |

---

## CT-API-002 — Disponibilidade da documentação Swagger

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o acesso à documentação da API |
| Método | GET |
| Endpoint | `/api-docs/` |
| Pré-condição | API em execução |
| Resultado esperado | Documentação Swagger disponível |

---

## CT-API-003 — Disponibilidade do documento OpenAPI

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o retorno da especificação OpenAPI |
| Método | GET |
| Endpoint | `/api-docs.json` |
| Pré-condição | API em execução |
| Resultado esperado | HTTP 200 e documento OpenAPI válido |

---

# 3. Autenticação e Autorização

## CT-API-004 — Cadastro de usuário com dados válidos

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o cadastro de um novo usuário |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | Nome, e-mail e senha válidos |
| Resultado esperado | HTTP 201, usuário criado e role `user` |

---

## CT-API-005 — Senha não retornada no cadastro

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que a senha não seja exposta na resposta |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Resultado esperado | HTTP 201 e ausência do campo de senha na resposta |

---

## CT-API-006 — Cadastro com e-mail já existente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar a regra de unicidade do e-mail |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Resultado esperado | HTTP 409 |

---

## CT-API-007 — Cadastro com dados obrigatórios ausentes

| Campo | Detalhe |
|---|---|
| Objetivo | Validar obrigatoriedade dos campos do cadastro |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Resultado esperado | HTTP 400 |

---

## CT-API-008 — Cadastro com e-mail inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar formato do e-mail |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Resultado esperado | HTTP 400 |

---

## CT-API-009 — Login com credenciais válidas

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autenticação de usuário |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Resultado esperado | HTTP 200 e token JWT |

---

## CT-API-010 — Login com credenciais inválidas

| Campo | Detalhe |
|---|---|
| Objetivo | Validar bloqueio de credenciais incorretas |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Resultado esperado | HTTP 401 |

---

## CT-API-011 — Login sem dados obrigatórios

| Campo | Detalhe |
|---|---|
| Objetivo | Validar payload incompleto no login |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Resultado esperado | HTTP 400 |

---

## CT-API-012 — Acesso protegido sem token

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir proteção das rotas autenticadas |
| Método | GET |
| Endpoint | Rotas protegidas |
| Resultado esperado | HTTP 401 |

---

## CT-API-013 — Acesso protegido com token inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de token inválido |
| Método | GET |
| Endpoint | Rota protegida |
| Resultado esperado | HTTP 401 |

---

## CT-API-014 — Acesso protegido com token expirado

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de JWT expirado |
| Método | GET |
| Endpoint | Rota protegida |
| Resultado esperado | HTTP 401 |

---

## CT-API-015 — Usuário comum tentando executar operação administrativa

| Campo | Detalhe |
|---|---|
| Objetivo | Validar controle de acesso por perfil |
| Método | POST |
| Endpoint | `/api/employees` |
| Perfil | `user` |
| Resultado esperado | HTTP 403 |

---

# 4. Colaboradores

## CT-API-016 — Listar colaboradores autenticado

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de colaboradores |
| Método | GET |
| Endpoint | `/api/employees` |
| Autenticação | JWT válido |
| Resultado esperado | HTTP 200 |

---

## CT-API-017 — Listar colaboradores sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir proteção da consulta |
| Método | GET |
| Endpoint | `/api/employees` |
| Resultado esperado | HTTP 401 |

---

## CT-API-018 — Criar colaborador com perfil admin

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cadastro administrativo |
| Método | POST |
| Endpoint | `/api/employees` |
| Perfil | `admin` |
| Resultado esperado | HTTP 201 |

---

## CT-API-019 — Criar colaborador sem perfil admin

| Campo | Detalhe |
|---|---|
| Objetivo | Validar bloqueio de usuário comum |
| Método | POST |
| Endpoint | `/api/employees` |
| Perfil | `user` |
| Resultado esperado | HTTP 403 |

---

## CT-API-020 — Criar colaborador com dados inválidos

| Campo | Detalhe |
|---|---|
| Objetivo | Validar regras de obrigatoriedade |
| Método | POST |
| Endpoint | `/api/employees` |
| Resultado esperado | HTTP 400 |

---

## CT-API-021 — Criar colaborador com e-mail duplicado

| Campo | Detalhe |
|---|---|
| Objetivo | Validar unicidade do e-mail |
| Método | POST |
| Endpoint | `/api/employees` |
| Resultado esperado | HTTP 409 |

---

## CT-API-022 — Criar colaborador com data de nascimento futura

| Campo | Detalhe |
|---|---|
| Objetivo | Validar regra de data de nascimento |
| Método | POST |
| Endpoint | `/api/employees` |
| Resultado esperado | HTTP 400 |

---

## CT-API-023 — Criar colaborador com endereço incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Validar obrigatoriedade do endereço |
| Método | POST |
| Endpoint | `/api/employees` |
| Resultado esperado | HTTP 400 |

---

## CT-API-024 — Consultar colaborador por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta individual |
| Método | GET |
| Endpoint | `/api/employees/:id` |
| Resultado esperado | HTTP 200 e dados do colaborador |

---

## CT-API-025 — Consultar colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de ID inexistente |
| Método | GET |
| Endpoint | `/api/employees/:id` |
| Resultado esperado | HTTP 404 |

---

## CT-API-026 — Atualizar colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar atualização de colaborador |
| Método | PUT |
| Endpoint | `/api/employees/:id` |
| Perfil | `admin` |
| Resultado esperado | HTTP 200 |

---

## CT-API-027 — Atualizar colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar atualização de registro inexistente |
| Método | PUT |
| Endpoint | `/api/employees/:id` |
| Resultado esperado | HTTP 404 |

---

## CT-API-028 — Excluir colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar remoção de colaborador |
| Método | DELETE |
| Endpoint | `/api/employees/:id` |
| Perfil | `admin` |
| Resultado esperado | HTTP 204 |

---

## CT-API-029 — Excluir colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de ID inexistente |
| Método | DELETE |
| Endpoint | `/api/employees/:id` |
| Resultado esperado | HTTP 404 |

---

# 5. Datas Especiais

## CT-API-030 — Listar datas especiais

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta das datas cadastradas |
| Método | GET |
| Endpoint | `/api/special-dates` |
| Autenticação | JWT válido |
| Resultado esperado | HTTP 200 |

---

## CT-API-031 — Criar data especial válida

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de data especial |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Perfil | `admin` |
| Resultado esperado | HTTP 201 |

---

## CT-API-032 — Criar data com tipo inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tipos permitidos |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Resultado esperado | HTTP 400 |

---

## CT-API-033 — Criar data para colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar relacionamento com colaborador |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Resultado esperado | HTTP 404 |

---

## CT-API-034 — Criar data com payload incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Validar campos obrigatórios |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Resultado esperado | HTTP 400 |

---

## CT-API-035 — Consultar próximas datas especiais

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de próximas datas |
| Método | GET |
| Endpoint | `/api/special-dates/upcoming` |
| Autenticação | JWT válido |
| Resultado esperado | HTTP 200 |

---

## CT-API-036 — Consultar data especial por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta individual |
| Método | GET |
| Endpoint | `/api/special-dates/:id` |
| Resultado esperado | HTTP 200 |

---

## CT-API-037 — Atualizar data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar atualização de data especial |
| Método | PUT |
| Endpoint | `/api/special-dates/:id` |
| Perfil | `admin` |
| Resultado esperado | HTTP 200 |

---

## CT-API-038 — Excluir data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar remoção de data especial |
| Método | DELETE |
| Endpoint | `/api/special-dates/:id` |
| Perfil | `admin` |
| Resultado esperado | HTTP 204 |

---

# 6. Presentes

## CT-API-039 — Listar presentes

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta dos presentes |
| Método | GET |
| Endpoint | `/api/gifts` |
| Autenticação | JWT válido |
| Resultado esperado | HTTP 200 |

---

## CT-API-040 — Criar presente válido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de presente |
| Método | POST |
| Endpoint | `/api/gifts` |
| Perfil | `admin` |
| Resultado esperado | HTTP 201 |

---

## CT-API-041 — Criar presente com preço igual a zero

| Campo | Detalhe |
|---|---|
| Objetivo | Validar regra de preço |
| Método | POST |
| Endpoint | `/api/gifts` |
| Resultado esperado | HTTP 400 |

---

## CT-API-042 — Criar presente com preço negativo

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de preço negativo |
| Método | POST |
| Endpoint | `/api/gifts` |
| Resultado esperado | HTTP 400 |

---

## CT-API-043 — Criar presente com dados obrigatórios ausentes

| Campo | Detalhe |
|---|---|
| Objetivo | Validar payload incompleto |
| Método | POST |
| Endpoint | `/api/gifts` |
| Resultado esperado | HTTP 400 |

---

## CT-API-044 — Consultar presente por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta individual |
| Método | GET |
| Endpoint | `/api/gifts/:id` |
| Resultado esperado | HTTP 200 |

---

## CT-API-045 — Consultar presente inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de recurso inexistente |
| Método | GET |
| Endpoint | `/api/gifts/:id` |
| Resultado esperado | HTTP 404 |

---

## CT-API-046 — Atualizar presente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar atualização de presente |
| Método | PUT/PATCH |
| Endpoint | `/api/gifts/:id` |
| Perfil | `admin` |
| Resultado esperado | HTTP 200 |

---

## CT-API-047 — Excluir presente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar remoção de presente |
| Método | DELETE |
| Endpoint | `/api/gifts/:id` |
| Perfil | `admin` |
| Resultado esperado | HTTP 204 |

---

# 7. Envios

## CT-API-048 — Listar envios

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta dos envios |
| Método | GET |
| Endpoint | `/api/shipments` |
| Autenticação | JWT válido |
| Resultado esperado | HTTP 200 |

---

## CT-API-049 — Listar envios sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Validar proteção do endpoint |
| Método | GET |
| Endpoint | `/api/shipments` |
| Resultado esperado | HTTP 401 |

---

## CT-API-050 — Criar envio válido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de envio |
| Método | POST |
| Endpoint | `/api/shipments` |
| Perfil | `admin` |
| Resultado esperado | HTTP 201 |

---

## CT-API-051 — Novo envio inicia como PENDING

| Campo | Detalhe |
|---|---|
| Objetivo | Validar estado inicial do envio |
| Método | POST |
| Endpoint | `/api/shipments` |
| Resultado esperado | HTTP 201 e status `PENDING` |

---

## CT-API-052 — Criar envio com colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar relacionamento com colaborador |
| Método | POST |
| Endpoint | `/api/shipments` |
| Resultado esperado | HTTP 404 |

---

## CT-API-053 — Criar envio com presente inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar relacionamento com presente |
| Método | POST |
| Endpoint | `/api/shipments` |
| Resultado esperado | HTTP 404 |

---

## CT-API-054 — Criar envio sem relacionamento obrigatório

| Campo | Detalhe |
|---|---|
| Objetivo | Validar obrigatoriedade dos relacionamentos |
| Método | POST |
| Endpoint | `/api/shipments` |
| Resultado esperado | HTTP 400 |

---

## CT-API-055 — Consultar envio por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta individual |
| Método | GET |
| Endpoint | `/api/shipments/:id` |
| Resultado esperado | HTTP 200 |

---

## CT-API-056 — Consultar envio inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de ID inexistente |
| Método | GET |
| Endpoint | `/api/shipments/:id` |
| Resultado esperado | HTTP 404 |

---

## CT-API-057 — Alterar envio de PENDING para ORDERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar transição permitida |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status atual | `PENDING` |
| Novo status | `ORDERED` |
| Resultado esperado | HTTP 200 |

---

## CT-API-058 — Alterar envio de ORDERED para SHIPPED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar transição permitida |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status atual | `ORDERED` |
| Novo status | `SHIPPED` |
| Resultado esperado | HTTP 200 |

---

## CT-API-059 — Alterar envio de SHIPPED para DELIVERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar conclusão do fluxo de envio |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status atual | `SHIPPED` |
| Novo status | `DELIVERED` |
| Resultado esperado | HTTP 200 |

---

## CT-API-060 — Cancelar envio PENDING

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cancelamento permitido |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status atual | `PENDING` |
| Novo status | `CANCELLED` |
| Resultado esperado | HTTP 200 |

---

## CT-API-061 — Cancelar envio ORDERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cancelamento de envio ORDERED |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status atual | `ORDERED` |
| Novo status | `CANCELLED` |
| Resultado esperado | HTTP 200 |

---

## CT-API-062 — Cancelar envio SHIPPED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cancelamento de envio SHIPPED |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status atual | `SHIPPED` |
| Novo status | `CANCELLED` |
| Resultado esperado | HTTP 200 |

---

## CT-API-063 — Bloquear transição de status inválida

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que a máquina de estados impeça transições não permitidas |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Resultado esperado | HTTP 400 e status original preservado |

---

# 8. Regras Gerais de Validação

Os casos de teste também devem considerar as seguintes condições:

- Rotas protegidas devem exigir JWT válido.
- Operações administrativas devem exigir perfil `admin`.
- Usuários cadastrados publicamente devem receber perfil `user`.
- Senhas não devem ser retornadas nas respostas da API.
- Colaboradores devem possuir e-mail único.
- Datas de nascimento não podem estar no futuro.
- Datas especiais devem possuir colaborador válido e tipo permitido.
- Presentes devem possuir preço maior que zero.
- Envios devem possuir os relacionamentos necessários.
- Novos envios devem iniciar com status `PENDING`.
- Transições de status devem respeitar a máquina de estados definida pela API.
- Estados finais não devem permitir novas transições.
- Recursos inexistentes devem retornar HTTP 404.
- Payloads inválidos ou incompletos devem retornar HTTP 400.
- Falhas de autenticação devem retornar HTTP 401.
- Falhas de autorização devem retornar HTTP 403.

---

# 9. Cenários Negativos

A estratégia de testes contempla também cenários negativos para verificar o comportamento da API diante de entradas inválidas ou condições não autorizadas.

Entre eles:

- Requisição sem autenticação.
- Token inválido.
- Token expirado.
- Usuário sem permissão administrativa.
- Payload incompleto.
- Dados em formato inválido.
- E-mail duplicado.
- Data de nascimento futura.
- Data especial com tipo inválido.
- Relacionamento com recurso inexistente.
- Preço igual ou inferior a zero.
- ID inexistente.
- Transição de status não permitida.

---

# 10. Critérios de Aceitação

Um caso de teste é considerado aprovado quando:

1. A requisição é executada conforme a condição definida.
2. O status HTTP retornado corresponde ao comportamento esperado.
3. O corpo da resposta contém os dados esperados.
4. As regras de autenticação e autorização são respeitadas.
5. O estado dos dados é alterado somente quando a operação é válida.
6. Nenhum dado sensível, como senha, é exposto.
7. Em cenários negativos, a API rejeita corretamente a operação.

---

# 11. Automação

Os casos de teste são automatizados utilizando Cypress.

A suíte está organizada por domínio:

- `auth.cy.js`
- `employees.cy.js`
- `specialDates.cy.js`
- `gifts.cy.js`
- `shipments.cy.js`
- `mimorh-api.cy.js`

Os testes utilizam requisições HTTP diretamente contra a API, permitindo validar os endpoints sem depender de interface gráfica.

A execução pode ser realizada por:

```bash
npm test