const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../services/store');
const { secret } = require('../middleware/auth');
const emailValid = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const publicUser = ({ password, ...user }) => user;
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (typeof name !== 'string' || !name.trim() || !emailValid(email) || !password) return res.status(400).json({ error: 'name, email válido e password são obrigatórios.' });
  if (store.list('users').some((user) => user.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ error: 'E-mail já cadastrado.' });
  const user = store.insert('users', {
    name: name.trim(),
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role: 'user',
    favorites: [],
  });
  return res.status(201).json(publicUser(user));
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios.' });
  const user = store.list('users').find((item) => item.email === String(email).toLowerCase());
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ error: 'Credenciais inválidas.' });
  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    secret(),
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  );
  return res.json({ user: publicUser(user), token });
});
module.exports = router;
