const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('in Meow');
  res.send('meow');
});


module.exports = router;
