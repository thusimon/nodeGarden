const User = require('../models/user');
const factory = require('./factory');

const option = {
  allowedUpdateFields: ['name', 'email', 'password', 'age']
}

const api = factory(User, option);

api.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    return res.status(200).send({user, token});
  } catch (err) {
    return res.status(401).send(err.toString());
  }
}

api.register = async(req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    return res.status(201).send({user, token});
  } catch (err) {
    return res.status(401).send(err.toString());
  }
}

module.exports = api;
