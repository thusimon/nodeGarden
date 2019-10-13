const express = require('express');

const router = new express.Router();

router.get('/help', (req, res)=>{
  res.render('help', {
    headerTitle: 'Help',
    title: 'Please contact us for help',
    author: 'Lu'
  })
});

router.get('/help/*', (req, res)=>{
  res.render('404', {
    headerTitle: '404',
    title: '404',
    errorMessage: 'Help Page not found',
    author: 'Lu'
  })
});

module.exports = router;