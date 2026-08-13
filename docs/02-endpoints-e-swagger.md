# Endpoints e Swagger

Swagger: `GET /api-docs`; especificação JSON: `GET /api-docs.json`.

| Domínio | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Colaboradores | `GET/POST /api/employees`, `GET/PUT/PATCH/DELETE /api/employees/:id` |
| Datas | `GET/POST /api/special-dates`, `GET /api/special-dates/upcoming`, `GET/PUT/PATCH/DELETE /api/special-dates/:id` |
| Presentes | `GET/POST /api/gifts`, `GET/PUT/PATCH/DELETE /api/gifts/:id` |
| Envios | `GET/POST /api/shipments`, `GET /api/shipments/:id`, `PATCH /api/shipments/:id/status` |

Rotas protegidas usam `Authorization: Bearer <token>`.
