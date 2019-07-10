const User = require('../models/user');

const userPostAPI = (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.status(200).send(user);
  }).catch(err => {
    res.status(400).send(err);
  })
}

module.exports = userPostAPI;