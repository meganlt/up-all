const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// ========================
// GET: Fetch All Assignments
// ========================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pa.*, dw.quarter_title, dw.week, 
             u1.username AS manager_name, u2.username AS team_member_name
      FROM "pair_assignment" pa
      JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
      LEFT JOIN "user" u1 ON pa.manager_id = u1.id
      LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
      ORDER BY pa.created_at DESC;
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching all assignments:', error.message);
    res.status(500).send('Server Error');
  }
});

// ========================
// GET: Fetch Dashboard Weeks
// ========================
router.get('/week', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM "dashboard_week" ORDER BY "week";
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching weeks:', error.message);
    res.status(500).send('Server Error');
  }
});
// ========================
// POST: Assign 12 Weeks (Single Insertion Per Week)
// ========================
router.post('/assign', async (req, res) => {
  const {
    admin_id, manager_id, team_member_id,
    company_name, quarter_title, active_date_start
  } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Validate that the team member is assigned to the given manager, if a team member is provided
    if (team_member_id) {
      const validationResult = await client.query(
        `SELECT * FROM "user" WHERE id = $1 AND manager_assigned = $2;`,
        [team_member_id, manager_id]
      );
      if (validationResult.rowCount === 0) {
        return res.status(400).json({ error: 'Team member is not assigned to the given manager.' });
      }
    }
    
    // Insert a single row per week that contains both manager and team member (or NULL if not provided)
    await client.query(
      `
      WITH weeks AS (
        SELECT * FROM "dashboard_week"
        WHERE "quarter_title" = $1
        ORDER BY "week"
      )
      INSERT INTO "pair_assignment" (
        "admin_id", "manager_id", "team_member_id", "company_name",
        "dashboard_week_id", "active_date_start"
      )
      SELECT
        $2, $3, $4, $5, weeks.id,
        ($6::DATE + (weeks.week - 1) * INTERVAL '1 week')::DATE
      FROM weeks;
      `,
      [quarter_title, admin_id, manager_id, team_member_id || null, company_name, active_date_start]
    );

    await client.query('COMMIT');
    res.sendStatus(201);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error assigning quarter:', error.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

// ========================
// PUT: Update Assignment Group
// ========================
router.put('/update/pair', async (req, res) => {
  const {
    company, original_manager_id, original_team_member_id,
    new_manager_id, new_team_member_id, new_active_date_start,
    quarter_title
  } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE "pair_assignment"
      SET "manager_id" = $1,
          "team_member_id" = $2,
          "active_date_start" = $3,
          "updated_at" = now()
      WHERE "company_name" = $4
        AND "manager_id" = $5
        AND "team_member_id" = $6
        AND "dashboard_week_id" IN (
          SELECT id FROM "dashboard_week" WHERE "quarter_title" = $7
        )
      RETURNING *;
      `,
      [new_manager_id, new_team_member_id, new_active_date_start, company, original_manager_id, original_team_member_id, quarter_title]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error updating pair assignment group:', error.message);
    res.status(500).send('Server Error');
  }
});


// ========================
// PUT: Mark Assignment Group as Complete/Incomplete
// ========================
router.put('/complete/pair', async (req, res) => {
  const { company, manager_id, team_member_id, quarter_title, is_completed } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE "pair_assignment"
      SET "is_completed" = $1,
          "updated_at" = now()
      WHERE "company_name" = $2
        AND "manager_id" = $3
        AND "team_member_id" = $4
        AND "dashboard_week_id" IN (
          SELECT id FROM "dashboard_week" WHERE "quarter_title" = $5
        )
      RETURNING *;
      `,
      [is_completed, company, manager_id, team_member_id, quarter_title]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error updating completion status:', error.message);
    res.status(500).send('Server Error');
  }
});
// ========================
// DELETE: Delete Assignment Group
// ========================
router.delete('/delete/pair', async (req, res) => {
  const { company, manager_id, team_member_id, quarter_title } = req.body;
  try {
    const result = await pool.query(
      `
      DELETE FROM "pair_assignment"
      WHERE "company_name" = $1
        AND "manager_id" = $2
        AND "team_member_id" = $3
        AND "dashboard_week_id" IN (
          SELECT id FROM "dashboard_week" WHERE "quarter_title" = $4
        )
      RETURNING *;
      `,
      [company, manager_id, team_member_id, quarter_title]
    );

    if (result.rowCount === 0) {
      console.log('No assignments found to delete for:', req.body);
      return res.status(404).json({ error: 'No assignments found for the specified group.' });
    }

    console.log('Deleted assignments:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error deleting pair assignment group:', error.message);
    res.status(500).send('Server Error');
  }
})

module.exports = router;