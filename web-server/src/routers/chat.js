const express = require('express');

const router = new express.Router();

router.get('/chat', (req, res) => {
  res.render('chat', {
    headerTitle: 'Chat',
    title: 'Welcome to Chat',
    author: 'Lu'
  });
});

module.exports = router;