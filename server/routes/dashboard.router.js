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
          u.username AS team_member_username,
          u.first_name AS team_member_first_name,
          u.last_name AS team_member_last_name
        FROM "pair_assignment" pa
        JOIN "dashboard_week" dw ON pa.dashboard_week_id = dw.id
        LEFT JOIN "user" u ON pa.team_member_id = u.id
        WHERE pa.manager_id = $1
          AND (
            CURRENT_DATE >= pa.active_date_start + (dw.week - 2) * interval '1 week'
            AND CURRENT_DATE <  pa.active_date_start + (dw.week) * interval '1 week'
          )
        ORDER BY pa.team_member_id NULLS FIRST, dw.week ASC;
        `,
        [managerId]
      );
  
      const formatted = result.rows.map(row => ({
        view_for: row.team_member_id ? "team_member" : "manager",
        team_member: row.team_member_id
          ? {
              id: row.team_member_id,
              username: row.team_member_username,
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
      console.error('Error fetching current and previous weeks for manager:', error.message);
      res.status(500).send('Server Error');
    }
  });
  

// PUT: Manager submits their weekly dashboard check-in (When a manager completes their weekly dashboard check-in, 
// this route will update the manager_check_ins table and turn the follow-up and status_read columns from false to true 
// and also update the pair_assignment table is_completed from false to true).

router.put('/manager-checkin/:manager_id/:dashboard_week_id', async (req, res) => {
    const { manager_id, dashboard_week_id } = req.params;
    const { follow_up, status_read } = req.body;
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // 1. Update the manager_check_ins table
      await client.query(
        `
        UPDATE "manager_check_ins"
        SET 
          "follow_up" = $1,
          "status_read" = $2,
          "updated_at" = NOW()
        WHERE "manager_id" = $3 AND "week_of" = $4
        RETURNING *;
        `,
        [follow_up, status_read, manager_id, dashboard_week_id]
      );
  
      // 2. If they checked "I have read this", mark the assignment complete too
      if (status_read) {
        await client.query(
          `
          UPDATE "pair_assignment"
          SET "is_completed" = TRUE,
              "updated_at" = NOW()
          WHERE "manager_id" = $1
            AND "team_member_id" IS NULL
            AND "dashboard_week_id" = $2;
          `,
          [manager_id, dashboard_week_id]
        );
      }
  
      await client.query('COMMIT');
      res.status(200).json({ message: 'Check-in submitted successfully.' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating manager check-in:', error.message);
      res.status(500).send('Server Error');
    } finally {
      client.release();
    }
  });

  module.exports = router;