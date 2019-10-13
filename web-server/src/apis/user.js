const User = require('../models/user');
const factory = require('./factory');

const option = {
  allowedUpdateFields: ['name', 'email', 'password', 'age']
}

module.exports = factory(User, option);
