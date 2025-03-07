const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('in rawr');
  res.send('rawr');
});


module.exports = router;
