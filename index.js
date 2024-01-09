const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const moment = require('moment');
const bodyParser = require('body-parser'); 
app.set('view engine', 'ejs');
const flash = require('connect-flash');

app.use(flash());
app.use(express.static('public'));
app.use(express.static('upload'));
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
app.use(bodyParser.urlencoded({ extended: true }));
// const cookieParser = require('cookie-parser');
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Handle the error or log it appropriately
});
// app.use(cookieParser());
// Configure the session middleware
app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
  })
);

const socialRoute = require('./routes/socialRoute');
app.use('/',socialRoute);

app.listen(4000, function(){
    console.log('Server is running');
});




