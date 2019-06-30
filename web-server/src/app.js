
const path = require('path');
const express = require('express');
const getGeoLocation = require('./utils/getGeoLocation');
const getWeather = require('./utils/getWeather');
const hbs = require('hbs');
const app = express();
const port = process.env.PORT || 3002;

// define path for express config
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');
const publicDirectoryPath = path.join(__dirname, '../public');

app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialPath);
app.use(express.static(publicDirectoryPath));

app.get('', (req, res)=>{
  res.render('index', {
    headerTitle: 'Home',
    title: 'Welcome to weather report',
    author: 'Lu'
  })
});

app.get('/about', (req, res)=>{
  res.render('about', {
    headerTitle: 'About',
    title: 'About',
    author: 'Lu'
  })
});

app.get('/help', (req, res)=>{
  res.render('help', {
    headerTitle: 'Help',
    title: 'Please contact us for help',
    author: 'Lu'
  })
});

app.get('/help/*', (req, res)=>{
  res.render('404', {
    headerTitle: '404',
    title: '404',
    errorMessage: 'Help Page not found',
    author: 'Lu'
  })
});

app.get('/weather', (req, res) => {
  if (req.query.address) {
    const address = req.query.address;
    let location;
    getGeoLocation(address)
      .then(loc => {
        location = loc;
        return getWeather(location.latitude, location.longtitude)
      })
      .then(weather => {
        return res.send({
          weather,
          location,
          address
        });
      })
      .catch(err => {
        return res.send({err});
      });
  } else {
    return res.send({
      err: 'Please send correct address parameter'
    })
  }
});

app.get('*', (req, res)=>{
  res.render('404', {
    headerTitle: '404',
    title: '404',
    errorMessage: 'Page not found',
    author: 'Lu'
  });
});

app.listen(port, () => {
  console.log('Server is up on port 3002')
})