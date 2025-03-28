const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET route: Fetch all weeks
router.get('/', (req, res) => {
  const queryText = `
  SELECT * FROM "dashboard_week" ORDER BY created_at DESC;
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

// GET route: Unique Titles for the Pair Assignments Page
router.get('/quarters', (req, res)=>{
  const queryText = `
  SELECT DISTINCT quarter_title FROM "dashboard_week";
  `;

  pool.query(queryText)
    .then((result) => {
      res.status(200).json(result.rows); // Send back all weeks as JSON response
    })
    .catch((err) => {
      console.error("Error fetching week titles:", err);
      res.status(500).json({ error: "Internal server error" });
    }); 
} );

// POST route: Add a new week
router.post('/add', async (req, res) => {
  const { quarter_title, week, theme, content, focus } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "dashboard_week" ("quarter_title", "week", "theme", "content", "focus") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [quarter_title, week, theme, content, focus]  // Fixed array
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding week:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PUT route: Update an existing week by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quarter_title, week, theme, content, focus } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE "dashboard_week" SET 
        "quarter_title" = $1, 
        "week" = $2, 
        "theme" = $3, 
        "content" = $4, 
        "focus" = $5, 
        "updated_at" = now()
       WHERE "id" = $6 
       RETURNING *`,
      [quarter_title, week, theme, content, focus, id]  // Now has 6 parameters
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Week not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating week:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE route: Remove a specific week by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM "dashboard_week" WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Week not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting week:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;