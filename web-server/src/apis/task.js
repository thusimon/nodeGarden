const Task = require('../models/task');
const factory = require('./factory');

const option = {
  allowedUpdateFields: ['description', 'completed']
}

const api = factory(Task, option);

api.createTask = async (req, res) => {
  const userId = req.user._id;
  const task = new Task({
    ...req.body,
    owner: userId
  });
  try {
    await task.save();
    return res.status(201).send(task);
  } catch (err) {
    return res.status(500).send(err.toString());
  }
}

api.getTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user._id;
  try {
    if (taskId) {
      const task = await Task.findOne({_id:taskId, owner: userId})
      if (task) {
        await task.populate('owner', {name: 1, email: 1, age: 1}).execPopulate();
        return res.status(200).send(task);
      } else {
        return res.status(404).send('can not find task');
      }
    } else {
      const match = {}, sort = {};
      if (req.query.completed) {
        match.completed = req.query.completed === 'true';
      }
      if (req.query.sort) {
        const sortParts = req.query.sort.split('_');
        sort[sortParts[0]] = sortParts[1] == 'desc' ? -1 : 1; 
      }
      await req.user.populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      }).execPopulate()
      return res.status(200).send({tasks: req.user.tasks});
    }
  } catch (err) {
    return res.status(500).send(err.toString());
  }
}

api.updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user._id;
  try {
    if (!taskId) {
      return res.status(400).send('no id, can not update');
    }
    const allowedUpdateFields = ['description', 'completed'];
    const isValidUpdate = Object.keys(req.body).every(key => allowedUpdateFields.includes(key));
    if (!isValidUpdate) {
      return res.status(400).send('invalid field to update');
    }
    let task = await Task.findOne({_id: taskId, owner: userId});
    if (!task) {
      return res.status(404).send('no task found');
    }
    task = Object.assign(task, req.body);
    await task.save();
    return res.status(200).send(task);
  } catch (err) {
    return res.status(500).send(err.toString());
  }
}

api.deleteTask = async (req, res) => {
  const taskId = req.params.id, userId = req.user._id;
  try {
    if (!taskId) {
      return res.status(400).send('no id, can not delete');
    }
    const task = await Task.findOneAndDelete({_id:taskId, owner: userId});
    if (!task) {
      return res.status(404).send('no task found');
    } else {
      return res.status(200).send(task);
    }
  } catch (err) {
    return res.status(500).send(err.toString());
  }
};
module.exports = api;
