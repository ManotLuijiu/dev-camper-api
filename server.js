const express = require('express');
require('dotenv').config();
const favicon = require('serve-favicon');
const path = require('path');
const rfs = require('rotating-file-stream');

const morgan = require('morgan');
const logger = require('./util/logger');
const { stream } = logger;

const bootcamps = require('./routes/bootcamps');
const app = express();

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs'),
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Morgan
morgan.token('th-date', function (req, res) {
  const date = new Date();
  return date;
});
app.use(morgan('common', { stream: accessLogStream }));
app.use(
  morgan(
    ':th-date :method[pretty] :url :status :res[content-length] - :response-time ms',
    { stream }
  )
);

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
