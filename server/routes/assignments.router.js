const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET - Fetch assignments filtered by quarter_title (if provided) and ordered by week.
router.get('/', async (req, res) => {
  try {
    // Build the base query with joins.
    let queryText = `
      SELECT pa.*, dw.week, dw.theme,
             u1.username AS manager_name, 
             u2.username AS team_member_name
      FROM "pair_assignment" pa
      JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
      LEFT JOIN "user" u1 ON pa.manager_id = u1.id
      LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
    `;
    
    const queryParams = [];
    // If quarter_title is provided in query, filter by it.
    if (req.query.quarter_title) {
      queryParams.push(req.query.quarter_title);
      queryText += ` WHERE pa.quarter_title = $1`;
    }
    
    // Order by week (or any field that suits your display needs)
    queryText += ` ORDER BY dw.week ASC;`;

    const result = await pool.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error.message);
    res.status(500).send('Server Error');
  }
});
router.put('/user/assign-manager', async (req, res) => {
  const { team_member_id, manager_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "user"
       SET manager_assigned = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *;`,
      [manager_id, team_member_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Team member not found");
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating manager assignment:", error.message);
    res.status(500).send("Server Error");
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// POST - Saves a new assignment when Ken clicks the “Assign” button.
router.post('/assign', async (req, res) => {
  console.log('in /assign POST:', req.body);
  const {
    admin_id,
    manager_id,
    team_member_id, // Can be null or a valid id
    company_name,
    quarter_title,
    active_date_start
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert a single assignment per week using the provided team_member_id (which may be null)
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
      FROM weeks
      ON CONFLICT (company_name, manager_id, team_member_id, dashboard_week_id) DO NOTHING;
      `,
      [quarter_title, admin_id, manager_id, team_member_id, company_name, active_date_start]
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET - Fetch assignments with additional filtering (by company, quarter_title, or manager_id).
router.get('/assignments/allpair', async (req, res) => {
  try {
    const { company, quarter_title, manager_id } = req.query;
    let queryText = `
      SELECT pa.*, dw.week, dw.theme, 
             u1.username AS manager_name, 
             u2.username AS team_member_name
      FROM "pair_assignment" pa
      JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
      LEFT JOIN "user" u1 ON pa.manager_id = u1.id
      LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
    `;
    
    // Build conditions based on optional query parameters.
    const queryParams = [];
    const conditions = [];
    if (company) {
      queryParams.push(company);
      conditions.push(`pa.company_name = $${queryParams.length}`);
    }
    if (quarter_title) {
      queryParams.push(quarter_title);
      conditions.push(`pa.quarter_title = $${queryParams.length}`);
    }
    if (manager_id) {
      queryParams.push(manager_id);
      conditions.push(`pa.manager_id = $${queryParams.length}`);
    }
    
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Order by company, manager and week so it matches how you group data on the client.
    queryText += ' ORDER BY pa.company_name, pa.manager_id, dw.week ASC;';
    
    const result = await pool.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error.message);
    res.status(500).send('Server Error');
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PUT route to update an entire pair assignment group (all weeks) using one assignment's ID.
router.put('/group-update/:id', async (req, res) => {
  const { id } = req.params;
  // Expect payload: admin_id, manager_id, active_date_start, and optionally new_team_member_id.
  // Company and quarter_title remain unchanged.
  const { admin_id, manager_id, active_date_start, new_team_member_id } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Retrieve the original group values using the provided id.
    const originalQuery = `
      SELECT company_name, quarter_title
      FROM pair_assignment
      WHERE id = $1
    `;
    const originalResult = await client.query(originalQuery, [id]);
    if (originalResult.rows.length === 0) {
      throw new Error("Pair assignment not found");
    }
    const { company_name, quarter_title } = originalResult.rows[0];

    // Update all rows in the group (by company_name and quarter_title) with the new manager_id and active_date_start.
    const updateQuery = `
      UPDATE pair_assignment
      SET manager_id = $1,
          active_date_start = $2,
          updated_at = NOW()
      WHERE company_name = $3
        AND quarter_title = $4
      RETURNING *;
    `;
    const updateValues = [manager_id, active_date_start, company_name, quarter_title];
    const updateResult = await client.query(updateQuery, updateValues);

    // If a new team member is provided, insert a new assignment row for each week in the quarter.
    let insertResultRows = [];
    if (new_team_member_id) {
      const insertQuery = `
        WITH weeks AS (
          SELECT id, week FROM dashboard_week
          WHERE quarter_title = $1
          ORDER BY week
        )
        INSERT INTO pair_assignment (
          admin_id, company_name, manager_id, team_member_id, dashboard_week_id, quarter_title, active_date_start
        )
        SELECT $2, $3, $4, $5, w.id,
               $1,
               ($6::DATE + (w.week - 1) * INTERVAL '1 week')::DATE
        FROM weeks w
        ON CONFLICT (company_name, manager_id, team_member_id, dashboard_week_id) DO NOTHING
        RETURNING *;
      `;
      // Parameter order:
      // $1: quarter_title,
      // $2: admin_id,
      // $3: company_name,
      // $4: manager_id,
      // $5: new_team_member_id,
      // $6: active_date_start.
      const insertValues = [quarter_title, admin_id, company_name, manager_id, new_team_member_id, active_date_start];
      const insertResult = await client.query(insertQuery, insertValues);
      insertResultRows = insertResult.rows;
    }

    await client.query('COMMIT');
    res.json({ updated: updateResult.rows, inserted: insertResultRows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating group assignment:', error.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete('/group', async (req, res) => {
  const { company_name, manager_id, quarter_title } = req.body;
  try {
    const result = await pool.query(
      `DELETE FROM "pair_assignment"
       WHERE company_name = $1 AND manager_id = $2 AND quarter_title = $3
       RETURNING *;`,
      [company_name, manager_id, quarter_title]
    );
    if(result.rowCount === 0){
      return res.status(404).send("Group not found");
    }
    res.json({ deleted: result.rows });
  } catch (error) {
    console.error("Error deleting group assignment:", error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;