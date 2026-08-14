# 07. Casos de Teste da API — MimoRH

Este documento apresenta os casos de teste automatizados utilizados para validar a API MimoRH.

Os testes foram implementados utilizando **Cypress** e realizam requisições diretamente aos endpoints da API. A suíte contempla autenticação, autorização, colaboradores, datas especiais, presentes, envios, validações de entrada, regras de negócio e infraestrutura.

A identificação dos cenários utiliza o padrão `CT-API-XXX`, permitindo rastreabilidade entre documentação e automação.

---

## 1. Informações do documento

| Campo | Informação |
|---|---|
| Projeto | MimoRH API |
| Tipo | Casos de Teste de API |
| Automação | Cypress |
| Linguagem | JavaScript |
| Identificação | CT-API-XXX |
| Execução | Requisições HTTP com `cy.request()` |
| Dados de teste | Fixtures e arquivos JSON locais |
| Total de testes | 63 |

---

# 2. Infraestrutura e documentação

## CT-API-001 — Health check da API

| Campo | Detalhe |
|---|---|
| Objetivo | Verificar se a API está disponível e respondendo corretamente |
| Método | GET |
| Endpoint | `/api/health` |
| Autenticação | Não necessária |
| Resultado esperado | HTTP 200 e corpo contendo `status: "ok"` |

---

## CT-API-045 — Disponibilidade da especificação OpenAPI

| Campo | Detalhe |
|---|---|
| Objetivo | Verificar se a especificação OpenAPI da API está disponível |
| Método | GET |
| Endpoint | `/api-docs.json` |
| Autenticação | Não necessária |
| Resultado esperado | HTTP 200, versão OpenAPI `3.0.3` e título `MimoRH API` |

> Este cenário valida a disponibilidade e informações básicas da especificação OpenAPI. A documentação completa dos endpoints e schemas está descrita separadamente na documentação de Swagger.

---

# 3. Autenticação e autorização

## CT-API-005 — Cadastro de usuário sem exposição de senha

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o cadastro de usuário e garantir que a role enviada não permita criação de administrador |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Pré-condição | API disponível |
| Dados | Usuário válido com `role: admin` no payload |
| Resultado esperado | HTTP 201, usuário criado com role `user`, senha não retornada e favoritos inicializados como lista vazia |

---

## CT-API-006 — Cadastro sem campo obrigatório

| Campo | Detalhe |
|---|---|
| Objetivo | Validar a obrigatoriedade dos campos do cadastro |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | Payload sem senha |
| Resultado esperado | HTTP 400 |

---

## CT-API-007 — Cadastro com e-mail inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o formato do e-mail no cadastro |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Dados | E-mail em formato inválido |
| Resultado esperado | HTTP 400 |

---

## CT-API-008 — Cadastro com e-mail já existente

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que não sejam cadastrados usuários com e-mail duplicado |
| Método | POST |
| Endpoint | `/api/auth/register` |
| Pré-condição | Usuário com o mesmo e-mail já cadastrado |
| Resultado esperado | HTTP 409 |

---

## CT-API-009 — Login e geração de JWT

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autenticação e geração do token JWT |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Dados | Credenciais válidas de administrador |
| Resultado esperado | HTTP 200 e token JWT contendo `name`, `email`, `role` e `sub` esperados |

---

## CT-API-010 — Login sem campos obrigatórios

| Campo | Detalhe |
|---|---|
| Objetivo | Validar o tratamento de credenciais incompletas |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Dados | Login sem senha |
| Resultado esperado | HTTP 400 |

---

## CT-API-011 — Login com credenciais inválidas

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir bloqueio de autenticação com credenciais incorretas |
| Método | POST |
| Endpoint | `/api/auth/login` |
| Dados | Senha inválida |
| Resultado esperado | HTTP 401 |

---

## CT-API-012 — Acesso protegido sem token ou com token inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar proteção das rotas que exigem autenticação |
| Método | GET |
| Endpoint | `/api/employees` |
| Cenários | Sem header Authorization e com Bearer token inválido |
| Resultado esperado | HTTP 401 em ambos os casos |

---

## CT-API-046 — Acesso com token JWT expirado

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de tokens JWT expirados |
| Método | GET |
| Endpoint | `/api/employees` |
| Pré-condição | Token JWT expirado gerado para o teste |
| Resultado esperado | HTTP 401 |

---

# 4. Colaboradores

## CT-API-013 — Listagem de colaboradores autenticado

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta autenticada de colaboradores |
| Método | GET |
| Endpoint | `/api/employees` |
| Autenticação | Administrador |
| Resultado esperado | HTTP 200 e lista vazia após reset dos dados |

---

## CT-API-014 — Consulta de colaboradores sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que a consulta exija autenticação |
| Método | GET |
| Endpoint | `/api/employees` |
| Autenticação | Nenhuma |
| Resultado esperado | HTTP 401 |

---

## CT-API-015 — Criação de colaborador por administrador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de colaborador por usuário administrador |
| Método | POST |
| Endpoint | `/api/employees` |
| Autenticação | Administrador |
| Dados | Colaborador válido |
| Resultado esperado | HTTP 201 e geração de identificador |

---

## CT-API-016 — Bloqueio de criação por usuário comum

| Campo | Detalhe |
|---|---|
| Objetivo | Validar autorização administrativa |
| Método | POST |
| Endpoint | `/api/employees` |
| Autenticação | Usuário comum |
| Resultado esperado | HTTP 403 |

---

## CT-API-017 — Criação de colaborador com payload incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Validar campos obrigatórios do colaborador |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | Payload contendo apenas nome |
| Resultado esperado | HTTP 400 |

---

## CT-API-018 — E-mail de colaborador duplicado

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir unicidade do e-mail do colaborador |
| Método | POST |
| Endpoint | `/api/employees` |
| Pré-condição | Colaborador já criado com o mesmo e-mail |
| Resultado esperado | HTTP 409 |

---

## CT-API-019 — Data de nascimento futura

| Campo | Detalhe |
|---|---|
| Objetivo | Impedir cadastro de colaborador com nascimento no futuro |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | `birthDate: 2999-01-01` |
| Resultado esperado | HTTP 400 |

---

## CT-API-020 — Consulta de colaborador inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de identificador inexistente |
| Método | GET |
| Endpoint | `/api/employees/9999` |
| Resultado esperado | HTTP 404 |

---

## CT-API-021 — Consulta de colaborador por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar recuperação de colaborador específico |
| Método | GET |
| Endpoint | `/api/employees/:id` |
| Pré-condição | Colaborador existente |
| Resultado esperado | HTTP 200 e ID retornado correspondente ao registro criado |

---

## CT-API-022 — Atualização completa de colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar substituição completa de um colaborador |
| Método | PUT |
| Endpoint | `/api/employees/:id` |
| Pré-condição | Colaborador existente |
| Dados | Payload completo |
| Resultado esperado | HTTP 200 e dados atualizados |

---

## CT-API-023 — PUT de colaborador incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que PUT exija os campos necessários |
| Método | PUT |
| Endpoint | `/api/employees/:id` |
| Dados | Payload contendo apenas nome |
| Resultado esperado | HTTP 400 |

---

## CT-API-024 — Atualização parcial de colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar atualização parcial |
| Método | PATCH |
| Endpoint | `/api/employees/:id` |
| Dados | Alteração apenas do nome |
| Resultado esperado | HTTP 200 e nome atualizado |

---

## CT-API-025 — PATCH inválido e exclusão de colaborador

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de campos desconhecidos e exclusão |
| Método | PATCH / DELETE |
| Endpoint | `/api/employees/:id` |
| Cenários | PATCH com campo inválido e DELETE do colaborador |
| Resultado esperado | PATCH HTTP 400 e DELETE HTTP 204 |

---

## CT-API-047 — E-mail de colaborador inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar formato do e-mail de colaborador |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | E-mail em formato inválido |
| Resultado esperado | HTTP 400 |

---

## CT-API-048 — Endereço incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Validar preenchimento completo do endereço |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | Endereço contendo apenas rua e cidade |
| Resultado esperado | HTTP 400 |

---

## CT-API-049 — Data de nascimento calendariamente inválida

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir rejeição de uma data que não existe no calendário |
| Método | POST |
| Endpoint | `/api/employees` |
| Dados | `birthDate: 2026-02-30` |
| Resultado esperado | HTTP 400 |

---

# 5. Datas especiais

## CT-API-026 — Criação de data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de data especial vinculada a colaborador |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Pré-condição | Colaborador existente |
| Dados | Data do tipo `BIRTHDAY` |
| Resultado esperado | HTTP 201 e relacionamento correto com o colaborador |

---

## CT-API-027 — Colaborador inexistente ou tipo inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar relacionamentos e tipos permitidos |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Cenários | Colaborador inexistente e tipo inválido |
| Resultado esperado | HTTP 404 para relacionamento inexistente e HTTP 400 para tipo inválido |

---

## CT-API-028 — Consulta de próximas datas especiais

| Campo | Detalhe |
|---|---|
| Objetivo | Validar listagem de próximas datas e informações calculadas |
| Método | GET |
| Endpoint | `/api/special-dates/upcoming` |
| Pré-condição | Data especial cadastrada |
| Resultado esperado | HTTP 200 com dados da data, colaborador relacionado e `daysRemaining` |

---

## CT-API-029 — Atualização e exclusão de data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar alteração e exclusão de data especial |
| Método | PATCH / DELETE |
| Endpoint | `/api/special-dates/:id` |
| Autenticação | Administrador |
| Resultado esperado | PATCH HTTP 200 e DELETE HTTP 204 |

---

## CT-API-050 — Data especial sem campo obrigatório

| Campo | Detalhe |
|---|---|
| Objetivo | Validar campos obrigatórios da data especial |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | Payload sem `employeeId` e data |
| Resultado esperado | HTTP 400 |

---

## CT-API-051 — Data especial calendariamente inválida

| Campo | Detalhe |
|---|---|
| Objetivo | Impedir cadastro de data que não existe no calendário |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Dados | `date: 2026-13-01` |
| Resultado esperado | HTTP 400 |

---

## CT-API-052 — Autorização para criação de data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar que somente administrador pode criar datas especiais |
| Método | POST |
| Endpoint | `/api/special-dates` |
| Cenários | Usuário comum e administrador |
| Resultado esperado | Usuário comum recebe HTTP 403 e administrador recebe HTTP 201 |

---

## CT-API-053 — Atualização completa de data especial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar substituição completa de uma data especial |
| Método | PUT |
| Endpoint | `/api/special-dates/:id` |
| Pré-condição | Data especial existente |
| Resultado esperado | HTTP 200 com dados atualizados |

---

## CT-API-054 — Data especial inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta de recurso inexistente |
| Método | GET |
| Endpoint | `/api/special-dates/999` |
| Resultado esperado | HTTP 404 |

---

# 6. Presentes

## CT-API-030 — Criação e consulta de presente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação e consulta de presente |
| Método | POST / GET |
| Endpoint | `/api/gifts` e `/api/gifts/:id` |
| Autenticação | Administrador |
| Resultado esperado | Criação HTTP 201 e consulta HTTP 200 |

---

## CT-API-031 — Presente sem campo obrigatório

| Campo | Detalhe |
|---|---|
| Objetivo | Validar campos obrigatórios do presente |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | Payload incompleto |
| Resultado esperado | HTTP 400 |

---

## CT-API-032 — Preço zero ou negativo

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que presentes tenham preço maior que zero |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | Preços `0` e `-1` |
| Resultado esperado | HTTP 400 em ambos os cenários |

---

## CT-API-033 — Atualização parcial e exclusão de presente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar alteração parcial e exclusão |
| Método | PATCH / DELETE |
| Endpoint | `/api/gifts/:id` |
| Resultado esperado | PATCH HTTP 200 e DELETE HTTP 204 |

---

## CT-API-055 — Preço não numérico

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tipo do campo de preço |
| Método | POST |
| Endpoint | `/api/gifts` |
| Dados | `price: "abc"` |
| Resultado esperado | HTTP 400 |

---

## CT-API-056 — Autorização para criação de presente

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que somente administrador possa criar presentes |
| Método | POST |
| Endpoint | `/api/gifts` |
| Cenários | Usuário comum e administrador |
| Resultado esperado | Usuário comum recebe HTTP 403 e administrador recebe HTTP 201 |

---

## CT-API-057 — Atualização completa de presente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar substituição completa de presente |
| Método | PUT |
| Endpoint | `/api/gifts/:id` |
| Pré-condição | Presente existente |
| Resultado esperado | HTTP 200 e dados atualizados |

---

## CT-API-058 — Presente inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de presente inexistente |
| Método | GET |
| Endpoint | `/api/gifts/999` |
| Resultado esperado | HTTP 404 |

---

# 7. Envios

## CT-API-034 — Listagem de envios autenticado

| Campo | Detalhe |
|---|---|
| Objetivo | Validar consulta autenticada de envios |
| Método | GET |
| Endpoint | `/api/shipments` |
| Autenticação | Administrador |
| Resultado esperado | HTTP 200 e lista vazia após reset |

---

## CT-API-035 — Consulta de envios sem autenticação

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir proteção do endpoint de consulta |
| Método | GET |
| Endpoint | `/api/shipments` |
| Autenticação | Nenhuma |
| Resultado esperado | HTTP 401 |

---

## CT-API-036 — Criação de envio com status inicial

| Campo | Detalhe |
|---|---|
| Objetivo | Validar criação de envio e status inicial |
| Método | POST |
| Endpoint | `/api/shipments` |
| Pré-condição | Colaborador, presente e data especial existentes |
| Resultado esperado | HTTP 201 e status `PENDING` |

---

## CT-API-037 — Envio com payload incompleto

| Campo | Detalhe |
|---|---|
| Objetivo | Validar campos obrigatórios do envio |
| Método | POST |
| Endpoint | `/api/shipments` |
| Dados | Payload vazio |
| Resultado esperado | HTTP 400 |

---

## CT-API-038 — Relacionamentos inexistentes

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que um envio só seja criado com relacionamentos válidos |
| Método | POST |
| Endpoint | `/api/shipments` |
| Dados | IDs inexistentes de colaborador, presente e data especial |
| Resultado esperado | HTTP 404 |

---

## CT-API-039 — Transição PENDING para ORDERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar primeira transição permitida do envio |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Status | `PENDING → ORDERED` |
| Resultado esperado | HTTP 200 e status `ORDERED` |

---

## CT-API-040 — Fluxo completo até DELIVERED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar sequência completa de entrega |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Fluxo | `PENDING → ORDERED → SHIPPED → DELIVERED` |
| Resultado esperado | Todas as transições são aceitas |

---

## CT-API-041 — Cancelamento a partir de PENDING

| Campo | Detalhe |
|---|---|
| Objetivo | Validar cancelamento antes do processamento do envio |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Fluxo | `PENDING → CANCELLED` |
| Resultado esperado | HTTP 200 e status `CANCELLED` |

---

## CT-API-042 — Status inválido

| Campo | Detalhe |
|---|---|
| Objetivo | Validar rejeição de status não suportado |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Dados | `status: UNKNOWN` |
| Resultado esperado | HTTP 400 |

---

## CT-API-043 — Transição após DELIVERED

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que um envio entregue não possa sofrer novas transições |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Pré-condição | Envio em `DELIVERED` |
| Resultado esperado | Tentativa de nova transição retorna HTTP 400 |

---

## CT-API-044 — Atualização de envio inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar tratamento de envio inexistente |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Dados | ID inexistente |
| Resultado esperado | HTTP 404 |

---

## CT-API-059 — Mensagem de envio vazia

| Campo | Detalhe |
|---|---|
| Objetivo | Validar que a mensagem do envio não aceite somente espaços |
| Método | POST |
| Endpoint | `/api/shipments` |
| Dados | `message: "   "` |
| Resultado esperado | HTTP 400 |

---

## CT-API-060 — Validação individual dos relacionamentos

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir validação independente dos relacionamentos do envio |
| Método | POST |
| Endpoint | `/api/shipments` |
| Cenários | `employeeId`, `giftId` e `specialDateId` inexistentes individualmente |
| Resultado esperado | HTTP 404 para cada relacionamento inválido |

---

## CT-API-061 — Autorização para criação de envio

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir que somente administrador possa criar envios |
| Método | POST |
| Endpoint | `/api/shipments` |
| Cenários | Usuário comum e administrador |
| Resultado esperado | Usuário comum recebe HTTP 403 e administrador consegue criar o envio |

---

## CT-API-062 — Consulta de envio por ID

| Campo | Detalhe |
|---|---|
| Objetivo | Validar recuperação de um envio específico |
| Método | GET |
| Endpoint | `/api/shipments/:id` |
| Pré-condição | Envio existente |
| Resultado esperado | HTTP 200 e ID correspondente ao registro consultado |

---

## CT-API-063 — Cancelamento a partir de ORDERED e SHIPPED

| Campo | Detalhe |
|---|---|
| Objetivo | Validar os caminhos de cancelamento após o processamento inicial |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Fluxos | `ORDERED → CANCELLED` e `SHIPPED → CANCELLED` |
| Resultado esperado | HTTP 200 e status `CANCELLED` nos dois cenários |

---

## CT-API-064 — Bloqueio de todas as transições após DELIVERED

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir terminalidade do status `DELIVERED` |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Tentativas | `CANCELLED`, `PENDING`, `ORDERED` e `SHIPPED` |
| Resultado esperado | HTTP 400 para todas as tentativas |

---

## CT-API-065 — Bloqueio de todas as transições após CANCELLED

| Campo | Detalhe |
|---|---|
| Objetivo | Garantir terminalidade do status `CANCELLED` |
| Método | PATCH |
| Endpoint | `/api/shipments/:id/status` |
| Tentativas | `PENDING`, `ORDERED`, `SHIPPED` e `DELIVERED` |
| Resultado esperado | HTTP 400 para todas as tentativas |

---

## CT-API-066 — Consulta de envio inexistente

| Campo | Detalhe |
|---|---|
| Objetivo | Validar resposta para consulta de envio inexistente |
| Método | GET |
| Endpoint | `/api/shipments/:id` |
| Dados | ID inexistente |
| Resultado esperado | HTTP 404 |

---

# 8. Resumo da cobertura

A suíte automatizada possui **63 casos de teste**, distribuídos entre os principais domínios da API.

| Área | Casos |
|---|---:|
| Infraestrutura e documentação | 2 |
| Autenticação e autorização | 9 |
| Colaboradores | 13 |
| Datas especiais | 9 |
| Presentes | 8 |
| Envios | 22 |
| **Total** | **63** |

---

# 9. Cobertura funcional

A suíte contempla:

- Health check da API;
- disponibilidade da especificação OpenAPI;
- cadastro de usuários;
- login e geração de JWT;
- validação de credenciais;
- proteção de rotas;
- rejeição de token inválido;
- rejeição de token expirado;
- autorização por perfil;
- CRUD de colaboradores;
- validações de colaboradores;
- validação de e-mail;
- validação de endereço;
- validação de datas;
- CRUD de datas especiais;
- validação de tipos de datas;
- consulta de próximas datas;
- CRUD de presentes;
- validação de preço;
- CRUD de envios;
- validação dos relacionamentos;
- validação da mensagem do envio;
- controle de status dos envios;
- transições de status permitidas;
- bloqueio de transições inválidas;
- terminalidade dos estados `DELIVERED` e `CANCELLED`.

---

# 10. Estratégia de isolamento

Os testes utilizam o comando `cy.resetData()` para restaurar os dados utilizados pela suíte antes da execução dos cenários.

Quando necessário, os testes criam os registros dependentes durante a própria execução, como:

- colaboradores;
- presentes;
- datas especiais;
- envios;
- usuários comuns.

Essa abordagem permite que os cenários tenham seus próprios dados de teste e reduz a dependência entre os casos.

---

# 11. Dados utilizados

Os dados reutilizáveis dos testes são mantidos em fixtures do Cypress.

Principais fixtures utilizadas:

- `validUser`
- `validEmployee`
- `validGift`
- `validSpecialDate`
- `validShipment`

Os dados persistidos pela API são armazenados nos arquivos JSON utilizados pela aplicação.

---

# 12. Resultado da execução

Na última execução da suíte:

| Resultado | Quantidade |
|---|---:|
| Total | 63 |
| Passing | 62 |
| Failing | 1 |
| Executados | 63 |

A suíte foi executada localmente com Cypress.

O resultado apresentado pelo Cypress foi:

**62 testes aprovados e 1 teste com falha.**

A identificação e análise do cenário que apresentou falha devem ser realizadas a partir do relatório detalhado da execução.

---

# 13. Rastreabilidade

Cada cenário possui um identificador único no formato `CT-API-XXX`.

Os identificadores são utilizados diretamente nos títulos dos testes automatizados, permitindo relacionar:

**Documentação → Caso de teste → Automação Cypress → Endpoint da API**

Exemplo:

`CT-API-036`  
→ Criação de envio com status inicial  
→ `POST /api/shipments`  
→ Cypress  
→ Validação do status `PENDING`.

---

# 14. Observações

Este documento descreve os cenários atualmente implementados na suíte Cypress.

A ausência de um caso nesta documentação não significa necessariamente ausência de uma regra na API; significa apenas que o comportamento não possui um cenário automatizado listado nesta suíte. 

A documentação de endpoints, regras de negócio e especificação OpenAPI deve ser consultada separadamente para detalhes adicionais sobre o funcionamento da API.