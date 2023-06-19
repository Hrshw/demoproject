const express = require('express');
const port = 3300;
const app = express();
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
// const { sessionMiddleware, cookieMiddleware } = require('./src/middlewares/sessionMiddleware');

// database related code
require('./src/mngoserver/conn');
require('./src/mngoserver/modal/schema');

app.use(express.json());
app.use(cookieParser());
// // Use session middleware
// app.use(sessionMiddleware);
// // Use cookie middleware
// app.use(cookieMiddleware);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Import the routes from routes.js
const routes = require('./src/routes/routes');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Render the signup view for the root URL
app.get('/', (req, res) => {
  res.render('signup');
});
app.get('/signin', (req, res) => {
  res.render('signin');
});
app.get('/getme', (req, res) => {
  res.render('getme');
});
app.get('/removemembers', (req, res) => {
  res.render('removemembers');
});
app.get('/createcomunity', (req, res) => {
  res.render('createcomunity');
});
app.get('/addmember', (req, res) => {
  res.render('addmember');
});


// Register the routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is started on port: ${port}`);
});
