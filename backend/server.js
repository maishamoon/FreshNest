/**
 * HarvestLink BD — Backend API Server
 * Node.js + Express + MySQL
 * 
 * Routes:
 *   POST   /api/auth/register
 *   POST   /api/auth/login
 *   GET    /api/users
 *   GET    /api/produce
 *   POST   /api/produce
 *   DELETE /api/produce/:id
 *   GET    /api/transport
 *   POST   /api/transport
 *   PATCH  /api/transport/:id
 *   GET    /api/deals
 *   POST   /api/deals
 *   PATCH  /api/deals/:id
 *   GET    /api/failures
 *   POST   /api/failures
 */

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const mysql      = require('mysql2/promise');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (file://, Postman, etc.) and any localhost
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin === 'null') {
      callback(null, true);
    } else {
      callback(null, process.env.CLIENT_ORIGIN === origin ? true : false);
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for auth routes; respond with JSON so front-end can parse it
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  handler: (req, res /*, next */) => {
    // express-rate-limit default behaviour is to send plain text.
    // We send a JSON object matching the API convention to avoid parsing
    // errors on the frontend.
    res.status(429).json({ success: false, error: 'Too many requests, please try again later.' });
  }
});

// ─── DATABASE POOL ────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'harvestlink_db',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+06:00',          // Bangladesh Standard Time
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}



/// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'No token provided.' });
    const token = header.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'harvestlink_secret');
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied for your role.' });
      }
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}
function error(res, msg, status = 400) {
  return res.status(status).json({ success: false, error: msg });
}

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password, role, location?, vehicle? }
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location, vehicle } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, error: 'Name, email, password, and role are required.' });

    // Check if user already exists
    const existingUsers = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingUsers.length)
      return res.status(400).json({ success: false, error: 'Email already registered.' });

    // Hash password — never store plain text
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, location, vehicle_type) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hash, role, location, vehicle]
    );

// Fetch the newly created user to return complete data (with created_at timestamp)
    const newUser = await query('SELECT id, name, email, role, location, vehicle_type, created_at FROM users WHERE id = ?', [result.insertId]);
    if (newUser.length) {
      success(res, newUser[0], 201);
    } else {
      success(res, { id: result.insertId, name, email, role, location, vehicle, created_at: new Date().toISOString() }, 201);
    }
  } catch (err) {
    console.error(err);
    error(res, 'Registration failed.', 500);
  }
});
/**
 * POST /api/auth/login
 * Body: { email, password }
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required.');

    const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!users.length) return error(res, 'Invalid credentials.', 401);

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return error(res, 'Invalid credentials.', 401);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'harvestlink_secret',
      { expiresIn: '7d' }
    );

    success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, vehicle: user.vehicle_type }
    });
  } catch (err) {
    console.error(err);
    error(res, 'Login failed.', 500);
  }
});

  // ─── USER ROUTES ─────────────────────────────────────────────────────────────

/** GET /api/users — Admin only */
app.get('/api/users', auth(['admin']), async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, location, vehicle_type, created_at FROM users ORDER BY created_at DESC');
    success(res, users);
  } catch (err) {
    error(res, 'Failed to fetch users.', 500);
  }
});

/** GET /api/users/me */
app.get('/api/users/me', auth(), async (req, res) => {
  try {
    const [user] = await query('SELECT id, name, email, role, location, vehicle_type, created_at FROM users WHERE id = ?', [req.user.id]);
    success(res, user);
  } catch (err) {
    error(res, 'Failed to fetch profile.', 500);
  }
});
// ═════════════════════════════════════════════════════════
//  TRANSPORT ROUTES  (Feature 2 — Farmer only)
// ═════════════════════════════════════════════════════════

// ─── PRODUCE ROUTES ───────────────────────────────────────────────────────────

/** GET /api/produce — All available (dealers/admin) or own (farmers) */
app.get('/api/produce', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'farmer') {
      rows = await query('SELECT * FROM produce WHERE farmer_id = ? ORDER BY listed_at DESC', [req.user.id]);
    } else if (req.user.role === 'dealer') {
      rows = await query("SELECT * FROM produce WHERE status = 'Available' ORDER BY listed_at DESC");
    } else {
      rows = await query('SELECT * FROM produce ORDER BY listed_at DESC');
    }
    success(res, rows);
  } catch (err) {
    error(res, 'Failed to fetch produce.', 500);
  }
});

/** POST /api/produce — Farmer only */
app.post('/api/produce', auth(['farmer']), async (req, res) => {
  try {
    const { name, category, quantity, unit, harvest_date, location, storage_temp, storage_humidity, fresh_days, storage_tips } = req.body;
    if (!name || !quantity || !harvest_date || !location) return error(res, 'Required fields missing.');

    const [result] = await pool.execute(
      `INSERT INTO produce (farmer_id, farmer_name, name, category, quantity, unit, harvest_date, location,
        storage_temp, storage_humidity, fresh_days, storage_tips, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')`,
      [req.user.id, req.user.name, name, category || 'Other', quantity, unit || 'kg',
       harvest_date, location, storage_temp || '', storage_humidity || '', fresh_days || 0, storage_tips || '']
    );

    const [newItem] = await query('SELECT * FROM produce WHERE id = ?', [result.insertId]);
    success(res, newItem, 201);
  } catch (err) {
    error(res, 'Failed to add produce.', 500);
  }
});

/** DELETE /api/produce/:id — Farmer (own) or Admin */
app.delete('/api/produce/:id', auth(['farmer', 'admin']), async (req, res) => {
  try {
    const item = await query('SELECT * FROM produce WHERE id = ?', [req.params.id]);
    if (!item.length) return error(res, 'Produce not found.', 404);
    if (req.user.role === 'farmer' && item[0].farmer_id !== req.user.id) return error(res, 'Not your listing.', 403);

    await query('DELETE FROM produce WHERE id = ?', [req.params.id]);
    success(res, { message: 'Produce removed.' });
  } catch (err) {
    error(res, 'Failed to delete produce.', 500);
  }
});

/** PATCH /api/produce/:id/status */
app.patch('/api/produce/:id/status', auth(['farmer', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Sold', 'Reserved'].includes(status)) return error(res, 'Invalid status.');
    await query('UPDATE produce SET status = ? WHERE id = ?', [status, req.params.id]);
    success(res, { message: 'Status updated.' });
  } catch (err) {
    error(res, 'Failed to update status.', 500);
  }
});
// ─── TRANSPORT ROUTES ─────────────────────────────────────────────────────────

/** GET /api/transport */
app.get('/api/transport', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'farmer') {
      rows = await query('SELECT * FROM transport_requests WHERE farmer_id = ? ORDER BY created_at DESC', [req.user.id]);
    } else if (req.user.role === 'transport') {
      rows = await query("SELECT * FROM transport_requests WHERE status = 'Open' OR assigned_to = ? ORDER BY created_at DESC", [req.user.id]);
    } else {
      rows = await query('SELECT * FROM transport_requests ORDER BY created_at DESC');
    }
    success(res, rows);
  } catch (err) {
    error(res, 'Failed to fetch transport requests.', 500);
  }
});

/** POST /api/transport — Farmer only */
app.post('/api/transport', auth(['farmer']), async (req, res) => {
  try {
    const { product_id, produce_name, pickup_location, destination, pickup_date, quantity, notes } = req.body;
    if (!produce_name || !destination) return error(res, 'Produce and destination required.');

    const [result] = await pool.execute(
      `INSERT INTO transport_requests (farmer_id, farmer_name, product_id, produce_name, pickup_location, destination, pickup_date, quantity, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
      [req.user.id, req.user.name, product_id || null, produce_name, pickup_location || '', destination, pickup_date, quantity || '', notes || '']
    );

    const [newItem] = await query('SELECT * FROM transport_requests WHERE id = ?', [result.insertId]);
    success(res, newItem, 201);
  } catch (err) {
    error(res, 'Failed to create transport request.', 500);
  }
});

/** PATCH /api/transport/:id — Accept / Complete / Cancel */
app.patch('/api/transport/:id', auth(['farmer', 'transport', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Open', 'Accepted', 'Completed', 'Cancelled', 'Failed'];
    if (!allowed.includes(status)) return error(res, 'Invalid status.');

    const item = await query('SELECT * FROM transport_requests WHERE id = ?', [req.params.id]);
    if (!item.length) return error(res, 'Request not found.', 404);

    let sql, params;
    if (status === 'Accepted' && req.user.role === 'transport') {
      sql = 'UPDATE transport_requests SET status = ?, assigned_to = ?, transporter_name = ? WHERE id = ?';
      params = [status, req.user.id, req.user.name, req.params.id];
    } else if (status === 'Cancelled' && req.user.role === 'farmer') {
      if (item[0].farmer_id !== req.user.id) return error(res, 'Not your request.', 403);
      sql = 'UPDATE transport_requests SET status = ? WHERE id = ?';
      params = [status, req.params.id];
    } else {
      sql = 'UPDATE transport_requests SET status = ? WHERE id = ?';
      params = [status, req.params.id];
    }

    await pool.execute(sql, params);
    success(res, { message: 'Status updated.' });
  } catch (err) {
    error(res, 'Failed to update transport request.', 500);
  }
});
