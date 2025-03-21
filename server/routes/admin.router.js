const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// Get all app users:
router.get('/users', (req, res)=>{
  const queryString = `
  SELECT 
    u.*,
    m.username AS manager_username
  FROM "user" u
  LEFT JOIN "user" m ON u.manager_assigned = m.id
  WHERE u.role != 'pending' AND u.role !='admin' 
  ORDER BY "id";
  `;
  pool.query( queryString ).then( (results)=>{
      res.send( results.rows );
  }).catch( (err)=>{
      console.log(err);
      res.sendStatus(400);
  })
})

// Get all pending app users:
router.get('/pending', (req, res)=>{
  const queryString = `SELECT * FROM "user" WHERE "role" = 'pending' ORDER BY "id";`;
  pool.query( queryString ).then( (results)=>{
      res.send( results.rows );
  }).catch( (err)=>{
      console.log(err);
      res.sendStatus(400);
  })
})


module.exports = router;
