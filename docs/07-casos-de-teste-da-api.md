# Casos de teste da API

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT-API-001 | Health check | 200 e `{ status: "ok" }` |
| CT-API-012 | Consulta sem token | 401 |
| CT-API-005 | Cadastro com `role: admin` | Usuário recebe role `user` |
| CT-API-032 | Presente com preço zero | 400 |
| CT-API-027 | Data com colaborador inexistente | 404 |
| CT-API-036 | Envio criado | Status inicial `PENDING` |
| CT-API-043 | `DELIVERED → SHIPPED` | 400 |
