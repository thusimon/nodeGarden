const express = require('express');

const router = new express.Router();

router.get('/about', (req, res)=>{
  res.render('about', {
    headerTitle: 'About',
    title: 'About',
    author: 'Lu'
  })
});

module.exports = router;