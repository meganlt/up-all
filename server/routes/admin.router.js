const express = require('express');
const encryptLib = require('../modules/encryption');
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

// Update User
router.put('/user', async (req, res) => {
  console.log('in /PUT:', req.body);

  const userId = req.body.userId;
  const newUserRole = req.body.userRole;
  const newUserManagerUsername = req.body.userManager; // Expecting a username here
  const newUserCompany = req.body.userCompany;
  const newUserPassword = req.body.userPassword;

  try {
    let newUserManagerId = null;

    // If a manager username is provided, look up their ID
    if (newUserManagerUsername) {
      const managerQuery = `SELECT id FROM "user" WHERE username = $1 LIMIT 1;`;
      const managerResult = await pool.query(managerQuery, [newUserManagerUsername]);

      if (managerResult.rows.length > 0) {
        newUserManagerId = managerResult.rows[0].id;
      } else {
        return res.status(400).send({ error: 'Manager username not found' });
      }
    }

    let queryString = '';
    let values = [];

    if (newUserPassword.length > 0) {
      console.log('new password provided!');
      const newHashedPassword = encryptLib.encryptPassword(newUserPassword);
      queryString = `
        UPDATE "user"
        SET "role" = $1,
            "manager_assigned" = $2,
            "company" = $3,
            "password" = $4
        WHERE "id" = $5;
      `;
      values = [newUserRole, newUserManagerId, newUserCompany, newHashedPassword, userId];
    } else {
      console.log('NO PASSWORD UPDATE');
      queryString = `
        UPDATE "user"
        SET "role" = $1,
            "manager_assigned" = $2,
            "company" = $3
        WHERE "id" = $4;
      `;
      values = [newUserRole, newUserManagerId, newUserCompany, userId];
    }

    const updateResult = await pool.query(queryString, values);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// Delete User
router.delete('/user', (req, res)=>{
  console.log(req.body, req.query);
  const userToDelete = req.query.id;

  // Do i need to check database for if they are a manager, with associates assigned?
  
})


module.exports = router;
