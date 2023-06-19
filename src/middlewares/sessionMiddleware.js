const session = require('express-session');
const cookieParser = require('cookie-parser');

const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
});

const cookieMiddleware = cookieParser();

module.exports = { sessionMiddleware, cookieMiddleware };
