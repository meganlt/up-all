const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET route: Fetch all weeks
router.get('/', (req, res) => {
  const queryText = `
  SELECT 
    dashboard_week.id,
    dashboard_week.title, 
    dashboard_week.theme, 
    dashboard_week.content, 
    dashboard_week.focus,
    dashboard_week.updated_at
  FROM dashboard_week
  ORDER BY dashboard_week.created_at DESC;
  `;

  pool.query(queryText)
    .then((result) => {
      res.status(200).json(result.rows); // Send back all weeks as JSON response
    })
    .catch((err) => {
      console.error("Error fetching weeks:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// GET route: Fetch a single week by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "dashboard_week" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Week not found" });
    }
    return res.status(200).json(result.rows[0]); // Return the single week as JSON response
  } catch (error) {
    console.error("Error fetching week by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST route: Add a new week
router.post('/add', async (req, res) => {
  const { title, theme, content, focus } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "dashboard_week" (title, theme, content, focus) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, theme, content, focus]
    );
    return res.status(201).json(result.rows[0]); // Send back the added week as a JSON response
  } catch (error) {
    console.error("Error adding week:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PUT route: Update an existing week by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, theme, content, focus } = req.body;
  try {
    const result = await pool.query(
      'UPDATE "dashboard_week" SET title = $1, theme = $2, content = $3, focus = $4, updated_at = now() WHERE id = $5 RETURNING *',
      [title, theme, content, focus, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Week not found" });
    }
    return res.status(200).json(result.rows[0]); // Return the updated week as JSON response
  } catch (error) {
    console.error("Error updating week:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE route: Remove a specific week by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "dashboard_week" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Week not found" });
    }
    return res.status(200).json(result.rows[0]); // Return the deleted week as JSON response 
  } catch (error) {
    console.error("Error deleting week:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;