const express = require('express');

const router = new express.Router();

// default is 404
router.get('*', (req, res)=>{
  res.render('404', {
    headerTitle: '404',
    title: '404',
    errorMessage: 'Page not found',
    author: 'Lu'
  });
});

module.exports = router;