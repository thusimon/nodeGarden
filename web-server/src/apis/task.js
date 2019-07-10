const Task = require('../models/task');

const taskPostAPI = (req, res) => {
  const task = new Task(req.body);
  task.save().then(() => {
    res.status(200).send(task);
  }).catch(err => {
    res.status(400).send(err);
  })
}

module.exports = taskPostAPI;