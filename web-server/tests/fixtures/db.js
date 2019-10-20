const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = mongoose.Types.ObjectId();
const userOneData = {
  _id: userOneId,
  name: 'eric',
  email: 'eric@sp.com',
  password: '1234567',
  tokens: [
    {token: jwt.sign({id: userOneId}, process.env.JWT_PRIVATE_KEY)}
  ]
};

const userTwoId = mongoose.Types.ObjectId();
const userTwoData = {
  _id: userTwoId,
  name: 'stan',
  email: 'stan@sp.com',
  password: '1234567',
  tokens: [
    {token: jwt.sign({id: userTwoId}, process.env.JWT_PRIVATE_KEY)}
  ]
};

const taskOneData = {
  _id: mongoose.Types.ObjectId(),
  description: 'task one',
  completed: false,
  owner: userOneId
}
const taskTwoData = {
  _id: mongoose.Types.ObjectId(),
  description: 'task two',
  completed: true,
  owner: userOneId
}
const taskThreeData = {
  _id: mongoose.Types.ObjectId(),
  description: 'task three',
  completed: false,
  owner: userTwoId
}

const initDataBase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await Promise.all([
    new User(userOneData).save(),
    new User(userTwoData).save(),
    new Task(taskOneData).save(),
    new Task(taskTwoData).save(),
    new Task(taskThreeData).save()
  ]);
}

module.exports = {
  userId: [userOneId, userTwoData],
  userData: [userOneData, userTwoData],
  taskData: [taskOneData, taskTwoData, taskThreeData],
  initDataBase
}
