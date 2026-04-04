/**
 * FreshNest — Backend API Server
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

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';
  const weakSecrets = ['freshnest_secret', 'secret', 'password', '123456', 'default'];
  
  if (!secret) {
    if (isProduction) {
      throw new Error('JWT_SECRET is required in production environment!');
    }
    console.warn('⚠️  WARNING: Using temporary JWT_SECRET. Set JWT_SECRET in .env for production!');
    return 'dev_temp_secret_do_not_use_in_prod_' + Date.now();
  }
  
  if (weakSecrets.includes(secret.toLowerCase())) {
    if (isProduction) {
      throw new Error('JWT_SECRET is too weak for production! Use a strong, unique secret.');
    }
    console.warn('⚠️  WARNING: JWT_SECRET is weak. This is OK for development only.');
  }
  
  return secret;
}

const JWT_SECRET = getJwtSecret();

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
  database: process.env.DB_NAME     || 'freshnest_db',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+06:00',
});

async function initDatabase() {
  const fs = require('fs');
  const path = require('path');
  
  const dbName = process.env.DB_NAME || 'freshnest_db';
  const tempPool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 2,
  });

  try {
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempPool.end();
    
    process.env.DB_NAME = dbName;
    const db = require('./db_init');
    if (db && db.init) await db.init();
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}



/// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ success: false, error: 'No token provided.' });
    const token = header.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, error: 'Access denied for your role.' });
      }
      next();
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
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

// ─── INPUT VALIDATION ────────────────────────────────────────────────────────────
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateRequired(obj, fields) {
  const missing = [];
  for (const field of fields) {
    if (!obj[field]) missing.push(field);
  }
  return missing;
}

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password, role, location?, vehicle? }
 */
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role, location, vehicle } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, error: 'Name, email, password, and role are required.' });

    const allowedRoles = ['farmer', 'transport', 'dealer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role.' });
    }

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
app.post('/api/auth/login', authLimiter, async (req, res) => {
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
      JWT_SECRET,
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
    if (!user) return error(res, 'User not found.', 404);
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
    console.log(`User ${req.user.id} (${req.user.role}) fetching produce...`);
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
  console.log(`User ${req.user.id} (${req.user.role}) adding produce...`);
  try {
    const { name, category, quantity, unit, harvest_date, location, storage_temp, storage_humidity, fresh_days, storage_tips, expected_price_per_kg } = req.body;
    if (!name || !quantity || !harvest_date || !location) return error(res, 'Required fields missing.');

    const [result] = await pool.execute(
      `INSERT INTO produce (farmer_id, farmer_name, name, category, quantity, unit, harvest_date, location,
        storage_temp, storage_humidity, fresh_days, storage_tips, expected_price_per_kg, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')`,
      [req.user.id, req.user.name, name, category || 'Other', quantity, unit || 'kg',
       harvest_date, location, storage_temp || '', storage_humidity || '', fresh_days || 0, storage_tips || '', expected_price_per_kg || null]
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
    
    const item = await query('SELECT * FROM produce WHERE id = ?', [req.params.id]);
    if (!item.length) return error(res, 'Produce not found.', 404);
    
    if (req.user.role === 'farmer' && item[0].farmer_id !== req.user.id) {
      return error(res, 'Not your produce.', 403);
    }
    
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
    if (!destination) return error(res, 'Destination required.');

    let canonicalProductId = product_id || null;
    let canonicalProduceName = produce_name || '';
    let canonicalPickup = pickup_location || '';

    if (product_id) {
      const [produce] = await query('SELECT id, name, location, farmer_id FROM produce WHERE id = ?', [product_id]);
      if (!produce) return error(res, 'Product not found.', 404);
      if (produce.farmer_id !== req.user.id) return error(res, 'Not your produce.', 403);
      canonicalProductId = produce.id;
      canonicalProduceName = produce.name;
      canonicalPickup = pickup_location || produce.location || '';
    }

    if (!canonicalProduceName) return error(res, 'Produce required.');
    if (!canonicalPickup) return error(res, 'Pickup location required.');

    const [result] = await pool.execute(
      `INSERT INTO transport_requests (farmer_id, farmer_name, product_id, produce_name, pickup_location, destination, pickup_date, quantity, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
      [req.user.id, req.user.name, canonicalProductId, canonicalProduceName, canonicalPickup, destination, pickup_date, quantity || '', notes || '']
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

    const currentStatus = item[0].status;
    const isAdmin = req.user.role === 'admin';
    const isFarmer = req.user.role === 'farmer';
    const isTransport = req.user.role === 'transport';
    const isFarmOwner = item[0].farmer_id === req.user.id;
    const isAssigned = item[0].assigned_to === req.user.id;

    if (isTransport && status === 'Accepted') {
      if (currentStatus !== 'Open') return error(res, 'Can only accept Open requests.');
    } else if (isTransport && (status === 'Completed' || status === 'Failed')) {
      if (!isAssigned) return error(res, 'Only assigned transporter can complete this request.');
      if (currentStatus !== 'Accepted') return error(res, 'Can only complete Accepted requests.');
    } else if (isFarmer && status === 'Cancelled') {
      if (!isFarmOwner) return error(res, 'Not your request.', 403);
      if (currentStatus === 'Completed' || currentStatus === 'Failed') return error(res, 'Cannot cancel completed requests.');
    } else if (!isAdmin && !isFarmer && !isTransport) {
      return error(res, 'Unauthorized role for this action.', 403);
    }

    let sql, params;
    if (status === 'Accepted' && isTransport) {
      sql = 'UPDATE transport_requests SET status = ?, assigned_to = ?, transporter_name = ? WHERE id = ?';
      params = [status, req.user.id, req.user.name, req.params.id];
    } else if (status === 'Cancelled' && isFarmer) {
      sql = 'UPDATE transport_requests SET status = ? WHERE id = ?';
      params = [status, req.params.id];
    } else if (isAdmin) {
      sql = 'UPDATE transport_requests SET status = ? WHERE id = ?';
      params = [status, req.params.id];
    } else if (isTransport && isAssigned) {
      sql = 'UPDATE transport_requests SET status = ? WHERE id = ?';
      params = [status, req.params.id];
    } else {
      return error(res, 'Unauthorized to update this request.', 403);
    }

    await pool.execute(sql, params);
    success(res, { message: 'Status updated.' });
  } catch (err) {
    error(res, 'Failed to update transport request.', 500);
  }
});

// ─── DEALS ROUTES ─────────────────────────────────────────────────────────────

/** GET /api/deals */
app.get('/api/deals', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'farmer') {
      rows = await query('SELECT * FROM deals WHERE farmer_id = ? ORDER BY created_at DESC', [req.user.id]);
    } else if (req.user.role === 'dealer') {
      rows = await query('SELECT * FROM deals WHERE dealer_id = ? ORDER BY created_at DESC', [req.user.id]);
    } else {
      rows = await query('SELECT * FROM deals ORDER BY created_at DESC');
    }
    success(res, rows);
  } catch (err) {
    error(res, 'Failed to fetch deals.', 500);
  }
});

/** POST /api/deals — Dealer only */
app.post('/api/deals', auth(['dealer']), async (req, res) => {
  try {
    const { farmer_id, farmer_name, product_id, produce_name, quantity_requested, offered_price_per_kg, message } = req.body;
    if (!offered_price_per_kg) return error(res, 'Required fields missing.');
    
    let canonicalFarmerId = farmer_id;
    let canonicalFarmerName = farmer_name;
    let canonicalProduceName = produce_name;
    let canonicalProductId = product_id || null;
    
    if (product_id) {
      const produce = await query('SELECT p.*, u.name as farmer_name FROM produce p LEFT JOIN users u ON p.farmer_id = u.id WHERE p.id = ?', [product_id]);
      if (!produce.length) return error(res, 'Product not found.', 404);
      if (produce[0].status !== 'Available') return error(res, 'Product is not available.');
      if (farmer_id && produce[0].farmer_id !== farmer_id) {
        return error(res, 'Farmer does not match product owner.', 400);
      }
      canonicalFarmerId = produce[0].farmer_id;
      canonicalFarmerName = produce[0].farmer_name;
      canonicalProduceName = produce[0].name;
      canonicalProductId = produce[0].id;
    } else {
      if (!farmer_id || !produce_name) return error(res, 'Farmer and produce required.');
      const farmer = await query('SELECT name FROM users WHERE id = ? AND role = "farmer"', [farmer_id]);
      if (!farmer.length) return error(res, 'Farmer not found.', 404);
      canonicalFarmerName = farmer[0].name;
    }

    const [result] = await pool.execute(
      `INSERT INTO deals (dealer_id, dealer_name, farmer_id, farmer_name, product_id, produce_name, quantity_requested, offered_price_per_kg, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [req.user.id, req.user.name, canonicalFarmerId, canonicalFarmerName, canonicalProductId, canonicalProduceName, quantity_requested || '', offered_price_per_kg, message || '']
    );

    if (canonicalProductId) {
      await pool.execute(
        'INSERT INTO price_history (product_id, dealer_id, offered_price_per_kg) VALUES (?, ?, ?)',
        [canonicalProductId, req.user.id, offered_price_per_kg]
      );
    }

    const [newItem] = await query('SELECT * FROM deals WHERE id = ?', [result.insertId]);
    success(res, newItem, 201);
  } catch (err) {
    error(res, 'Failed to create deal.', 500);
  }
});

/** PATCH /api/deals/:id — Farmer responds */
app.patch('/api/deals/:id', auth(['farmer', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Declined'].includes(status)) return error(res, 'Invalid status.');

    const item = await query('SELECT * FROM deals WHERE id = ?', [req.params.id]);
    if (!item.length) return error(res, 'Deal not found.', 404);
    if (item[0].status !== 'Pending') return error(res, 'Deal already responded.', 400);
    if (req.user.role === 'farmer' && item[0].farmer_id !== req.user.id) return error(res, 'Not your deal.', 403);

    await query('UPDATE deals SET status = ?, responded_at = NOW() WHERE id = ?', [status, req.params.id]);
    success(res, { message: `Deal ${status.toLowerCase()}.` });
  } catch (err) {
    error(res, 'Failed to update deal.', 500);
  }
});

// ─── FAILURES ROUTES ─────────────────────────────────────────────────────────

/** GET /api/failures */
app.get('/api/failures', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'transport') {
      rows = await query('SELECT * FROM delivery_failures WHERE transporter_id = ? ORDER BY reported_at DESC', [req.user.id]);
    } else {
      rows = await query('SELECT * FROM delivery_failures ORDER BY reported_at DESC');
    }
    success(res, rows);
  } catch (err) {
    error(res, 'Failed to fetch failures.', 500);
  }
});

/** POST /api/failures — Transport only */
app.post('/api/failures', auth(['transport']), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { transport_request_id, produce_name, route, reason, notes, alternatives } = req.body;
    if (!transport_request_id || !reason) return error(res, 'Request ID and reason required.');

    const [requests] = await connection.execute(
      'SELECT * FROM transport_requests WHERE id = ?',
      [transport_request_id]
    );
    if (!requests.length) return error(res, 'Transport request not found.', 404);
    
    const request = requests[0];
    if (request.assigned_to !== req.user.id) {
      return error(res, 'You are not assigned to this request.', 403);
    }
    if (request.status !== 'Accepted') {
      return error(res, 'Can only report failure for Accepted requests.', 400);
    }

    await connection.beginTransaction();
    
    const [insertResult] = await connection.execute(
      `INSERT INTO delivery_failures (transporter_id, transporter_name, transport_request_id, produce_name, route, reason, notes, alternatives)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, transport_request_id, request.produce_name || '', `${request.pickup_location} -> ${request.destination}`, reason, notes || '', JSON.stringify(alternatives || [])]
    );
    
    await connection.execute(
      "UPDATE transport_requests SET status = 'Failed' WHERE id = ?",
      [transport_request_id]
    );
    
    await connection.commit();
    
    const [newItem] = await connection.execute('SELECT * FROM delivery_failures WHERE id = ?', [insertResult.insertId]);
    success(res, newItem[0], 201);
  } catch (err) {
    await connection.rollback();
    error(res, 'Failed to report failure.', 500);
  } finally {
    connection.release();
  }
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'OK', timestamp: new Date().toISOString(), service: 'FreshNest API' } });
});

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found.` });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// ─── START ────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await initDatabase();
  } catch (e) {
    console.log('Continuing without DB init...');
  }

  app.listen(PORT, () => {
    console.log(`✅ FreshNest API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start();
