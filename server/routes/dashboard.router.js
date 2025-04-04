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
      SELECT
        pa.*,
        dw.quarter_title,
        dw.week,
        dw.theme,
        dw.focus,
        dw.content,
        u.first_name AS team_member_first_name,
        u.last_name AS team_member_last_name
      FROM "pair_assignment" pa
      JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
      LEFT JOIN "user" u ON pa.team_member_id = u.id
      WHERE pa.manager_id = $1
      ORDER BY pa.active_date_start ASC, dw.week ASC;
      `,
      [managerId]
    );

    const formatted = result.rows.map(row => ({
      view_for: row.team_member_id ? "team_member" : "manager",
      team_member: row.team_member_id
        ? {
            id: row.team_member_id,
            first_name: row.team_member_first_name,
            last_name: row.team_member_last_name
          }
        : null,
      quarter_title: row.quarter_title,
      week: row.week,
      theme: row.theme,
      content: row.content,
      focus: row.focus,
      active_date_start: row.active_date_start,
      is_completed: row.is_completed
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching full dashboard data for manager:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;