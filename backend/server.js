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
 *// POST /api/auth/register

   app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location = '' } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, error: 'All fields required.' });

    if (!['farmer', 'transport', 'dealer'].includes(role))
      return res.status(400).json({ success: false, error: 'Invalid role.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });

    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length)
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    
    // Hash password — never store plain text
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, role, location]
    );
    

