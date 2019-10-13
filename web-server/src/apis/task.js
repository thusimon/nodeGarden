const Task = require('../models/task');
const factory = require('./factory');

const option = {
  allowedUpdateFields: ['description', 'completed']
}

module.exports = factory(Task, option);
