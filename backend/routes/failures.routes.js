const express = require('express');
const { query, pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');

const router = express.Router();

router.get('/', auth(), async (req, res) => {
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

router.post('/', auth(['transport']), async (req, res) => {
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

module.exports = router;