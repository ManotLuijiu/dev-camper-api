const express = require('express');
require('dotenv').config();
const favicon = require('serve-favicon');
const path = require('path');
const rfs = require('rotating-file-stream');

const morgan = require('morgan');
const logger = require('./util/logger');
const { stream } = logger;

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
  const data = new Date();
  return date;
});
app.use(morgan('common', { stream: accessLogStream }));
app.use(
  morgan(
    ':th-date :method[pretty] :url :status :res[content-length] - :response-time ms',
    { stream }
  )
);

// Routes
app.get('/api/v1/bootcamps', (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
});

app.get('/api/v1/bootcamps/:id', (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
});

app.post('/api/v1/bootcamps', (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new bootcamps' });
});

app.put('/api/v1/bootcamps/:id', (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
});

app.delete('/api/v1/bootcamps/:id', (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
