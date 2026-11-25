import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'HomeServe Pro API', timestamp: new Date().toISOString() });
});

// Categories
app.get('/api/categories', (_req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
  res.json(categories);
});

// Services (with optional categoryId, search, popular, activeOnly)
app.get('/api/services', (req, res) => {
  const { categoryId, q, popular, all } = req.query;
  let sql = `
    SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM services s
    JOIN categories c ON s.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (!all) {
    sql += ' AND s.is_active = 1';
  }
  if (categoryId && categoryId !== 'all') {
    sql += ' AND s.category_id = ?';
    params.push(categoryId);
  }
  if (popular === '1' || popular === 'true') {
    sql += ' AND s.is_popular = 1';
  }
  if (q) {
    sql += ' AND (LOWER(s.name) LIKE ? OR LOWER(s.description) LIKE ? OR LOWER(c.name) LIKE ?)';
    const term = `%${String(q).toLowerCase()}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY s.is_popular DESC, s.reviews_count DESC';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(r => ({
    ...r,
    includes: r.includes ? r.includes.split(',').map(x => x.trim()) : []
  })));
});

app.post('/api/services', (req, res) => {
  const {
    category_id, name, description, price, original_price,
    duration_mins = 45, warranty_days = 30, includes = [], is_popular = 0
  } = req.body;

  if (!category_id || !name || !price) {
    return res.status(400).json({ error: 'category_id, name and price are required' });
  }

  const id = `srv-${crypto.randomBytes(4).toString('hex')}`;
  const includesStr = Array.isArray(includes) ? includes.join(',') : String(includes || '');
  db.prepare(`
    INSERT INTO services (id, category_id, name, description, price, original_price, duration_mins, warranty_days, includes, is_popular, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(id, category_id, name, description || '', Number(price), original_price ? Number(original_price) : null, Number(duration_mins), Number(warranty_days), includesStr, is_popular ? 1 : 0);

  const created = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
  res.status(201).json(created);
});

app.patch('/api/services/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Service not found' });

  const {
    name = existing.name,
    description = existing.description,
    price = existing.price,
    original_price = existing.original_price,
    duration_mins = existing.duration_mins,
    warranty_days = existing.warranty_days,
    is_popular = existing.is_popular,
    is_active = existing.is_active
  } = req.body;

  db.prepare(`
    UPDATE services
    SET name = ?, description = ?, price = ?, original_price = ?, duration_mins = ?, warranty_days = ?, is_popular = ?, is_active = ?
    WHERE id = ?
  `).run(name, description, Number(price), original_price ? Number(original_price) : null, Number(duration_mins), Number(warranty_days), is_popular ? 1 : 0, is_active ? 1 : 0, req.params.id);

  res.json(db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id));
});

app.delete('/api/services/:id', (req, res) => {
  const info = db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Service not found' });
  res.json({ deleted: true });
});

// Technicians
app.get('/api/technicians', (_req, res) => {
  const rows = db.prepare('SELECT * FROM technicians ORDER BY jobs_completed DESC').all();
  res.json(rows);
});

app.post('/api/technicians', (req, res) => {
  const { name, phone, specialty, city = 'Delhi NCR' } = req.body;
  if (!name || !phone || !specialty) {
    return res.status(400).json({ error: 'name, phone and specialty are required' });
  }
  const colors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#10b981', '#ec4899', '#f59e0b'];
  const id = `tech-${crypto.randomBytes(4).toString('hex')}`;
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];
  db.prepare(`
    INSERT INTO technicians (id, name, phone, specialty, city, rating, jobs_completed, is_available, avatar_color)
    VALUES (?, ?, ?, ?, ?, 4.8, 0, 1, ?)
  `).run(id, name, phone, specialty, city, avatarColor);

  res.status(201).json(db.prepare('SELECT * FROM technicians WHERE id = ?').get(id));
});

app.patch('/api/technicians/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM technicians WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Technician not found' });

  const is_available = req.body.is_available !== undefined ? (req.body.is_available ? 1 : 0) : existing.is_available;
  const specialty = req.body.specialty ?? existing.specialty;
  const city = req.body.city ?? existing.city;

  db.prepare('UPDATE technicians SET is_available = ?, specialty = ?, city = ? WHERE id = ?')
    .run(is_available, specialty, city, req.params.id);
  res.json(db.prepare('SELECT * FROM technicians WHERE id = ?').get(req.params.id));
});

// Bookings
app.get('/api/bookings', (req, res) => {
  const { status, phone } = req.query;
  let sql = `
    SELECT b.*, t.name as technician_name, t.phone as technician_phone
    FROM bookings b
    LEFT JOIN technicians t ON b.technician_id = t.id
    WHERE 1=1
  `;
  const params = [];
  if (status && status !== 'all') {
    sql += ' AND b.status = ?';
    params.push(status);
  }
  if (phone) {
    sql += ' AND b.customer_phone LIKE ?';
    params.push(`%${phone}%`);
  }
  sql += ' ORDER BY b.created_at DESC';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(r => ({
    ...r,
    items: JSON.parse(r.items_json || '[]')
  })));
});

app.post('/api/bookings', (req, res) => {
  const {
    customer_name,
    customer_phone,
    address,
    city = 'Delhi NCR',
    scheduled_date,
    scheduled_slot,
    payment_method = 'UPI / Cash on Visit',
    notes = '',
    items = [],
    source = 'website'
  } = req.body;

  if (!customer_name || !customer_phone || !address || !scheduled_date || !scheduled_slot || !items.length) {
    return res.status(400).json({ error: 'Missing required booking fields or empty cart' });
  }

  const total_amount = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty || 1)), 0);
  const id = `bk-${crypto.randomBytes(4).toString('hex')}`;
  const booking_code = `HS-${Math.floor(1000 + Math.random() * 9000)}`;
  const created_at = new Date().toISOString();

  db.prepare(`
    INSERT INTO bookings (id, booking_code, customer_name, customer_phone, address, city, scheduled_date, scheduled_slot, payment_method, notes, items_json, total_amount, status, source, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `).run(
    id, booking_code, customer_name, customer_phone, address, city,
    scheduled_date, scheduled_slot, payment_method, notes,
    JSON.stringify(items), total_amount, source, created_at
  );

  const created = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  res.status(201).json({ ...created, items });
});

app.patch('/api/bookings/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Booking not found' });

  const status = req.body.status ?? existing.status;
  const technician_id = req.body.technician_id !== undefined ? req.body.technician_id : existing.technician_id;

  db.prepare('UPDATE bookings SET status = ?, technician_id = ? WHERE id = ?')
    .run(status, technician_id || null, req.params.id);

  if (status === 'completed' && existing.status !== 'completed' && technician_id) {
    db.prepare('UPDATE technicians SET jobs_completed = jobs_completed + 1 WHERE id = ?').run(technician_id);
  }

  const updated = db.prepare(`
    SELECT b.*, t.name as technician_name, t.phone as technician_phone
    FROM bookings b
    LEFT JOIN technicians t ON b.technician_id = t.id
    WHERE b.id = ?
  `).get(req.params.id);

  res.json({ ...updated, items: JSON.parse(updated.items_json || '[]') });
});

// Admin Dashboard Stats
app.get('/api/stats', (_req, res) => {
  const totalBookings = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;
  const pendingBookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'").get().c;
  const completedBookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'completed'").get().c;
  const activeServices = db.prepare('SELECT COUNT(*) as c FROM services WHERE is_active = 1').get().c;
  const totalTechnicians = db.prepare('SELECT COUNT(*) as c FROM technicians').get().c;
  const availableTechnicians = db.prepare('SELECT COUNT(*) as c FROM technicians WHERE is_available = 1').get().c;
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as rev FROM bookings WHERE status != 'cancelled'").get().rev;

  res.json({
    totalBookings,
    pendingBookings,
    completedBookings,
    activeServices,
    totalTechnicians,
    availableTechnicians,
    totalRevenue
  });
});

// Serve built static apps if available (website at / and admin at /admin)
const adminDist = path.join(__dirname, '..', '..', 'admin', 'dist');
const websiteDist = path.join(__dirname, '..', '..', 'website', 'dist');

if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist));
  app.get('/admin/*', (_req, res) => res.sendFile(path.join(adminDist, 'index.html')));
}
if (fs.existsSync(websiteDist)) {
  app.use('/', express.static(websiteDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
    res.sendFile(path.join(websiteDist, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HomeServe Pro API running at http://localhost:${PORT}`);
});
