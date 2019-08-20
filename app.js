var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var mqtt = require('./routes/mqtt');//MQTT
var sysconf = require('./routes/sysconf');//Server Configuration
var timeDif = require('./routes/timeDif');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/mqtt', mqtt);//MQTT
app.use('/sysconf', sysconf);//Server Configuration
app.use('/timeDif', timeDif);

module.exports = app;
