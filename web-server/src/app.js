
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();
const port = process.env.PORT || 3002;

// define path for express config
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');
const publicDirectoryPath = path.join(__dirname, '../public');

// connect db
require('./db/mongoose');

// APIs
const weatherAPI = require('./apis/weather');
const userPostAPI = require('./apis/user');
const taskPostAPI = require('./apis/task');

app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialPath);
app.use(express.static(publicDirectoryPath));

app.use(express.json());

app.get('', (req, res)=>{
  res.render('index', {
    headerTitle: 'Home',
    title: 'Welcome to the App',
    author: 'Lu'
  })
});

app.get('/weather', (req, res) => {
  res.render('weather', {
    headerTitle: 'Weather',
    title: 'Welcome to Weather Report',
    author: 'Lu'
  })
});

app.get('/bio', (req, res) => {
  res.render('bio', {
    headerTitle: 'Bio',
    title: 'Welcome to Bio Recorder',
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

// APIs
app.get('/api/weather', weatherAPI);
app.post('/api/user', userPostAPI);
app.post('/api/task', taskPostAPI);

// default is 404
app.get('*', (req, res)=>{
  res.render('404', {
    headerTitle: '404',
    title: '404',
    errorMessage: 'Page not found',
    author: 'Lu'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})