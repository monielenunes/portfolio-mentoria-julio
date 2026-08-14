# 03. Regras de Negócio

Este documento centraliza as regras de negócio da MimoRH API, extraídas do comportamento implementado na API e dos cenários de teste automatizados.

---

## RN-01 — Autenticação e Usuários

### Cadastro público

O cadastro é realizado por `POST /api/auth/register` e é público: não exige token.

O payload deve conter:

- `name` como texto não vazio após remoção dos espaços nas extremidades;
- `email` em formato de e-mail válido;
- `password` preenchida.

O e-mail é normalizado para letras minúsculas antes de ser armazenado. Não é permitido reutilizar um e-mail já existente, sem distinção entre maiúsculas e minúsculas.

Ao criar o usuário, a API:

- atribui obrigatoriamente a role `user`;
- ignora qualquer `role` informado pelo cliente, incluindo `admin`;
- inicializa `favorites` como uma lista vazia;
- gera hash da `password` com bcrypt;
- não retorna o campo `password` na resposta.

Respostas relevantes:

- `201` para cadastro criado;
- `400` quando há campo obrigatório ausente, `name` inválido ou e-mail inválido;
- `409` quando o e-mail já está cadastrado.

> Casos relacionados: `CT-API-005`.

### Login e JWT

O login é realizado por `POST /api/auth/login` e também é público. O payload exige `email` e `password`.

- A ausência de qualquer uma dessas credenciais retorna `400`.
- E-mail inexistente ou senha que não corresponde ao hash armazenado retorna `401`.
- Em caso de sucesso, a resposta retorna o usuário sem senha e um `token` JWT.

O token possui as claims `name`, `email`, `role` e `sub`, sendo `sub` o identificador do usuário. Sua duração é definida por `JWT_EXPIRES_IN`; na ausência dessa variável, o ambiente local usa `1h`.

### Uso do token

As rotas protegidas esperam o header:

```text
Authorization: Bearer <token>
```

O token é verificado com JWT. Após a verificação, a API busca o usuário persistido pelo `sub` do token e disponibiliza esse usuário para a rota. Token ausente, malformado, inválido, expirado ou associado a usuário inexistente retorna `401`.

> Casos relacionados: `CT-API-012`.

---

## RN-02 — Colaboradores

Os colaboradores são gerenciados por:

```text
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
PATCH  /api/employees/:id
DELETE /api/employees/:id
```

### Campos e validações

Na criação e no `PUT`, todos os campos abaixo são obrigatórios:

- `name`;
- `email`;
- `birthDate`;
- `address`.

O objeto `address` deve conter `street`, `number` e `city`.

O campo `email` deve possuir formato válido e deve ser único entre os colaboradores, sem distinção entre maiúsculas e minúsculas. Um e-mail duplicado retorna `409`.

`birthDate` deve usar o formato `YYYY-MM-DD`, representar uma data real do calendário e não pode estar no futuro. Datas inexistentes, como `2026-02-30`, e datas futuras retornam `400`.

No `PATCH`, somente `name`, `email`, `birthDate` e `address` são considerados. A atualização é parcial, mas deve conter ao menos um desses campos. Campos textuais enviados como string vazia são inválidos; quando `address` é informado, ele deve conter os três campos obrigatórios.

### Consulta, alteração e exclusão

- `GET /api/employees` e `GET /api/employees/:id` exigem autenticação.
- `POST`, `PUT`, `PATCH` e `DELETE` exigem autenticação e role `admin`.
- `PUT` exige o conjunto completo de campos obrigatórios; `PATCH` aceita atualização parcial válida.
- Um identificador inexistente retorna `404` nas operações por `:id`.
- A exclusão bem-sucedida retorna `204` sem corpo.

Respostas relevantes: `200`, `201`, `204`, `400`, `401`, `403`, `404` e `409`.

---

## RN-03 — Datas Especiais

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

### Relacionamento e campos obrigatórios

Na criação e no `PUT`, são obrigatórios:

- `employeeId`;
- `type`;
- `date`.

`employeeId` deve identificar um colaborador existente. Caso contrário, a API retorna `404`.

Os valores permitidos para `type` são:

```text
BIRTHDAY
MOTHERS_DAY
FATHERS_DAY
OTHER
```

`date` deve estar no formato `YYYY-MM-DD` e representar uma data real. Datas com mês, dia ou calendário inválidos retornam `400`.

No `PATCH`, são aceitos apenas `employeeId`, `type` e `date`; a requisição deve incluir pelo menos um desses campos. Quando `employeeId` é alterado, o novo colaborador também deve existir.

### Próximas datas

`GET /api/special-dates/upcoming` retorna as datas ordenadas por proximidade. Para calcular a próxima ocorrência, datas já passadas têm o ano avançado até não estarem antes do dia atual.

Cada item retornado inclui os dados da data especial, o objeto `employee` associado e `daysRemaining`.

### Permissões e respostas

- Consultas exigem token válido.
- Criação, atualização e exclusão exigem role `admin`.
- Identificadores inexistentes retornam `404`.

Respostas relevantes: `200`, `201`, `204`, `400`, `401`, `403` e `404`.

> Casos relacionados: `CT-API-027`.

---

## RN-04 — Presentes

Os presentes são gerenciados por:

```text
GET    /api/gifts
POST   /api/gifts
GET    /api/gifts/:id
PUT    /api/gifts/:id
PATCH  /api/gifts/:id
DELETE /api/gifts/:id
```

### Campos e preço

Na criação e no `PUT`, são obrigatórios:

- `name`;
- `description`;
- `price`;
- `store`.

`price` deve ser convertível para número finito e maior que zero. Valor `0`, valor negativo ou valor não numérico retorna `400`.

No `PATCH`, podem ser enviados `name`, `description`, `price` e `store`. Deve haver ao menos um campo reconhecido; `name`, `description` e `store` não podem ser enviados como string vazia, e qualquer `price` informado continua sujeito à validação de valor positivo.

### Permissões e respostas

- Consultas exigem token válido.
- Criação, atualização e exclusão exigem role `admin`.
- Identificador inexistente retorna `404`.
- Exclusão bem-sucedida retorna `204` sem corpo.

Respostas relevantes: `200`, `201`, `204`, `400`, `401`, `403` e `404`.

> Casos relacionados: `CT-API-032`.

---

## RN-05 — Envios

Os envios são gerenciados por:

```text
GET   /api/shipments
POST  /api/shipments
GET   /api/shipments/:id
PATCH /api/shipments/:id/status
```

### Criação e relacionamentos

`POST /api/shipments` exige:

- `employeeId` de um colaborador existente;
- `giftId` de um presente existente;
- `specialDateId` de uma data especial existente;
- `message` preenchida após remoção dos espaços nas extremidades.

Se algum relacionamento não existir, a API retorna `404`. Ausência de campo obrigatório ou mensagem vazia retorna `400`.

O status enviado pelo cliente não define o envio: em toda criação bem-sucedida, a API armazena obrigatoriamente `status` como `PENDING` e remove espaços das extremidades de `message`.

### Consulta e alteração

- `GET /api/shipments` e `GET /api/shipments/:id` exigem token válido.
- A criação e a alteração de status exigem role `admin`.
- Um envio inexistente retorna `404`.
- A única atualização disponível para o envio é `PATCH /api/shipments/:id/status`.

Respostas relevantes: `200`, `201`, `400`, `401`, `403` e `404`.

> Casos relacionados: `CT-API-036`.

---

## RN-06 — Máquina de Estados dos Envios

O campo `status` aceita exclusivamente os valores:

```text
PENDING
ORDERED
SHIPPED
DELIVERED
CANCELLED
```

As transições permitidas são:

```text
PENDING → ORDERED
PENDING → CANCELLED

ORDERED → SHIPPED
ORDERED → CANCELLED

SHIPPED → DELIVERED
SHIPPED → CANCELLED
```

`DELIVERED` e `CANCELLED` são estados finais: não permitem mudança para qualquer outro status. Também são inválidas as transições que não aparecem no fluxo permitido, como pular de `PENDING` diretamente para `SHIPPED` ou `DELIVERED`.

Em `PATCH /api/shipments/:id/status`, status inexistente na lista permitida ou transição não permitida retorna `400`. Se o envio não existir, a resposta é `404`; token ausente ou inválido retorna `401`; usuário não admin recebe `403`.

> Casos relacionados: `CT-API-043`.

---

## RN-07 — Autorização e Permissões

As regras abaixo se aplicam às rotas de domínio da API:

| Operação | Autenticação | Role `admin` |
|---|---:|---:|
| Consultas de colaboradores, datas especiais, presentes e envios | Obrigatória | Não |
| Criação, `PUT`, `PATCH` e `DELETE` de colaboradores | Obrigatória | Sim |
| Criação, `PUT`, `PATCH` e `DELETE` de datas especiais | Obrigatória | Sim |
| Criação, `PUT`, `PATCH` e `DELETE` de presentes | Obrigatória | Sim |
| Criação de envio e alteração de seu status | Obrigatória | Sim |

As rotas de cadastro e login são públicas. Nas rotas protegidas:

- ausência de token retorna `401`;
- token inválido, expirado ou sem usuário persistido retorna `401`;
- usuário autenticado com role diferente de `admin` recebe `403` em operações administrativas;
- usuário com role `admin` pode executar essas operações, desde que o payload e os relacionamentos sejam válidos.

> Casos relacionados: `CT-API-012`.

---

## RN-08 — Validações e Respostas HTTP

As validações são executadas antes de persistir uma alteração. A resposta usa o seguinte padrão geral:

| Status | Quando ocorre |
|---|---|
| `200` | Consulta ou atualização concluída com sucesso. |
| `201` | Usuário, colaborador, data especial, presente ou envio criado com sucesso. |
| `204` | Colaborador, data especial ou presente excluído com sucesso. |
| `400` | Payload obrigatório ausente, valor inválido, data inválida, preço inválido, mensagem vazia, status inválido ou transição não permitida. |
| `401` | Token ausente, inválido, expirado ou associado a usuário inexistente. |
| `403` | Usuário autenticado sem role `admin` tentou operação administrativa. |
| `404` | Recurso ou relacionamento solicitado não existe. |
| `409` | E-mail de usuário ou de colaborador já está cadastrado. |

Além das validações específicas de cada domínio, o `PATCH` de colaboradores, datas especiais e presentes descarta chaves que não pertencem ao modelo. Se nenhuma chave válida permanecer, a resposta é `400`.

Os identificadores são comparados como strings nas coleções JSON locais; por isso, qualquer valor que não encontre o recurso correspondente é tratado como inexistente e retorna `404` quando a operação consulta, altera ou exclui por identificador.
