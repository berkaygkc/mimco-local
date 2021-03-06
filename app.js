const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { create } = require('express-handlebars');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const formidable = require('express-formidable');
const json2xls = require('json2xls');
const session = require('express-session');
const checkSession = require('./src/middlewares/auth/checkSession')

const loginRouter = require('./routes/mainrouters/login');
const indexRouter = require('./routes/index');
const streamRouter = require('./routes/mainrouters/stream');
const adminRouter = require('./routes/mainrouters/admin');
const clientRouter = require('./routes/mainrouters/client');
const invoicesRouter = require('./routes/mainrouters/invoices');
const outgoingRouter = require('./routes/mainrouters/outgoing');
const incomingRouter = require('./routes/mainrouters/incoming');
const definitionCalls = require('./routes/mainrouters/edoc-def');
const despatchDefinitionsCalls = require('./routes/mainrouters/despatch-def');
const uploadsCalls = require('./routes/mainrouters/uploads');
const downloadsRouter = require('./routes/mainrouters/downloads');

const despatchesRouter = require('./routes/mainrouters/despatches');

const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');

const { insertSQLQueue } = require('./src/bull/queue/insertSQLQueue');
const { createRecordQueue } = require('./src/bull/queue/createRecordQueue');
const { createXMLQueue } = require('./src/bull/queue/createXMLQueue');
const { sendInvoiceQueue } = require('./src/bull/queue/sendInvoiceQueue');
const { updateInvoiceStatusQueue } = require('./src/bull/queue/updateInvoiceStatusQueue');
const { sendSelectedInvoicesQueue } = require('./src/bull/queue/sendSelectedInvoicesQueue');
const { updateRecordQueue } = require('./src/bull/queue/updateRecordQueue');
const { updateSQLQueue } = require('./src/bull/queue/updateSQLQueue');
const { deleteSQLQueue } = require('./src/bull/queue/deleteSQLQueue');
const { updateInvoiceNumberQueue } = require('./src/bull/queue/updateInvoiceNumberQueue');


const { insertDespatchSQLQueue } = require('./src/bull/queue/insertDespatchSQLQueue');
const { createRecordDespatchQueue } = require('./src/bull/queue/createRecordDespatchQueue');
const { updateDespatchRecordQueue } = require('./src/bull/queue/updateDespatchRecordQueue');
const { updateDespatchSQLQueue } = require('./src/bull/queue/updateDespatchSQLQueue');
const { sendDespatchQueue } = require('./src/bull/queue/sendDespatchQueue');
const { sendSelectedDespatchesQueue } = require('./src/bull/queue/sendSelectedDespatchesQueue');
const { deleteDespatchSQLQueue } = require('./src/bull/queue/deleteDespatchSQLQueue');
const { updateDespatchStatusQueue } = require('./src/bull/queue/updateDespatchStatusQueue');
const { updateDespatchNumberQueue } = require('./src/bull/queue/updateDespatchNumberQueue');

require('events').defaultMaxListeners = 100;

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/bull');
createBullBoard({
  queues: [
    new BullAdapter(insertSQLQueue),
    new BullAdapter(createRecordQueue),
    new BullAdapter(createXMLQueue),
    new BullAdapter(sendInvoiceQueue),
    new BullAdapter(updateInvoiceStatusQueue),
    new BullAdapter(sendSelectedInvoicesQueue),
    new BullAdapter(updateRecordQueue),
    new BullAdapter(updateSQLQueue),
    new BullAdapter(deleteSQLQueue),
    new BullAdapter(updateInvoiceNumberQueue),

    new BullAdapter(insertDespatchSQLQueue),
    new BullAdapter(createRecordDespatchQueue),
    new BullAdapter(updateDespatchRecordQueue),
    new BullAdapter(updateDespatchSQLQueue),
    new BullAdapter(deleteDespatchSQLQueue),
    new BullAdapter(sendDespatchQueue),
    new BullAdapter(sendSelectedDespatchesQueue),
    new BullAdapter(updateDespatchStatusQueue),
    new BullAdapter(updateDespatchNumberQueue),
  ],
  serverAdapter
});

global.__basedir = __dirname;
const app = express();

const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
});

hbs.helpers = require('./src/helpers/hbsHelpers/hbsHelpers');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//app.use(logger('dev'));
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
//add other middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(json2xls.middleware);

app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/stream', streamRouter);
app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use('/invoices', invoicesRouter);
app.use('/outgoing', outgoingRouter);
app.use('/incoming', incomingRouter);
app.use('/definitions', definitionCalls);
app.use('/uploads', uploadsCalls);
app.use('/downloads', downloadsRouter);
app.use('/admin/bull', serverAdapter.getRouter());
app.use('/despatches', despatchesRouter);
app.use('/despatch-def', despatchDefinitionsCalls);

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
