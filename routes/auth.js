var express = require('express');
var router = express.Router();

const tempDB = [];

/* GET auth listing. */
// Register Route
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  let existingUser = tempDB.find((user) => user.username === username);
  if(existingUser) {
    return res.statusCode(422).json({ status: 422, message: "User is already exist" })
  }
  const user = { username, password };
  tempDB.push(user);
  req.session.user = user;

  res.statusCode(200).json({ status: 200, message: "User created successfully", data: user });
});

module.exports = router;
