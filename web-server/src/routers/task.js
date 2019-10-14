const express = require('express');
const api = require('../apis/task');
const auth = require('./middleware/auth');

const router = new express.Router();

router.post('/api/task', auth, api.createTask);
router.get('/api/task/:id', auth, api.getTask);
router.get('/api/task', auth, api.getTask);
router.patch('/api/task/:id', auth, api.updateTask);
router.delete('/api/task/:id', auth, api.deleteTask);

module.exports = router;