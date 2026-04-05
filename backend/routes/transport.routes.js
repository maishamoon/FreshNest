const express = require('express');
const { query, pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');

const router = express.Router();

router.get('/', auth(), async (req, res) => {
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

router.post('/', auth(['farmer']), async (req, res) => {
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

router.patch('/:id', auth(['farmer', 'transport', 'admin']), async (req, res) => {
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

module.exports = router;