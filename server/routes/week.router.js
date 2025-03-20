const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

/**
 * GET route template
 */
router.get('/', (req, res) => {
  const queryText = `
  SELECT 
  dashboard_week.week_number, 
  dashboard_week.active_date_start, 
  dashboard_week.active_date_end, 
  dashboard_week.theme, 
  dashboard_week.content, 
  dashboard_week.focus
  FROM dashboard_week;
  `
  pool.query(queryText)
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.log('Error fetching week:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});



module.exports = router;


// 