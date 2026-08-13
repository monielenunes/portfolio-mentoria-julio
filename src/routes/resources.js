const router = require('express').Router();
const store = require('../services/store');
const { authenticate, admin } = require('../middleware/auth');
const emailValid = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
};
const isPastOrToday = (date) => isValidDate(date) && new Date(`${date}T00:00:00`) <= new Date(new Date().toDateString());
const required = (obj, keys) => keys.every((key) => obj[key] !== undefined && obj[key] !== null && obj[key] !== '');
const notFound = (res) => res.status(404).json({ error: 'Recurso não encontrado.' });

function employeesValid(body, full) {
  const keys = ['name', 'email', 'birthDate', 'address'];
  if (full && !required(body, keys)) return 'Todos os campos são obrigatórios.';
  if (!full && ['name', 'email', 'birthDate'].some((key) => body[key] !== undefined && body[key] === '')) return 'Campos não podem ser vazios.';
  if (body.email !== undefined && !emailValid(body.email)) return 'E-mail inválido.';
  if (body.birthDate !== undefined && !isPastOrToday(body.birthDate)) return 'Data de nascimento inválida.';
  if (body.address !== undefined && (!body.address || !required(body.address, ['street', 'number', 'city']))) return 'Endereço deve conter street, number e city.';
}
function giftsValid(body, full) { if (full && !required(body, ['name', 'description', 'price', 'store'])) return 'Todos os campos são obrigatórios.'; if (!full && ['name', 'description', 'store'].some((key) => body[key] !== undefined && body[key] === '')) return 'Campos não podem ser vazios.'; if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) <= 0)) return 'price deve ser maior que zero.'; }
function datesValid(body, full) { if (full && !required(body, ['employeeId', 'type', 'date'])) return 'Todos os campos são obrigatórios.'; if (!full && ['employeeId', 'type', 'date'].some((key) => body[key] !== undefined && (body[key] === null || body[key] === ''))) return 'Campos não podem ser vazios.'; if (body.type !== undefined && !['BIRTHDAY','MOTHERS_DAY','FATHERS_DAY','OTHER'].includes(body.type)) return 'Tipo de data especial inválido.'; if (body.date !== undefined && !isValidDate(body.date)) return 'Data inválida.'; }
function registerCrud(path, collection, validate, beforeSave) {
  router.get(path, authenticate, (req, res) => res.json(store.list(collection)));
  router.get(`${path}/:id`, authenticate, (req, res) => { const item = store.find(collection, req.params.id); return item ? res.json(item) : notFound(res); });
  router.post(path, authenticate, admin, (req, res) => { const error = validate(req.body, true); if (error) return res.status(400).json({ error }); const relation = beforeSave?.(req.body); if (relation) return res.status(relation.status).json({ error: relation.error }); if (collection === 'employees' && store.list(collection).some((e) => e.email.toLowerCase() === req.body.email.toLowerCase())) return res.status(409).json({ error: 'E-mail já cadastrado.' }); return res.status(201).json(store.insert(collection, req.body)); });
  router.put(`${path}/:id`, authenticate, admin, (req, res) => { if (!store.find(collection, req.params.id)) return notFound(res); const error = validate(req.body, true); if (error) return res.status(400).json({ error }); const relation = beforeSave?.(req.body); if (relation) return res.status(relation.status).json({ error: relation.error }); if (collection === 'employees' && store.list(collection).some((e) => e.id !== req.params.id && e.email.toLowerCase() === req.body.email.toLowerCase())) return res.status(409).json({ error: 'E-mail já cadastrado.' }); return res.json(store.update(collection, req.params.id, req.body)); });
  router.patch(`${path}/:id`, authenticate, admin, (req, res) => { if (!store.find(collection, req.params.id)) return notFound(res); const fields = collection === 'employees' ? ['name','email','birthDate','address'] : collection === 'gifts' ? ['name','description','price','store'] : ['employeeId','type','date']; const body = Object.fromEntries(Object.entries(req.body).filter(([key]) => fields.includes(key))); if (!Object.keys(body).length) return res.status(400).json({ error: 'Informe ao menos um campo válido.' }); const error = validate(body, false); if (error) return res.status(400).json({ error }); const relation = beforeSave?.(body); if (relation) return res.status(relation.status).json({ error: relation.error }); if (collection === 'employees' && body.email && store.list(collection).some((e) => e.id !== req.params.id && e.email.toLowerCase() === body.email.toLowerCase())) return res.status(409).json({ error: 'E-mail já cadastrado.' }); return res.json(store.update(collection, req.params.id, body)); });
  router.delete(`${path}/:id`, authenticate, admin, (req, res) => store.remove(collection, req.params.id) ? res.status(204).send() : notFound(res));
}
registerCrud('/employees', 'employees', employeesValid);
router.get('/special-dates/upcoming', authenticate, (req, res) => { const today = new Date(); today.setHours(0,0,0,0); const rows = store.list('specialDates').map((date) => { const target = new Date(`${date.date}T00:00:00`); while (target < today) target.setFullYear(target.getFullYear() + 1); const daysRemaining = Math.ceil((target - today) / 86400000); return { ...date, employee: store.find('employees', date.employeeId), daysRemaining }; }).sort((a,b) => a.daysRemaining - b.daysRemaining); res.json(rows); });
registerCrud('/special-dates', 'specialDates', datesValid, (body) => body.employeeId && !store.find('employees', body.employeeId) ? { status: 404, error: 'Colaborador não encontrado.' } : null);
registerCrud('/gifts', 'gifts', giftsValid);
module.exports = router;
