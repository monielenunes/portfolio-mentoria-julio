# 03. Regras de Negócio

Este documento centraliza as principais regras de negócio da MimoRH API consideradas no escopo da avaliação e cobertas pelos testes automatizados em Cypress.

As regras abaixo representam os comportamentos validados pela suíte de testes.

---

## RN-01 — Autenticação e Usuários

### Cadastro

O cadastro é realizado por:

`POST /api/auth/register`

O endpoint é público e não exige autenticação.

Para um cadastro válido, devem ser informados os dados necessários de usuário, incluindo:

- `name`;
- `email`;
- `password`.

O cadastro com dados obrigatórios ausentes deve retornar `400`.

O e-mail deve possuir formato válido. Um e-mail inválido deve retornar `400`.

Não é permitido cadastrar novamente um usuário utilizando um e-mail já existente. Nesse caso, a API deve retornar `409`.

### Role do usuário

O cadastro público sempre cria o usuário com a role:

`user`

Caso o cliente envie `role: admin` no payload, a API não deve permitir a criação de um administrador por esse mecanismo.

O usuário criado deve possuir `role: user`.

A resposta do cadastro não deve expor o campo `password`.

O campo `favorites` é inicializado como uma lista vazia.

### Login

O login é realizado por:

`POST /api/auth/login`

O endpoint é público.

O login exige:

- `email`;
- `password`.

A ausência de um desses campos deve retornar `400`.

Credenciais inválidas devem retornar `401`.

Em caso de autenticação válida, a API deve retornar um token JWT.

O token deve conter as informações esperadas de:

- `name`;
- `email`;
- `role`;
- `sub`.

O campo `sub` representa o identificador do usuário.

### Proteção das rotas

As rotas protegidas utilizam:

```text
Authorization: Bearer <token>
````

A ausência de token deve retornar `401`.

Um token inválido também deve retornar `401`.

Um token expirado deve retornar `401`.

### Casos automatizados

* `CT-API-005`
* `CT-API-006`
* `CT-API-007`
* `CT-API-008`
* `CT-API-009`
* `CT-API-010`
* `CT-API-011`
* `CT-API-012`
* `CT-API-046`

---

# RN-02 — Colaboradores

Os colaboradores são gerenciados pelos seguintes endpoints:

```text
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
PATCH  /api/employees/:id
DELETE /api/employees/:id
```

## Criação

A criação de colaborador exige autenticação de administrador.

Um colaborador válido deve possuir os dados necessários para seu cadastro.

Um payload incompleto deve retornar `400`.

O e-mail do colaborador deve possuir formato válido.

Um e-mail inválido deve retornar `400`.

Não é permitido cadastrar dois colaboradores com o mesmo e-mail.

Nesse caso, a API deve retornar `409`.

## Data de nascimento

A data de nascimento não pode estar no futuro.

Uma data futura deve retornar `400`.

A data também deve representar uma data válida do calendário.

Datas inexistentes, como:

```text
2026-02-30
```

devem retornar `400`.

## Endereço

O endereço do colaborador deve possuir os dados necessários para sua composição.

Um endereço incompleto deve ser rejeitado com `400`.

## Consulta

A listagem de colaboradores exige autenticação.

A consulta de um colaborador por identificador também exige autenticação.

Um colaborador inexistente deve retornar `404`.

## Atualização

A API permite atualização completa utilizando:

`PUT /api/employees/:id`

O `PUT` deve receber os dados necessários para uma atualização completa.

Um payload incompleto deve retornar `400`.

Também é possível realizar atualização parcial utilizando:

`PATCH /api/employees/:id`

Uma atualização parcial válida deve retornar `200`.

Um `PATCH` contendo somente campos não reconhecidos deve retornar `400`.

## Exclusão

A exclusão é realizada por:

`DELETE /api/employees/:id`

A exclusão de um colaborador existente deve retornar:

`204`

## Autorização

Usuários comuns não podem criar colaboradores.

Uma tentativa de criação realizada por usuário comum deve retornar:

`403`

Operações administrativas são executadas utilizando um usuário com role `admin`.

### Casos automatizados

* `CT-API-013`
* `CT-API-014`
* `CT-API-015`
* `CT-API-016`
* `CT-API-017`
* `CT-API-018`
* `CT-API-019`
* `CT-API-020`
* `CT-API-021`
* `CT-API-022`
* `CT-API-023`
* `CT-API-024`
* `CT-API-025`
* `CT-API-047`
* `CT-API-048`
* `CT-API-049`

---

# RN-03 — Datas Especiais

As datas especiais são gerenciadas por:

```text
GET    /api/special-dates
POST   /api/special-dates
GET    /api/special-dates/:id
PUT    /api/special-dates/:id
PATCH  /api/special-dates/:id
DELETE /api/special-dates/:id
GET    /api/special-dates/upcoming
```

## Criação

A criação de uma data especial exige:

* `employeeId`;
* `type`;
* `date`.

A ausência de campos obrigatórios deve retornar `400`.

O `employeeId` deve corresponder a um colaborador existente.

Caso o colaborador não exista, a API deve retornar:

`404`

## Tipo

A data especial deve utilizar um tipo permitido pela API.

Tipos inválidos devem retornar:

`400`

Entre os tipos utilizados pelos testes estão:

```text
BIRTHDAY
OTHER
```

## Data

A data deve possuir formato válido e representar uma data existente no calendário.

Uma data calendariamente inválida deve retornar:

`400`

## Upcoming

A API disponibiliza:

`GET /api/special-dates/upcoming`

O endpoint deve retornar as próximas datas especiais cadastradas.

Os itens retornados devem possuir informações relacionadas à data especial e ao colaborador.

A resposta validada pelos testes contém:

* `id`;
* `employeeId`;
* `employee`;
* `type`;
* `date`;
* `daysRemaining`.

## Atualização e exclusão

É possível atualizar uma data especial utilizando `PATCH`.

Também é possível realizar atualização completa utilizando `PUT`.

A exclusão é realizada utilizando `DELETE`.

A exclusão bem-sucedida retorna:

`204`

## Autorização

A criação de data especial é uma operação administrativa.

Um usuário comum tentando criar uma data especial deve receber:

`403`

Um administrador deve conseguir realizar a criação quando os dados forem válidos.

### Casos automatizados

* `CT-API-026`
* `CT-API-027`
* `CT-API-028`
* `CT-API-029`
* `CT-API-050`
* `CT-API-051`
* `CT-API-052`
* `CT-API-053`
* `CT-API-054`

---

# RN-04 — Presentes

Os presentes são gerenciados por:

```text
GET    /api/gifts
POST   /api/gifts
GET    /api/gifts/:id
PUT    /api/gifts/:id
PATCH  /api/gifts/:id
DELETE /api/gifts/:id
```

## Criação

A criação de um presente exige os campos necessários definidos pela API.

Um payload incompleto deve retornar:

`400`

## Preço

O preço do presente deve ser maior que zero.

Os seguintes valores devem ser rejeitados:

```text
0
-1
```

Valores não numéricos também devem ser rejeitados.

Exemplo:

```text
"abc"
```

As situações acima devem retornar:

`400`

## Consulta

A API permite consultar um presente por identificador.

Um presente existente deve retornar:

`200`

Um presente inexistente deve retornar:

`404`

## Atualização

É possível realizar atualização parcial com:

`PATCH /api/gifts/:id`

Também é possível realizar atualização completa com:

`PUT /api/gifts/:id`

Uma atualização válida deve retornar:

`200`

## Exclusão

A exclusão é realizada utilizando:

`DELETE /api/gifts/:id`

Uma exclusão bem-sucedida deve retornar:

`204`

## Autorização

A criação de presentes é uma operação administrativa.

Um usuário comum não pode criar presentes.

Nesse caso, a API deve retornar:

`403`

Um administrador deve conseguir criar um presente válido.

### Casos automatizados

* `CT-API-030`
* `CT-API-031`
* `CT-API-032`
* `CT-API-033`
* `CT-API-055`
* `CT-API-056`
* `CT-API-057`
* `CT-API-058`

---

# RN-05 — Envios

Os envios são gerenciados por:

```text
GET   /api/shipments
POST  /api/shipments
GET   /api/shipments/:id
PATCH /api/shipments/:id/status
```

## Criação

Para criar um envio, devem existir os relacionamentos necessários entre:

* colaborador;
* presente;
* data especial.

Os identificadores são enviados por:

```text
employeeId
giftId
specialDateId
```

Caso algum relacionamento não exista, a API deve retornar:

`404`

Um payload incompleto deve retornar:

`400`

A mensagem do envio não pode ser vazia.

Uma mensagem contendo apenas espaços também deve ser rejeitada com:

`400`

## Status inicial

Todo novo envio deve ser criado com:

```text
PENDING
```

O status inicial é definido pela API no momento da criação.

## Consulta

A listagem de envios exige autenticação.

A consulta de um envio por identificador também exige autenticação.

Um envio inexistente deve retornar:

`404`

## Alteração de status

A alteração de status é realizada por:

`PATCH /api/shipments/:id/status`

A operação exige autenticação administrativa.

Status inexistentes devem ser rejeitados com:

`400`

Transições não permitidas também devem retornar:

`400`

## Autorização

Usuários comuns não podem criar envios.

Uma tentativa de criação por usuário comum deve retornar:

`403`

Administradores podem criar envios quando todos os dados e relacionamentos forem válidos.

### Casos automatizados

* `CT-API-034`
* `CT-API-035`
* `CT-API-036`
* `CT-API-037`
* `CT-API-038`
* `CT-API-039`
* `CT-API-040`
* `CT-API-041`
* `CT-API-042`
* `CT-API-043`
* `CT-API-044`
* `CT-API-059`
* `CT-API-060`
* `CT-API-061`
* `CT-API-062`
* `CT-API-063`
* `CT-API-064`
* `CT-API-065`
* `CT-API-066`

---

# RN-06 — Máquina de Estados dos Envios

O status de um envio pode assumir os seguintes valores:

```text
PENDING
ORDERED
SHIPPED
DELIVERED
CANCELLED
```

## Fluxo normal

O fluxo de entrega validado pela automação é:

```text
PENDING
   ↓
ORDERED
   ↓
SHIPPED
   ↓
DELIVERED
```

Cada transição deve ocorrer na ordem permitida.

O teste `CT-API-040` valida a sequência completa até `DELIVERED`.

## Cancelamento

O envio pode ser cancelado antes da entrega.

São validados os seguintes caminhos:

```text
PENDING  → CANCELLED
ORDERED  → CANCELLED
SHIPPED  → CANCELLED
```

## Estados finais

`DELIVERED` é um estado final.

Após atingir `DELIVERED`, o envio não pode retornar para:

```text
CANCELLED
PENDING
ORDERED
SHIPPED
```

`CANCELLED` também é um estado final.

Após atingir `CANCELLED`, o envio não pode retornar para:

```text
PENDING
ORDERED
SHIPPED
DELIVERED
```

Todas essas tentativas devem retornar:

`400`

## Transições inválidas

Transições que não fazem parte do fluxo permitido devem ser rejeitadas.

Também é inválido utilizar um status que não pertence à máquina de estados.

### Casos automatizados

* `CT-API-039`
* `CT-API-040`
* `CT-API-041`
* `CT-API-042`
* `CT-API-043`
* `CT-API-063`
* `CT-API-064`
* `CT-API-065`

---

# RN-07 — Autorização

A API diferencia usuários comuns de administradores.

## Usuário comum

O usuário comum pode realizar operações que não exigem privilégios administrativos, de acordo com as regras de autenticação da API.

Não é permitido utilizar um usuário comum para realizar as operações administrativas explicitamente cobertas pela suíte.

Os testes validam bloqueio de usuário comum nas seguintes operações:

* criação de colaborador;
* criação de data especial;
* criação de presente;
* criação de envio.

Nesses casos, a API deve retornar:

`403`

## Administrador

O administrador é utilizado nos testes para executar as operações administrativas dos módulos.

Quando autenticado e utilizando dados válidos, o administrador deve conseguir executar as operações previstas pela API.

## Autenticação

Nas rotas protegidas:

* ausência de token → `401`;
* token inválido → `401`;
* token expirado → `401`;
* usuário comum em operação administrativa → `403`.

### Casos automatizados

* `CT-API-012`
* `CT-API-016`
* `CT-API-052`
* `CT-API-056`
* `CT-API-061`

---

# RN-08 — Respostas HTTP

A API utiliza códigos HTTP para indicar o resultado das operações.

| Status | Situação validada                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `200`  | Consulta ou atualização realizada com sucesso                                                                            |
| `201`  | Recurso criado com sucesso                                                                                               |
| `204`  | Recurso excluído com sucesso                                                                                             |
| `400`  | Dados inválidos, campos obrigatórios ausentes, preço inválido, data inválida, status inválido ou transição não permitida |
| `401`  | Token ausente, inválido ou expirado                                                                                      |
| `403`  | Usuário autenticado sem permissão administrativa                                                                         |
| `404`  | Recurso ou relacionamento inexistente                                                                                    |
| `409`  | E-mail já cadastrado                                                                                                     |

---

# RN-09 — Health Check e OpenAPI

## Health Check

A API disponibiliza:

```text
GET /api/health
```

O endpoint é público.

Uma API disponível deve responder:

```json
{
  "status": "ok"
}
```

com HTTP:

`200`

## OpenAPI

A API disponibiliza sua especificação OpenAPI em:

```text
GET /api-docs.json
```

O teste automatizado valida:

* HTTP `200`;
* versão OpenAPI `3.0.3`;
* título `MimoRH API`.

O cenário correspondente é:

`CT-API-045`

---

# RN-10 — Resumo das Regras Automatizadas

A suíte Cypress valida os seguintes grupos principais de regras:

| Domínio         | Principais regras validadas                                      |
| --------------- | ---------------------------------------------------------------- |
| Autenticação    | Cadastro, login, JWT, credenciais inválidas e proteção de rotas  |
| Usuários        | Role `user`, senha não retornada e e-mail duplicado              |
| Colaboradores   | CRUD, autenticação, autorização, e-mail, endereço e datas        |
| Datas especiais | Criação, relacionamento, tipos, datas inválidas, upcoming e CRUD |
| Presentes       | Criação, consulta, atualização, exclusão e validação de preço    |
| Envios          | Criação, relacionamentos, status inicial e consulta              |
| Status de envio | Fluxo de entrega, cancelamento e estados finais                  |
| Autorização     | Bloqueio de usuários comuns em operações administrativas         |
| Infraestrutura  | Health check e especificação OpenAPI                             |

---

## Casos automatizados

A suíte atualmente possui **63 cenários automatizados**, identificados pelo padrão:

```text
CT-API-XXX
```

Os casos estão documentados em:

`07-casos-de-teste-da-api.md`

Os identificadores são utilizados para manter a rastreabilidade entre as regras de negócio, a documentação dos casos de teste e a implementação Cypress.
