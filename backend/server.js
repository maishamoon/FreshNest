// Server.js — Main Express Server for FreshNest

const express   = require('express');
const cors      = require('cors');
const mysql     = require('mysql2/promise');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── DATABASE CONNECTION ─────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'harvestlink_db',
  waitForConnections: true,
  connectionLimit: 10,
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ─── JWT AUTH MIDDLEWARE ─────────────────────────────────

function auth(roles = []) {
  return (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ success: false, error: 'No token. Please login.' });

    try {
      const token   = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'harvestlink_secret');
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, error: 'Access denied for your role.' });
      }
      next();
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
  };
}
// ═════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, error: 'Name, email, password, and role are required.' });

    // Check if user already exists
    const existingUsers = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingUsers.length)
      return res.status(400).json({ success: false, error: 'Email already registered.' });

    // Hash password — never store plain text
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, role, location]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, email, role, location }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Registration failed.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required.' });

    const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!users.length)
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });

    const user    = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });

    // Sign JWT — valid for 7 days
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'harvestlink_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Login failed.' });
  }
});
// ═════════════════════════════════════════════════════════
// PRODUCE ROUTES (Feature 1 — Farmer only)
// ═════════════════════════════════════════════════════════
// PRODUCE ROUTES

app.get('/api/produce', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'farmer') {
      rows = await query('SELECT * FROM produce WHERE farmer_id = ? ORDER BY listed_at DESC', [req.user.id]);
    } else {
      rows = await query("SELECT * FROM produce WHERE status = 'Available' ORDER BY listed_at DESC");
    }
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch produce.' });
  }
});

app.post('/api/produce', auth(['farmer']), async (req, res) => {
  try {
    const { name, quantity, harvest_date, location } = req.body;

    if (!name || !quantity || !harvest_date || !location) {
      return res.status(400).json({ success: false });
    }

    const [result] = await pool.execute(
      `INSERT INTO produce (farmer_id, farmer_name, name, quantity, harvest_date, location, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Available')`,
      [req.user.id, req.user.name, name, quantity, harvest_date, location]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.delete('/api/produce/:id', auth(['farmer']), async (req, res) => {
  try {
    const items = await query('SELECT * FROM produce WHERE id = ?', [req.params.id]);
    if (!items.length) return res.status(404).json({ success: false, error: 'Produce not found.' });
    if (items[0].farmer_id !== req.user.id)
      return res.status(403).json({ success: false, error: 'You can only remove your own listings.' });

    await query('DELETE FROM produce WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: { message: 'Removed successfully.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete.' });
  }
});
// ═════════════════════════════════════════════════════════
//  TRANSPORT ROUTES  (Feature 2 — Farmer only)
// ═════════════════════════════════════════════════════════

app.get('/api/transport', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'farmer') {
      rows = await query('SELECT * FROM transport_requests WHERE farmer_id = ? ORDER BY created_at DESC', [req.user.id]);
    } else {
      rows = await query('SELECT * FROM transport_requests ORDER BY created_at DESC');
    }
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch transport requests.' });
  }
});
app.post('/api/transport', auth(['farmer']), async (req, res) => {
  try {
    const { produce_name, destination, pickup_location = '', quantity = '', pickup_date = null, notes = '' } = req.body;

    if (!produce_name || !destination)
      return res.status(400).json({ success: false, error: 'produce_name and destination are required.' });

    const [result] = await pool.execute(
      `INSERT INTO transport_requests
       (farmer_id, farmer_name, produce_name, pickup_location, destination, quantity, pickup_date, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
      [req.user.id, req.user.name, produce_name, pickup_location, destination, quantity, pickup_date, notes]
    );

    const [newItem] = await query('SELECT * FROM transport_requests WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create request.' });
  }
});

app.patch('/api/transport/:id', auth(['farmer']), async (req, res) => {
  try {
    const { status } = req.body;

    if (status !== 'Cancelled')
      return res.status(400).json({ success: false, error: 'Farmers can only cancel requests.' });

    const items = await query('SELECT * FROM transport_requests WHERE id = ?', [req.params.id]);

    if (!items.length)
      return res.status(404).json({ success: false, error: 'Request not found.' });

    if (items[0].farmer_id !== req.user.id)
      return res.status(403).json({ success: false, error: 'Not your request.' });

    await query('UPDATE transport_requests SET status = ? WHERE id = ?', ['Cancelled', req.params.id]);

    res.json({ success: true, data: { message: 'Request cancelled.' } });

  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to cancel.' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
