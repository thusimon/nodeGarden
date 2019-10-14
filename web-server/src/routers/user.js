const express = require('express');
const api = require('../apis/user');
const auth = require('./middleware/auth');

const router = new express.Router();

router.post('/api/user', api.register);
router.post('/api/user/login', api.login);
router.get('/api/user/me', auth, async (req, res) => {
  const user = req.user;
  try {
    await user.populate('tasks').execPopulate();
    return res.status(200).send({user, tasks: user.tasks});
  } catch (err) {
    return res.status(500).send(err.toString());
  }
});
router.get('/api/user/logout', auth, async (req, res) => {
  const user = req.user, curToken = req.token;
  try {
    user.tokens = user.tokens.filter(token => token.token != curToken);
    await user.save();
    return res.status(200).send('logout successfully');
  } catch (err) {
    return res.status(500).send(err.toString());
  }
});
router.get('/api/user/logoutall', auth, async (req, res) => {
  const user = req.user;
  try {
    user.tokens = [];
    await user.save();
    return res.status(200).send('logout all successfully');
  } catch (err) {
    return res.status(500).send(err.toString());
  }
});
//router.get('/api/user/:id', auth, api.read);
router.get('/api/user', api.read);
router.patch('/api/user/me', auth, async (req, res) => {
  let user = req.user;
  const allowedUpdateFields = ['name', 'email', 'password', 'age'];
  try {
    const isValidUpdate = Object.keys(req.body).every(key => allowedUpdateFields.includes(key));
    if (!isValidUpdate) {
      return res.status(400).send('invalid field to update');
    }
    user = Object.assign(user, req.body);
    await user.save();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.toString());
  }
});
router.delete('/api/user/me', auth, async (req, res) => {
  const user = req.user;
  try {
    await user.remove();
    return res.status(200).send(user);
  } catch(err) {
    return res.status(500).send(err.toString());
  }
});

module.exports = router;