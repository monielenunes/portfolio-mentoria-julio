const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const fileFor = (collection) => path.join(dataDir, `${collection}.json`);

function list(collection) { return JSON.parse(fs.readFileSync(fileFor(collection), 'utf8')); }
function save(collection, values) { fs.writeFileSync(fileFor(collection), `${JSON.stringify(values, null, 2)}\n`); }
function nextId(items) { return String(Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1); }
function find(collection, id) { return list(collection).find((item) => item.id === String(id)); }
function insert(collection, value) { const values = list(collection); const item = { id: nextId(values), ...value }; values.push(item); save(collection, values); return item; }
function update(collection, id, value) { const values = list(collection); const index = values.findIndex((item) => item.id === String(id)); if (index < 0) return null; values[index] = { ...values[index], ...value }; save(collection, values); return values[index]; }
function remove(collection, id) { const values = list(collection); const index = values.findIndex((item) => item.id === String(id)); if (index < 0) return false; values.splice(index, 1); save(collection, values); return true; }
module.exports = { list, find, insert, update, remove };
