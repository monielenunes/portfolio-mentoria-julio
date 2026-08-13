const jwt = require('jsonwebtoken');
const store = require('../services/store');
const secret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' || process.env.CI) throw new Error('JWT_SECRET deve ser definido neste ambiente.');
  return 'mimorh-development-secret';
};

function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Token não informado.' });
  try {
    const payload = jwt.verify(token, secret());
    const user = store.find('users', payload.sub || payload.id);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });
    req.user = user;
    return next();
  } catch { return res.status(401).json({ error: 'Token inválido.' }); }
}
function admin(req, res, next) { return req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Acesso restrito a administradores.' }); }
module.exports = { authenticate, admin, secret };
