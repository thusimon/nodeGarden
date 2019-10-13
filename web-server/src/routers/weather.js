const express = require('express');
const weatherAPI = require('../apis/weather');
const router = new express.Router();

router.get('/weather', (req, res) => {
  res.render('weather', {
    headerTitle: 'Weather',
    title: 'Welcome to Weather Report',
    author: 'Lu'
  })
});
router.get('/api/weather', weatherAPI);

module.exports = router;