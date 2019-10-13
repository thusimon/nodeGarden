const express = require('express');
const api = require('../apis/user');

const router = new express.Router();

router.post('/api/user', api.create);
router.get('/api/user/:id', api.read);
router.get('/api/user', api.read);
router.patch('/api/user/:id', api.update);
router.delete('/api/user/:id', api.del);

module.exports = router;