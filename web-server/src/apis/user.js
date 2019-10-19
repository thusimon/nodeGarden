const User = require('../models/user');
const factory = require('./factory');
const { sendWelcomeEmail } = require('../email/account');

const option = {
  allowedUpdateFields: ['name', 'email', 'password', 'age']
}

const api = factory(User, option);

api.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = user.generateAuthToken();
    await user.save();
    return res.status(200).send({user, token});
  } catch (err) {
    return res.status(401).send(err.toString());
  }
}

api.register = async(req, res) => {
  const user = new User(req.body);
  user.status = 0; // not activated
  try {
    const token = user.generateAuthToken();
    const activateToken = user.generateActivationToken();
    await user.save();
    sendWelcomeEmail(user.email, user.name, activateToken);
    return res.status(201).send({user, token});
  } catch (err) {
    return res.status(401).send(err.toString());
  }
}

module.exports = api;
