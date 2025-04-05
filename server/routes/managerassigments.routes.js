const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// ========================
// GET: All Assignments for Manager (Grouped by Week)
// ========================
router.get('/:managerId', async (req, res) => {
  const { managerId } = req.params;
  const { company_name, quarter_title } = req.query;

  if (!managerId) return res.status(400).json({ error: "Manager ID required" });

  try {
    const values = [managerId];
    const conditions = [`pa.manager_id = $1`];

    if (company_name) {
      values.push(company_name);
      conditions.push(`pa.company_name = $${values.length}`);
    }

    if (quarter_title) {
      values.push(quarter_title);
      conditions.push(`pa.quarter_title = $${values.length}`);
    }

    const result = await pool.query(
      `
      SELECT 
        pa.id,
        pa.manager_id,
        pa.team_member_id,
        pa.company_name,
        pa.quarter_title,
        pa.dashboard_week_id,
        dw.start_date,
        CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager_name,
        CONCAT(tm.first_name, ' ', tm.last_name) AS team_member_name
      FROM pair_assignment pa
      JOIN dashboard_week dw ON pa.dashboard_week_id = dw.id
      LEFT JOIN "user" mgr ON pa.manager_id = mgr.id
      LEFT JOIN "user" tm ON pa.team_member_id = tm.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY pa.company_name, pa.quarter_title, dw.start_date, pa.team_member_id;
      `,
      values
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching manager assignments:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ========================
// PUT: Mark Week Complete
// ========================
router.put('/complete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE pair_assignment
      SET updated_at = NOW()
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Assignment not found" });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error marking complete:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ========================
// PUT: Reassign Team Member
// ========================
router.put('/reassign/:id', async (req, res) => {
  const { id } = req.params;
  const { new_team_member_id } = req.body;

  if (!new_team_member_id) {
    return res.status(400).json({ error: "New team member ID required" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE pair_assignment
      SET team_member_id = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
      [new_team_member_id, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Assignment not found" });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error reassigning team member:", error.message);
    res.status(500).json({ error: "Server Error" });
  }


});
router.delete('/deleteA', async (req, res) => {
  const { quarter } = req.params;
  if (!quarter) return res.status(400).json({ error: "Quarter title is required" });

  try {
    const result = await pool.query(`
      DELETE FROM pair_assignment
      WHERE dashboard_week_id IN (
        SELECT id FROM dashboard_week WHERE quarter_title = $1
      );
    `, [quarter]);

    console.log(`Deleted ${result.rowCount} pair assignments for quarter:`, quarter);
    res.status(200).json({ message: `Deleted ${result.rowCount} pair assignments for quarter "${quarter}"` });
  } catch (error) {
    console.error("Error deleting pair assignments by quarter:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;