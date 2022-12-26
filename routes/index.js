var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const publicRootConfig = { 
  root: path.join(__dirname, '../public')
}

router.get('/login', function(req, res, next) {
  res.sendFile('login.html', publicRootConfig);
});

router.get('/register', function(req, res, next) {
  res.sendFile('register.html', publicRootConfig);
});

module.exports = router;
