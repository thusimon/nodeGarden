const express = require('express');

const router = new express.Router();

router.get('', (req, res)=>{
  res.render('index', {
    headerTitle: 'Home',
    title: 'Welcome to the App',
    author: 'Lu'
  })
});

module.exports = router;