const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('./data/invoicforge.db');
db.exec(`CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY, name TEXT, email TEXT, company TEXT, phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
)`);
db.exec(`CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY, client_id TEXT, client_name TEXT, client_email TEXT,
  items TEXT, subtotal REAL, tax REAL, total REAL, status TEXT DEFAULT 'draft',
  due_date TEXT, notes TEXT, created_at TEXT DEFAULT (datetime('now')),
  paid_at TEXT
)`);

// Clients API
app.get('/api/clients', (req, res) => {
  const clients = db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const { name, email, company, phone } = req.body;
  const id = uuidv4().slice(0, 8);
  db.prepare('INSERT INTO clients (id, name, email, company, phone) VALUES (?, ?, ?, ?, ?)').run(id, name, email, company, phone);
  res.json({ id, name, email, company, phone });
});

app.delete('/api/clients/:id', (req, res) => {
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Invoices API
app.get('/api/invoices', (req, res) => {
  const invoices = db.prepare('SELECT * FROM invoices ORDER BY created_at DESC').all().map(inv => ({
    ...inv, items: JSON.parse(inv.items || '[]')
  }));
  res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const inv = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!inv) return res.status(404).json({ error: 'Not found' });
  inv.items = JSON.parse(inv.items || '[]');
  res.json(inv);
});

app.post('/api/invoices', (req, res) => {
  const { client_name, client_email, items, tax_rate, due_date, notes } = req.body;
  const id = 'INV-' + Date.now().toString(36).toUpperCase();
  const itemsStr = JSON.stringify(items || []);
  const subtotal = items.reduce((s, i) => s + (i.qty || 0) * (i.rate || 0), 0);
  const tax = subtotal * ((tax_rate || 0) / 100);
  const total = subtotal + tax;
  db.prepare(`INSERT INTO invoices (id, client_name, client_email, items, subtotal, tax, total, status, due_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'sent', ?, ?)`).run(id, client_name, client_email, itemsStr, subtotal, tax, total, due_date, notes);
  res.json({ id, client_name, client_email, items, subtotal, tax, total, status: 'sent', due_date, notes });
});

app.patch('/api/invoices/:id/status', (req, res) => {
  const { status } = req.body;
  const paidAt = status === 'paid' ? new Date().toISOString() : null;
  db.prepare('UPDATE invoices SET status = ?, paid_at = ? WHERE id = ?').run(status, paidAt, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/invoices/:id', (req, res) => {
  db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = 5920;
app.listen(PORT, '127.0.0.1', () => console.log(`InvoiceForge API running on :${PORT}`));
