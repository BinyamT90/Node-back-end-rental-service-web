var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./model/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors({
    'allowedHeaders': ['x-access-token','Content-Type'],
    'origin':"*",
    'credentials': true,
    'preflightContinue': true
}));
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(express.static(path.join(__dirname, 'build')));


app.get('/!*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
