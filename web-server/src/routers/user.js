const express = require('express');
const api = require('../apis/user');
const auth = require('./middleware/auth');
const multer = require('multer');
const User = require('../models/user');
const sharp = require('sharp');
const { sendGoodbyeEmail } = require('../email/account');

const router = new express.Router();
const uploader = multer({
  // no dest, meaning multer will pass the file data on to the next handler
  limits: {
    fileSize: 1024*1024
  },
  fileFilter(req, file, cb) {
    if (file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(undefined, true);
    } else {
      return cb(new Error('please upload jpg/jpeg/png'));
    }
  }
});
router.post('/api/user', api.register);
router.post('/api/user/login', api.login);
router.post('/api/user/me/avatar', auth, uploader.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  return res.status(200).send('saved avatar successfully');
}, (error, req, res, next) => {
  return res.status(400).send(error.message);
});
router.get('/api/user/:id/avatar', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error('no id');
    }
    const user = await User.findById(id);
    if (user.avatar) {
      res.set('Content-Type', 'image/png');
      return res.status(200).send(user.avatar);
    } else {
      throw new Error('no avatar');
    }
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
router.get('/api/user/activate', auth, async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(403).send('missing activate token');
    }
    const updatedUser = await User.activateUser(token);
    return res.status(200).send('successfully activated');
  } catch (err) {
    return res.status(403).send(err.message);
  }
});
router.get('/api/user/deactivate', auth, async (req, res) => {
  try {
    const user = req.user;
    user.status = 0;
    await user.save();
    sendGoodbyeEmail(user.email, user.name);
    return res.status(200).send('successfully deactivated');
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.delete('/api/user/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    return res.status(200).send('deleted avatar successfully');
  } catch (err) {
    return res.status(500).send(err.message);
  }
})

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