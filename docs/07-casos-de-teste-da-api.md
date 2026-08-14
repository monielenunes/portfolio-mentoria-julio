```md
# 07. Casos de Teste da API — MimoRH

Este documento reúne os principais casos de teste definidos para validação da MimoRH API.

Os casos estão organizados por domínio funcional e possuem rastreabilidade por meio dos identificadores `CT-API-XXX`, utilizados também nos testes automatizados Cypress.

---

## 1. Informações do Documento

| Campo | Informação |
|---|---|
| Projeto | MimoRH API |
| Tipo | Casos de Teste de API |
| Automação | Cypress |
| Linguagem | JavaScript |
| Identificação | CT-API-XXX |
| Execução | `cy.request()` |
| Persistência | Arquivos JSON locais |

---

# 2. Autenticação e Acesso

## CT-API-001 — Health check da API

| Campo | Detalhe |
|---|---|
| Objetivo | Validar se a API está disponível |
| Método | GET |
| Endpoint | `/api/health` |
| Pré-condição | API em execução |
| Resultado esperado | HTTP 200 e status `ok` |
| Automação | `mimorh-api.cy.js` |

---

## CT-API-005 — Cadastro de usuário válido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o cadastro público de usuário |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | Nome, e-mail e senha válidos |
| Resultado esperado | HTTP 201 |
| Validações | Usuário criado com role `user` e senha não exposta |
| Automação | `auth.cy.js` |

---

## CT-API-006 — Cadastro com dados obrigatórios ausentes

| Campo | Detalhe |
|---|---|
| Objetivo | Validar obrigatoriedade dos dados de cadastro |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | Payload incompleto |
| Resultado esperado | HTTP 400 |
| Automação | `auth.cy.js` |

---

## CT-API-007 — Cadastro com e-mail inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar formato do e-mail |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | E-mail em formato inválido |
| Resultado esperado | HTTP 400 |
| Automação | `auth.cy.js` |

---

## CT-API-008 — Cadastro com e-mail duplicado

| Campo | Detalhe |
|---|---|
| Objetivo | Impedir cadastro de e-mail já existente |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | E-mail previamente cadastrado |
| Resultado esperado | HTTP 409 |
| Automação | `auth.cy.js` |

---

## CT-API-009 — Login com credenciais válidas

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autenticação de usuário |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Dados | E-mail e senha válidos |
| Resultado esperado | HTTP 200 e JWT retornado |
| Automação | `auth.cy.js` |

---

## CT-API-010 — Login com credenciais inválidas

| Campo | Detalhe |
|---|---|
| Objetivo | Impedir autenticação com credenciais incorretas |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Dados | Credenciais inválidas |
| Resultado esperado | HTTP 401 |
| Automação | `auth.cy.js` |

---

## CT-API-011 — Acesso protegido sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Validar proteção de endpoints |
| Método | GET |
| Endpoint | Endpoint protegido |
| Dados | Sem Authorization |
| Resultado esperado | HTTP 401 |
| Automação | `auth.cy.js` |

---

## CT-API-012 — Acesso protegido com token inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Rejeitar JWT inválido |
| Método | GET |
| Endpoint | Endpoint protegido |
| Dados | Bearer token inválido |
| Resultado esperado | HTTP 401 |
| Automação | `auth.cy.js` |

---

# 3. Colaboradores

## CT-API-013 — Listar colaboradores

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de colaboradores |
| Método | GET |
| Endpoint | `/api/employees` |
| Resultado esperado | HTTP 200 e lista de colaboradores |
| Automação | `employees.cy.js` |

---

## CT-API-014 — Criar colaborador como administrador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de colaborador |
| Método | POST |
| Endpoint | `/api/employees` |
| Perfil | Admin |
| Dados | Payload válido |
| Resultado esperado | HTTP 201 |
| Automação | `employees.cy.js` |

---

## CT-API-015 — Criar colaborador com dados inválidos

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de payload inválido |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | Payload inválido |
| Resultado esperado | HTTP 400 |
| Automação | `employees.cy.js` |

---

## CT-API-016 — Bloquear usuário comum em operação administrativa

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização por role |
| Método | POST |
| Endpoint | `/api/employees` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `employees.cy.js` |

---

## CT-API-017 — Consultar colaborador por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta individual |
| Método | GET |
| Endpoint | `/api/employees/:id` |
| Dados | ID existente |
| Resultado esperado | HTTP 200 |
| Automação | `employees.cy.js` |

---

## CT-API-018 — Impedir e-mail duplicado de colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir unicidade do e-mail |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | E-mail já utilizado |
| Resultado esperado | HTTP 409 |
| Automação | `employees.cy.js` |

---

## CT-API-019 — Bloquear data de nascimento futura

| Campo | Detalhe |
|---|---|
| Objetivo | Validar data de nascimento |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | Data futura |
| Resultado esperado | HTTP 400 |
| Automação | `employees.cy.js` |

---

## CT-API-020 — Bloquear endereço incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Validar preenchimento do endereço |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | Endereço incompleto |
| Resultado esperado | HTTP 400 |
| Automação | `employees.cy.js` |

---

## CT-API-021 — Atualizar colaborador com PUT

| Campo | Detalhe |
|---|---|
| Objetivo | Validar substituição completa |
| Método | PUT |
| Endpoint | `/api/employees/:id` |
| Perfil | Admin |
| Resultado esperado | HTTP 200 |
| Automação | `employees.cy.js` |

---

## CT-API-022 — Atualizar colaborador com PATCH

| Campo | Detalhe |
|---|---|
| Objetivo | Validar atualização parcial |
| Método | PATCH |
| Endpoint | `/api/employees/:id` |
| Perfil | Admin |
| Resultado esperado | HTTP 200 |
| Automação | `employees.cy.js` |

---

## CT-API-023 — Bloquear atualização sem permissão

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização em atualização |
| Método | PUT/PATCH |
| Endpoint | `/api/employees/:id` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `employees.cy.js` |

---

## CT-API-024 — Consultar colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de recurso inexistente |
| Método | GET |
| Endpoint | `/api/employees/:id` |
| Dados | ID inexistente |
| Resultado esperado | HTTP 404 |
| Automação | `employees.cy.js` |

---

## CT-API-025 — Excluir colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar exclusão de colaborador |
| Método | DELETE |
| Endpoint | `/api/employees/:id` |
| Perfil | Admin |
| Resultado esperado | Operação concluída conforme contrato da API |
| Automação | `employees.cy.js` |

---

# 4. Datas Especiais

## CT-API-026 — Listar datas especiais

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de datas |
| Método | GET |
| Endpoint | `/api/special-dates` |
| Resultado esperado | HTTP 200 |
| Automação | `specialDates.cy.js` |

---

## CT-API-027 — Criar data especial válida

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de data especial |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | Colaborador existente e tipo permitido |
| Resultado esperado | HTTP 201 |
| Automação | `specialDates.cy.js` |

---

## CT-API-028 — Bloquear data especial com relacionamento inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que o colaborador informado exista |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | Employee inexistente |
| Resultado esperado | Erro de validação |
| Automação | `specialDates.cy.js` |

---

## CT-API-029 — Consultar próximas datas especiais

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de próximas datas |
| Método | GET |
| Endpoint | `/api/special-dates/upcoming` |
| Resultado esperado | HTTP 200 |
| Automação | `specialDates.cy.js` |

---

# 5. Presentes

## CT-API-030 — Listar presentes

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de presentes |
| Método | GET |
| Endpoint | `/api/gifts` |
| Resultado esperado | HTTP 200 |
| Automação | `gifts.cy.js` |

---

## CT-API-031 — Criar presente válido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de presente |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | Payload válido |
| Resultado esperado | HTTP 201 |
| Automação | `gifts.cy.js` |

---

## CT-API-032 — Bloquear presente com preço inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir preço maior que zero |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | Preço zero ou negativo |
| Resultado esperado | HTTP 400 |
| Automação | `gifts.cy.js` |

---

## CT-API-033 — Atualizar ou excluir presente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar gerenciamento administrativo de presentes |
| Método | PATCH / DELETE |
| Endpoint | `/api/gifts/:id` |
| Perfil | Admin |
| Resultado esperado | Operação concluída conforme contrato |
| Automação | `gifts.cy.js` |

---

# 6. Envios

## CT-API-034 — Listar envios

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta dos envios |
| Método | GET |
| Endpoint | `/api/shipments` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-035 — Consultar envio por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta individual |
| Método | GET |
| Endpoint | `/api/shipments/:id` |
| Dados | ID existente |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-036 — Criar envio

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de envio |
| Método | POST |
| Endpoint | `/api/shipments` |
| Dados | Relacionamentos válidos |
| Resultado esperado | HTTP 201 e status inicial `PENDING` |
| Automação | `shipments.cy.js` |

---

## CT-API-037 — Bloquear criação de envio com dados inválidos

| Campo | Detalhe |
|---|---|
| Objetivo | Validar payload de envio |
| Método | POST |
| Endpoint | `/api/shipments` |
| Dados | Payload inválido |
| Resultado esperado | HTTP 400 |
| Automação | `shipments.cy.js` |

---

## CT-API-038 — Validar relacionamentos do envio

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir existência dos recursos relacionados |
| Método | POST |
| Endpoint | `/api/shipments` |
| Dados | IDs inexistentes |
| Resultado esperado | Erro de relacionamento |
| Automação | `shipments.cy.js` |

---

## CT-API-039 — Alterar envio de PENDING para ORDERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar primeira transição permitida |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `PENDING → ORDERED` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-040 — Alterar envio de ORDERED para SHIPPED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar progressão do envio |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `ORDERED → SHIPPED` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-041 — Alterar envio de SHIPPED para DELIVERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar conclusão do envio |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `SHIPPED → DELIVERED` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-042 — Cancelar envio PENDING

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cancelamento permitido |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `PENDING → CANCELLED` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-043 — Bloquear transição de status inválida

| Campo | Detalhe |
|---|---|
| Objetivo | Impedir alteração de status fora da máquina de estados |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Dados | Transição não permitida |
| Resultado esperado | HTTP 400 |
| Automação | `shipments.cy.js` |

---

## CT-API-044 — Consultar envio inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de envio inexistente |
| Método | GET |
| Endpoint | `/api/shipments/:id` |
| Dados | ID inexistente |
| Resultado esperado | HTTP 404 |
| Automação | `shipments.cy.js` |

---

## CT-API-045 — Validar contrato OpenAPI

| Campo | Detalhe |
|---|---|
| Objetivo | Validar disponibilidade e estrutura básica da documentação |
| Método | GET |
| Endpoint | `/api-docs.json` |
| Resultado esperado | HTTP 200, OpenAPI `3.0.3` e título `MimoRH API` |
| Automação | `mimorh-api.cy.js` |

---

# 7. Cenários Complementares

Os casos abaixo complementam a cobertura dos principais módulos e reforçam validações negativas, autenticação, autorização e regras de negócio.

---

## CT-API-046 — Validar token expirado

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir rejeição de JWT expirado |
| Método | GET |
| Endpoint | Rota protegida |
| Dados | Token expirado |
| Resultado esperado | HTTP 401 |
| Automação | `auth.cy.js` |

---

## CT-API-047 — Bloquear consulta de colaborador sem token

| Campo | Detalhe |
|---|---|
| Objetivo | Validar proteção das consultas |
| Método | GET |
| Endpoint | `/api/employees` |
| Dados | Sem token |
| Resultado esperado | HTTP 401 |
| Automação | `employees.cy.js` |

---

## CT-API-048 — Bloquear atualização de colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de ID inexistente |
| Método | PUT/PATCH |
| Endpoint | `/api/employees/:id` |
| Dados | ID inexistente |
| Resultado esperado | HTTP 404 |
| Automação | `employees.cy.js` |

---

## CT-API-049 — Bloquear exclusão de colaborador sem permissão

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização para exclusão |
| Método | DELETE |
| Endpoint | `/api/employees/:id` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `employees.cy.js` |

---

## CT-API-050 — Bloquear criação de data especial sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Validar proteção da criação |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | Sem token |
| Resultado esperado | HTTP 401 |
| Automação | `specialDates.cy.js` |

---

## CT-API-051 — Validar tipo de data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Aceitar somente tipos previstos pela API |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | Tipo inválido |
| Resultado esperado | HTTP 400 |
| Automação | `specialDates.cy.js` |

---

## CT-API-052 — Validar campos obrigatórios de data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar payload obrigatório |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | Campos ausentes |
| Resultado esperado | HTTP 400 |
| Automação | `specialDates.cy.js` |

---

## CT-API-053 — Atualizar data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar alteração de data existente |
| Método | PUT/PATCH |
| Endpoint | `/api/special-dates/:id` |
| Perfil | Admin |
| Resultado esperado | HTTP 200 |
| Automação | `specialDates.cy.js` |

---

## CT-API-054 — Excluir data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar exclusão de data especial |
| Método | DELETE |
| Endpoint | `/api/special-dates/:id` |
| Perfil | Admin |
| Resultado esperado | HTTP 204 |
| Automação | `specialDates.cy.js` |

---

## CT-API-055 — Bloquear criação de presente sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Validar proteção da criação |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | Sem token |
| Resultado esperado | HTTP 401 |
| Automação | `gifts.cy.js` |

---

## CT-API-056 — Bloquear presente com preço não numérico

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tipo do campo preço |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | Preço em formato inválido |
| Resultado esperado | HTTP 400 |
| Automação | `gifts.cy.js` |

---

## CT-API-057 — Bloquear alteração de presente por usuário comum

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização administrativa |
| Método | PATCH |
| Endpoint | `/api/gifts/:id` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `gifts.cy.js` |

---

## CT-API-058 — Bloquear exclusão de presente por usuário comum

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização administrativa |
| Método | DELETE |
| Endpoint | `/api/gifts/:id` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `gifts.cy.js` |

---

## CT-API-059 — Bloquear consulta de envios sem token

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autenticação das consultas |
| Método | GET |
| Endpoint | `/api/shipments` |
| Dados | Sem token |
| Resultado esperado | HTTP 401 |
| Automação | `shipments.cy.js` |

---

## CT-API-060 — Bloquear criação de envio por usuário comum

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização administrativa |
| Método | POST |
| Endpoint | `/api/shipments` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `shipments.cy.js` |

---

## CT-API-061 — Bloquear alteração de status por usuário comum

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização para alteração de status |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Perfil | User |
| Resultado esperado | HTTP 403 |
| Automação | `shipments.cy.js` |

---

## CT-API-062 — Bloquear status inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar os valores permitidos para status |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Dados | Status não suportado |
| Resultado esperado | HTTP 400 |
| Automação | `shipments.cy.js` |

---

## CT-API-063 — Impedir alteração de envio em estado final

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir terminalidade dos estados finais |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Dados | Envio em estado final |
| Resultado esperado | Transição rejeitada |
| Automação | `shipments.cy.js` |

---

## CT-API-064 — Cancelar envio em estado ORDERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar caminho permitido de cancelamento |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `ORDERED → CANCELLED` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-065 — Cancelar envio em estado SHIPPED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cancelamento permitido durante o envio |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `SHIPPED → CANCELLED` |
| Resultado esperado | HTTP 200 |
| Automação | `shipments.cy.js` |

---

## CT-API-066 — Validar terminalidade do status CANCELLED

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que um envio cancelado não volte para outro estado |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `CANCELLED → qualquer outro estado` |
| Resultado esperado | Transição rejeitada |
| Automação | `shipments.cy.js` |

---

# 8. Resumo da Cobertura

| Módulo | Casos documentados |
|---|---:|
| Health / OpenAPI | 2 |
| Autenticação | 8 |
| Colaboradores | 13 |
| Datas especiais | 8 |
| Presentes | 8 |
| Envios | 24 |
| **Total** | **63** |

---

# 9. Cobertura Automatizada

Os casos descritos neste documento são destinados à execução automatizada com Cypress.

A suíte está organizada por domínio funcional:

- `auth.cy.js`
- `employees.cy.js`
- `specialDates.cy.js`
- `gifts.cy.js`
- `shipments.cy.js`
- `mimorh-api.cy.js`

A execução pode ser realizada por meio dos scripts definidos no `package.json`.

---

# 10. Rastreabilidade

A identificação dos cenários segue o padrão:

`CT-API-XXX`

Os identificadores permitem relacionar:

**Regra de negócio → Caso de teste → Automação Cypress**

A documentação deve ser mantida alinhada aos testes automatizados para facilitar futuras alterações e regressões.

---

## Status da execução

O resultado da execução da suíte deve ser considerado separado da definição dos casos de teste.

Última execução registrada:

| Métrica | Resultado |
|---|---:|
| Testes executados | 63 |
| Passing | 62 |
| Failing | 1 |

O caso que apresentou falha deve ser investigado antes de considerar a regressão totalmente aprovada.
```