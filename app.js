const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {create} = require('express-handlebars');

const indexRouter = require('./routes/index');
const streamRouter = require('./routes/mainrouters/stream');
const adminRouter = require('./routes/mainrouters/admin');
const clientRouter = require('./routes/mainrouters/client');
const invoicesRouter = require('./routes/mainrouters/invoices');

const {ExpressAdapter} = require('@bull-board/express');
const {createBullBoard} = require('@bull-board/api');
const {BullAdapter} = require('@bull-board/api/bullAdapter')
const {insertSQLQueue} = require('./src/bull/queue/insertSQLQueue');
const {createRecordQueue} = require('./src/bull/queue/createRecordQueue');
const {createXMLQueue} = require('./src/bull/queue/createXMLQueue');
const {sendInvoiceQueue} = require('./src/bull/queue/sendInvoiceQueue');
const {updateInvoiceStatusQueue} = require('./src/bull/queue/updateInvoiceStatusQueue');
const {sendSelectedInvoicesQueue} = require('./src/bull/queue/sendSelectedInvoicesQueue');
const {updateRecordQueue} = require('./src/bull/queue/updateRecordQueue');
const {updateSQLQueue} = require('./src/bull/queue/updateSQLQueue');
const {deleteSQLQueue} = require('./src/bull/queue/deleteSQLQueue');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/bull');
createBullBoard({
    queues:[
        new BullAdapter(insertSQLQueue),
        new BullAdapter(createRecordQueue),
        new BullAdapter(createXMLQueue),
        new BullAdapter(sendInvoiceQueue),
        new BullAdapter(updateInvoiceStatusQueue),
        new BullAdapter(sendSelectedInvoicesQueue),
        new BullAdapter(updateRecordQueue),
        new BullAdapter(updateSQLQueue),
        new BullAdapter(deleteSQLQueue),
    ],
    serverAdapter
});

global.__basedir = __dirname;
const app = express();

const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname+ '/views/layouts/',
  partialsDir: __dirname+ '/views/partials/'
});

hbs.helpers = require('./src/helpers/hbsHelpers/hbsHelpers');
// view engine setup
app.engine('hbs', hbs.engine);
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/stream', streamRouter);
app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use('/invoices', invoicesRouter);
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
