
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
// Routers
const homeRouter = require('./routers/home');
const weatherRouter = require('./routers/weather');
const bioRouter = require('./routers/bio');
const helpRouter = require('./routers/help');
const aboutRouter = require('./routers/about');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const errorRouter = require('./routers/error');

app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialPath);

app.use(express.static(publicDirectoryPath));

app.use(express.json());

app.use(homeRouter);
app.use(weatherRouter);
app.use(bioRouter);
app.use(helpRouter);
app.use(aboutRouter);
app.use(userRouter);
app.use(taskRouter);
app.use(errorRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
