const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET - Fetches all current pair assignments from the pair_assignment table. Used to populate the table in the "All Current Pair Assignments" section of the UI.
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT pa.*, u1.username AS manager_name, u2.username AS team_member_name
             FROM "pair_assignment" pa
             LEFT JOIN "user" u1 ON pa.manager_id = u1.id
             LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
             ORDER BY pa.created_at DESC;`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching all pair assignments:', error.message);
        res.status(500).send('Server Error');
    }
});

// GET - Filters assignments by a specific company_name. Used when the user clicks "Filter by Company".
router.get('/company/:company_name', async (req, res) => {
    const { company_name } = req.params;

    try {
        const result = await pool.query(
            `SELECT pa.*, u1.username AS manager_name, u2.username AS team_member_name
             FROM "pair_assignment" pa
             LEFT JOIN "user" u1 ON pa.manager_id = u1.id
             LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
             WHERE pa.company_name = $1
             ORDER BY pa.created_at DESC;`,
            [company_name]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching assignments by company name:', error.message);
        res.status(500).send('Server Error');
    }
});

// GET - Filters assignments by a specific manager_id. Used when the user clicks "Filter by Manager".
router.get('/manager/:manager_id', async (req, res) => {
    const { manager_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT pa.*, u1.username AS manager_name, u2.username AS team_member_name
             FROM "pair_assignment" pa
             LEFT JOIN "user" u1 ON pa.manager_id = u1.id
             LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
             WHERE pa.manager_id = $1
             ORDER BY pa.created_at DESC;`,
            [manager_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching assignments by manager ID:', error.message);
        res.status(500).send('Server Error');
    }
});

// POST - Saves a new assignment when Ken clicks the “Assign” button.
router.post('/', async (req, res) => {
    const {
        admin_id, manager_id, team_member_id, dashboard_week_id,
        quarter_title, company_name, active_date_start
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO "pair_assignment" (
                "admin_id", "manager_id", "team_member_id", "dashboard_week_id", 
                "quarter_title", "company_name", "active_date_start"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`,
            [admin_id, manager_id, team_member_id, dashboard_week_id,
            quarter_title, company_name, active_date_start]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating new pair assignment:', error.message);
        res.status(500).send('Server Error');
    }
});

// PUT - Updates a specific assignment by ID. Uses a parameterized query for security.
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        admin_id, manager_id, team_member_id, dashboard_week_id,
        quarter_title, company_name, active_date_start
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE "pair_assignment"
             SET 
                "admin_id" = $1,
                "manager_id" = $2,
                "team_member_id" = $3,
                "dashboard_week_id" = $4,
                "quarter_title" = $5,
                "company_name" = $6,
                "active_date_start" = $7,
                "updated_at" = now()
             WHERE "id" = $8
             RETURNING *;`,
            [admin_id, manager_id, team_member_id, dashboard_week_id,
            quarter_title, company_name, active_date_start, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating pair assignment:', error.message);
        res.status(500).send('Server Error');
    }
});

// DELETE - Deletes a specific assignment from the pair_assignment table. Returns the deleted entry to confirm the action.
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM "pair_assignment"
             WHERE "id" = $1
             RETURNING *;`,
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting pair assignment:', error.message);
        res.status(500).send('Server Error');
    }
});

// ========================
// POST: Assign 12 Weeks
// ========================
router.post('/assign', async (req, res) => {

  console.log('in /assign POST:', req.body);
    const {
      admin_id, manager_id, team_member_id,
      company_name, quarter_title, active_date_start
    } = req.body;
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // Apply to team member (if one is selected)
      if (team_member_id) {
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
          [quarter_title, admin_id, manager_id, team_member_id, company_name, active_date_start]
        );
      }
  
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
  // GET: All Assignments
  // ========================
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT pa.*, dw.quarter_title, dw.week
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        ORDER BY pa.created_at DESC;
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching all assignments:', error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // ========================
  // GET: Filter by Company and Manager
  // ========================
  router.get('/company/:company/manager/:manager_id', async (req, res) => {
    const { company, manager_id } = req.params;
  
    try {
      const result = await pool.query(
        `
        SELECT pa.*, dw.quarter_title, dw.week, u1.username AS manager_name, u2.username AS team_member_name
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        LEFT JOIN "user" u1 ON pa.manager_id = u1.id
        LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
        WHERE pa.company_name = $1
          AND pa.manager_id = $2
        ORDER BY dw.week;
        `,
        [company, manager_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching assignments by company and manager:', error.message);
      res.status(500).send('Server Error');
    }
  });

  // ========================
  // POST: Filter by just Company, or by company + manager + quarter, or only show incomplete weeks, or everything at once. Why a POST and not a GET? Because We're sending complex, multi-field filter criteria in the request body, not in the URL.
  // ========================
  
  router.post('/filter', async (req, res) => {
    const {
      company_name = null,
      manager_id = null,
      quarter_title = null,
      active_date_start = null,
      only_active = false
    } = req.body;
  
    try {
      const result = await pool.query(
        `
        SELECT pa.*, dw.quarter_title, dw.week, u1.username AS manager_name, u2.username AS team_member_name
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        LEFT JOIN "user" u1 ON pa.manager_id = u1.id
        LEFT JOIN "user" u2 ON pa.team_member_id = u2.id
        WHERE
          ($1::text IS NULL OR pa.company_name = $1)
          AND ($2::int IS NULL OR pa.manager_id = $2)
          AND ($3::text IS NULL OR dw.quarter_title = $3)
          AND ($4::date IS NULL OR pa.active_date_start >= $4)
          AND ($5::boolean IS FALSE OR pa.is_completed = FALSE)
        ORDER BY dw.week;
        `,
        [company_name, manager_id, quarter_title, active_date_start, only_active]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error filtering assignments:', error.message);
      res.status(500).send('Server Error');
    }
  });

  // ========================
  // GET: By Manager ID
  // ========================

  router.get('/manager/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT pa.*, dw.quarter_title, dw.week
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        WHERE pa.manager_id = $1
        ORDER BY pa.team_member_id, dw.week;
      `, [id]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching manager assignments:', error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // ========================
  // GET: By Team Member ID
  // ========================
  router.get('/team/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT pa.*, dw.quarter_title, dw.week
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        WHERE pa.team_member_id = $1
        ORDER BY dw.week;
      `, [id]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching team member assignments:', error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // ========================
  // PUT: Mark Week Complete
  // ========================
  router.put('/complete/:id', async (req, res) => {
    console.log('in mark week PUT:', req.params, req.body);
    const { id } = req.params;
    try {
      const result = await pool.query(`
        UPDATE "pair_assignment"
        SET "is_completed" = TRUE, "updated_at" = now()
        WHERE "id" = $1
        RETURNING *;
      `, [id]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error marking assignment complete:', error.message);
      res.status(500).send('Server Error');
    }
  });

  // ========================
  // DELETE: Remove Chunk of Assignments by Pair & Quarter
  // ========================
 // Use POST instead of DELETE
router.post('/bulk-delete', async (req, res) => {
  const { manager_id, team_member_id, quarter_title } = req.body;

  if (!manager_id || !quarter_title) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM "pair_assignment"
      USING "dashboard_week"
      WHERE "pair_assignment"."dashboard_week_id" = "dashboard_week"."id"
        AND "pair_assignment"."manager_id" = $1
        AND ${
          team_member_id !== null
            ? '"pair_assignment"."team_member_id" = $2 AND "dashboard_week"."quarter_title" = $3'
            : '"pair_assignment"."team_member_id" IS NULL AND "dashboard_week"."quarter_title" = $2'
        }
      RETURNING "pair_assignment".*;
      `,
      team_member_id !== null
        ? [manager_id, team_member_id, quarter_title]
        : [manager_id, quarter_title]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error deleting full pair assignment:', error.message);
    res.status(500).send('Server Error');
  }
});

  // ========================
  // DELETE: Remove Assignment Row
  // ========================
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        DELETE FROM "pair_assignment"
        WHERE "id" = $1
        RETURNING *;
      `, [id]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error deleting assignment row:', error.message);
      res.status(500).send('Server Error');
    }
  }); 

  // - Get all team members under a specific manager
  router.get('/team-member-list/:id', (req, res)=>{
    const queryString = `
    SELECT *
    FROM "user"
    WHERE "manager_assigned" = $1;`;
    const managerId = req.params.id;
    pool.query( queryString, [managerId] ).then( (results)=>{
      res.send( results.rows );
    }).catch( (err)=>{
        console.log(err);
        res.sendStatus(400);
    })
  })

module.exports = router;
