const router = require('express').Router();
const store = require('../services/store');
const { authenticate, admin } = require('../middleware/auth');
const notFound = (res) => res.status(404).json({ error: 'Recurso não encontrado.' });
router.get('/', authenticate, (req,res) => res.json(store.list('shipments')));
router.get('/:id', authenticate, (req,res) => { const item=store.find('shipments', req.params.id); return item ? res.json(item) : notFound(res); });
router.post('/', authenticate, admin, (req,res) => { const { employeeId, giftId, specialDateId, message }=req.body; if (!employeeId || !giftId || !specialDateId || !message?.trim()) return res.status(400).json({ error:'employeeId, giftId, specialDateId e message são obrigatórios.' }); if (!store.find('employees', employeeId) || !store.find('gifts', giftId) || !store.find('specialDates', specialDateId)) return res.status(404).json({ error:'Relacionamento não encontrado.' }); return res.status(201).json(store.insert('shipments', { employeeId, giftId, specialDateId, message: message.trim(), status:'PENDING' })); });
router.patch('/:id/status', authenticate, admin, (req,res) => { const shipment=store.find('shipments', req.params.id); if (!shipment) return notFound(res); const { status }=req.body; const flow={ PENDING:['ORDERED','CANCELLED'], ORDERED:['SHIPPED','CANCELLED'], SHIPPED:['DELIVERED','CANCELLED'], DELIVERED:[], CANCELLED:[] }; if (!Object.hasOwn(flow, status) || !flow[shipment.status].includes(status)) return res.status(400).json({ error:'Transição de status inválida.' }); return res.json(store.update('shipments', req.params.id, { status })); });
module.exports = router;
