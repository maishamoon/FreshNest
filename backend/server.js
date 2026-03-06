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
 // POST /api/auth/register

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
// Hash password — never store plain text
    const hash = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, role, location]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, email, role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Registration failed.' });
  }
});

  //POST /api/auth/login
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

