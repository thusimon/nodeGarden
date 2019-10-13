const express = require('express');
const api = require('../apis/task');

const router = new express.Router();

router.post('/api/task', api.create);
router.get('/api/task/:id', api.read);
router.get('/api/task', api.read);
router.patch('/api/task/:id', api.update);
router.delete('/api/task/:id', api.del);

module.exports = router;