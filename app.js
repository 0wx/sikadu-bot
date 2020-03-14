var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mobileBrowser = require('detect-mobile-browser');
var usersRouter = require('./routes/users');

var app = express();

const cekdb = require('./controller/cek/cekdb')
//parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mobileBrowser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(301, 'http://sikadu.unwahas.ac.id')
});
app.get('/:data', function (req, res) {
  console.log(req.params)
  cekdb(req.params.data, hasil => {
    if (hasil) {
      res.send('Anda sudah login')
    }
    else {
      console.log(req.SmartPhone.isAny())
      var m = req.SmartPhone.isAny() ? '-m' : '';
      res.render('index' + m, { title: "Masuk ke Sikadu Bot", error: false });
      
    }
  })
});

app.get('/:data/gagal', function (req, res) {
  console.log(req.headers)
  var m = req.SmartPhone.isAny() ? '-m' : '';
  res.render('index' + m, { title: "Masuk ke Sikadu Bot", error: true });
});

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
