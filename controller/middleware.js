
const express = require('express');
const session = require('express-session');
const app = express();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
// Add this middleware to configure sessions
app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
  })
);


const checkTokenExpiration = (req, res, next) => {
  const token = req.session.token;
  if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
              delete req.session.token;
               res.redirect('/');
          } else {
            req.user = decoded;
              next();
          }
      });
  } else {
    res.redirect('/');
  }
};

module.exports = { checkTokenExpiration };


