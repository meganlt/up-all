const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Handles the logic for creating a new user. The one extra wrinkle here is
// that we hash the password before inserting it into the database.
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);

  const sqlText = `
    INSERT INTO "user"
      ("username", "email", "password", "role")
      VALUES
      ($1, $2, $3, $4);
  `;
  const sqlValues = [username, email, hashedPassword, 'pending'];

  pool.query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error: ', dbErr);
      res.sendStatus(500);
    });
});

// Handles the logic for logging in a user. When this route receives
// a request, it runs a middleware function that leverages the Passport
// library to instantiate a session if the request body's username and
// password are correct.
  // You can find this middleware function in /server/strategies/user.strategy.js.
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    res.sendStatus(200);
  });
});

router.put('/update', async (req, res) => {
  const { first_name, last_name, pronouns, job_title, email, password } = req.body;
  const userId = req.user.id;

  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: 'User not authenticated.' });
  }

  console.log('User ID:', userId);
  console.log('Updating data:', { first_name, last_name, pronouns, job_title, email });

  try {
    let queryString = `
      UPDATE "user"
      SET "first_name" = $1,
          "last_name" = $2,
          "pronouns" = $3,
          "job_title" = $4,
          "email" = $5,
          "updated_at" = NOW()
    `;
    let values = [first_name, last_name, pronouns, job_title, email];

    if (password) {
      const hashedPassword = encryptLib.encryptPassword(password);
      queryString += `, "password" = $6 `;
      values.push(hashedPassword);
    }

    queryString += ` WHERE "id" = $${values.length + 1};`;
    values.push(userId);

    const result = await pool.query(queryString, values);

    if (result.rowCount > 0) {
      res.sendStatus(200);
    } else {
      console.log('No rows updated for user ID:', userId);
      res.status(404).send({ error: 'User not found or no changes made.' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send({ error: 'Internal server error.' });
  }
});

module.exports = router;
