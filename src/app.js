require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const app = express();
const json = (schema, example) => ({ content: { 'application/json': { schema, ...(example ? { example } : {}) } } });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const request = (name, example) => ({ required: true, ...json(ref(name), example) });
const idParameter = { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '1' };
const errors = (...codes) => Object.fromEntries(codes.map((code) => [code, { description: ({ 400: 'Dados inválidos', 401: 'Não autenticado', 403: 'Acesso restrito a administradores', 404: 'Recurso não encontrado', 409: 'Conflito de e-mail' })[code] }]));
const secured = { security: [{ bearerAuth: [] }] };
const schemas = {
  Error: { type: 'object', properties: { error: { type: 'string' } }, example: { error: 'Dados inválidos.' } },
  Address: { type: 'object', required: ['street', 'number', 'city'], properties: { street: { type: 'string', example: 'Rua das Flores' }, number: { type: 'string', example: '100' }, city: { type: 'string', example: 'São Paulo' } } },
  Employee: { type: 'object', required: ['name', 'email', 'birthDate', 'address'], properties: { id: { type: 'string', readOnly: true, example: '1' }, name: { type: 'string', example: 'Maria Silva' }, email: { type: 'string', format: 'email', example: 'maria@empresa.com' }, birthDate: { type: 'string', format: 'date', example: '1995-09-15' }, address: ref('Address') } },
  SpecialDate: { type: 'object', required: ['employeeId', 'type', 'date'], properties: { id: { type: 'string', readOnly: true, example: '1' }, employeeId: { type: 'string', example: '1' }, type: { type: 'string', enum: ['BIRTHDAY', 'MOTHERS_DAY', 'FATHERS_DAY', 'OTHER'], example: 'BIRTHDAY' }, date: { type: 'string', format: 'date', example: '2026-09-15' } } },
  UpcomingSpecialDate: { allOf: [ref('SpecialDate'), { type: 'object', required: ['employee', 'daysRemaining'], properties: { employee: ref('Employee'), daysRemaining: { type: 'integer', example: 10 } } }] },
  Gift: { type: 'object', required: ['name', 'description', 'price', 'store'], properties: { id: { type: 'string', readOnly: true, example: '1' }, name: { type: 'string', example: 'Kit Café da Manhã' }, description: { type: 'string', example: 'Kit com café, frutas e doces' }, price: { type: 'number', exclusiveMinimum: 0, example: 150 }, store: { type: 'string', example: 'Cesta & Cia' } } },
  ShipmentInput: { type: 'object', required: ['employeeId', 'giftId', 'specialDateId', 'message'], properties: { employeeId: { type: 'string', example: '1' }, giftId: { type: 'string', example: '1' }, specialDateId: { type: 'string', example: '1' }, message: { type: 'string', example: 'Feliz aniversário!' } } },
  Shipment: { type: 'object', required: ['employeeId', 'giftId', 'specialDateId', 'message', 'status'], properties: { id: { type: 'string', readOnly: true, example: '1' }, employeeId: { type: 'string', example: '1' }, giftId: { type: 'string', example: '1' }, specialDateId: { type: 'string', example: '1' }, message: { type: 'string', example: 'Feliz aniversário!' }, status: { type: 'string', enum: ['PENDING', 'ORDERED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], example: 'PENDING', readOnly: true } } },
  RegisterRequest: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string', example: 'Maria Silva' }, email: { type: 'string', format: 'email', example: 'maria@email.com' }, password: { type: 'string', format: 'password', example: 'Senha123!' } } },
  LoginRequest: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email', example: 'admin@mimorh.local' }, password: { type: 'string', format: 'password', example: 'Admin123!' } } },
  LoginResponse: { type: 'object', properties: { user: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' }, favorites: { type: 'array', items: {} } } }, token: { type: 'string' } } },
  ShipmentStatus: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['PENDING', 'ORDERED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] } } },
};
const listResponse = (name) => ({ 200: json({ type: 'array', items: ref(name) }) });
const itemResponses = (name, conflict = false) => ({ 200: json(ref(name)), ...errors(400, 401, 403, 404, ...(conflict ? [409] : [])) });
const crud = (name, conflict = false) => ({
  get: { ...secured, responses: { ...listResponse(name), ...errors(401) } },
  post: { ...secured, requestBody: request(name), responses: { 201: json(ref(name)), ...errors(400, 401, 403, 404, ...(conflict ? [409] : [])) } },
});
const crudById = (name, conflict = false) => ({
  get: { ...secured, parameters: [idParameter], responses: { 200: json(ref(name)), ...errors(401, 404) } },
  put: { ...secured, parameters: [idParameter], requestBody: request(name), responses: itemResponses(name, conflict) },
  patch: { ...secured, parameters: [idParameter], requestBody: request(name), responses: itemResponses(name, conflict) },
  delete: { ...secured, parameters: [idParameter], responses: { 204: { description: 'Removido' }, ...errors(401, 403, 404) } },
});
const openapi = {
  openapi: '3.0.3',
  info: { title: 'MimoRH API', version: '1.0.0', description: 'API para gestão de colaboradores, datas especiais, presentes e envios.' },
  servers: [{ url: 'http://localhost:3000' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }, schemas },
  paths: {
    '/api/health': { get: { summary: 'Health check', responses: { 200: json({ type: 'object', properties: { status: { type: 'string', example: 'ok' } } }) } } },
    '/api/auth/register': { post: { summary: 'Cadastro público', requestBody: request('RegisterRequest'), responses: { 201: json(ref('LoginResponse')), ...errors(400, 409) } } },
    '/api/auth/login': { post: { summary: 'Login', requestBody: request('LoginRequest'), responses: { 200: json(ref('LoginResponse')), ...errors(400, 401) } } },
    '/api/employees': crud('Employee', true),
    '/api/employees/{id}': crudById('Employee', true),
    '/api/special-dates': crud('SpecialDate'),
    '/api/special-dates/{id}': crudById('SpecialDate'),
    '/api/special-dates/upcoming': { get: { ...secured, summary: 'Próximas datas especiais', responses: { ...listResponse('UpcomingSpecialDate'), ...errors(401) } } },
    '/api/gifts': crud('Gift'),
    '/api/gifts/{id}': crudById('Gift'),
    '/api/shipments': { get: { ...secured, responses: { ...listResponse('Shipment'), ...errors(401) } }, post: { ...secured, requestBody: request('ShipmentInput'), responses: { 201: json(ref('Shipment')), ...errors(400, 401, 403, 404) } } },
    '/api/shipments/{id}': { get: { ...secured, parameters: [idParameter], responses: { 200: json(ref('Shipment')), ...errors(401, 404) } } },
    '/api/shipments/{id}/status': { patch: { ...secured, parameters: [idParameter], requestBody: request('ShipmentStatus'), responses: { 200: json(ref('Shipment')), ...errors(400, 401, 403, 404) } } },
  },
};

app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/resources'));
app.use('/api/shipments', require('./routes/shipments'));
app.get('/api-docs.json', (_req, res) => res.json(openapi));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
module.exports = app;
