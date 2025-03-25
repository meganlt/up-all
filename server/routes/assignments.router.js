const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET ROUTE - Fetches all entries from the company_assignment table. Uses a JOIN with the dashboard_week table to pull in the title of the content.
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT "company_assignment".*, "dashboard_week".title 
             FROM "company_assignment"
             JOIN "dashboard_week"
             ON "company_assignment".dashboard_week_id = "dashboard_week".id
             ORDER BY "company_assignment".created_at DESC;`
        );
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching company assignments:", error.message);
        res.status(500).send("Server Error");
    }
});

// POST ROUTE - Creates a new entry into the table and returns the newly created row.
router.post('/', async (req, res) => {
    const { company_name, dashboard_week_id, active_date_start, active_date_end } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO "company_assignment" (company_name, dashboard_week_id, active_date_start, active_date_end)
             VALUES ($1, $2, $3, $4)
             RETURNING *;`,
            [company_name, dashboard_week_id, active_date_start, active_date_end]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating company assignment:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
