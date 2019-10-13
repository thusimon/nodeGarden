const express = require('express');

const router = new express.Router();

router.get('/bio', (req, res) => {
  res.render('bio', {
    headerTitle: 'Bio',
    title: 'Welcome to Bio Recorder',
    author: 'Lu'
  })
});

module.exports = router;