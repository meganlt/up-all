const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET all Check-Ins
router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM "manager_check_ins"
        ORDER BY "updated_at" DESC;
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching all manager check-ins:', error.message);
      res.status(500).send('Server Error');
    }
  });

// GET Check-Ins by Manager ID
router.get('/manager/:manager_id', async (req, res) => {
    const { manager_id } = req.params;
  
    try {
      const result = await pool.query(`
        SELECT * FROM "manager_check_ins"
        WHERE "manager_id" = $1
        ORDER BY "updated_at" DESC;
      `, [manager_id]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching manager check-ins by ID:', error.message);
      res.status(500).send('Server Error');
    }
  });

// GET Check-Ins for a specific week
router.get('/week/:dashboard_week_id', async (req, res) => {
    const { dashboard_week_id } = req.params;
  
    try {
      const result = await pool.query(`
        SELECT * FROM "manager_check_ins"
        WHERE "week_of" = $1
        ORDER BY "manager_id";
      `, [dashboard_week_id]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching check-ins by week:', error.message);
      res.status(500).send('Server Error');
    }
  });

// GET Only completed Check-Ins
router.get('/completed', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM "manager_check_ins"
        WHERE "status_read" = TRUE
        ORDER BY "updated_at" DESC;
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching completed check-ins:', error.message);
      res.status(500).send('Server Error');
    }
  });

// GET Completion Count by Manager
router.get('/summary/:manager_id', async (req, res) => {
    const { manager_id } = req.params;
  
    try {
      const result = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE "status_read" = TRUE) AS completed_weeks,
          COUNT(*) AS total_weeks
        FROM "manager_check_ins"
        WHERE "manager_id" = $1;
      `, [manager_id]);
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching manager check-in summary:', error.message);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;