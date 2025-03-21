const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// Get all app users:
router.get('/users', (req, res)=>{
  const queryString = `SELECT * FROM "user" WHERE "role" != 'pending' AND "role" != 'admin' ORDER BY "id" DESC;`;
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

// Update pending app user:


module.exports = router;
