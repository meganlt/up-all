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

module.exports = router;
