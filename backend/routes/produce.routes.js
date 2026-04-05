const express = require('express');
const { query, pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');

const router = express.Router();

router.get('/', auth(), async (req, res) => {
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

router.post('/', auth(['farmer']), async (req, res) => {
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

router.delete('/:id', auth(['farmer', 'admin']), async (req, res) => {
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

router.patch('/:id/status', auth(['farmer', 'admin']), async (req, res) => {
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

module.exports = router;