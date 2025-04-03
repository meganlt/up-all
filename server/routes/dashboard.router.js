const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET: Manager's Current Week Assignment (Manager will see current active week based on present day from the pair-assignments table
// joined with the dashboard_week content (title, theme, focus, etc.), and team member ID is NULL because it's the managers personal training)

router.get('/manager/:id', async (req, res) => {
    const managerId = req.params.id;
  
    try {
      const result = await pool.query(
        `
        SELECT pa.*, dw.quarter_title, dw.week, dw.theme, dw.focus, dw.content
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        WHERE pa.manager_id = $1
          AND pa.team_member_id IS NULL
          AND pa.active_date_start <= CURRENT_DATE
        ORDER BY pa.active_date_start DESC
        LIMIT 1;
        `,
        [managerId]
      );
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching manager dashboard content:', error.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;