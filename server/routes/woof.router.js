const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('in woof');
  res.send('woof');
});


module.exports = router;
