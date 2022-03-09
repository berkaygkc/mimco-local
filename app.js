const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const streamRouter = require('./routes/mainrouters/stream');
const adminRouter = require('./routes/mainrouters/admin')

const {ExpressAdapter} = require('@bull-board/express');
const {createBullBoard} = require('@bull-board/api');
const {BullAdapter} = require('@bull-board/api/bullAdapter')
const {insertSQLQueue} = require('./src/bull/queue/insertSQLQueue');
const {createRecordQueue} = require('./src/bull/queue/createRecordQueue');
const {createXMLQueue} = require('./src/bull/queue/createXMLQueue');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/bull');
createBullBoard({
    queues:[
        new BullAdapter(insertSQLQueue),
        new BullAdapter(createRecordQueue),
        new BullAdapter(createXMLQueue),
    ],
    serverAdapter
});

global.__basedir = __dirname;
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stream', streamRouter);
app.use('/admin', adminRouter);
app.use('/admin/bull', serverAdapter.getRouter());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
