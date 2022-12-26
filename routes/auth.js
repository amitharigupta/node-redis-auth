var express = require('express');
var router = express.Router();

/* GET auth listing. */
router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
