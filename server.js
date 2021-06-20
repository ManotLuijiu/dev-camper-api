const express = require('express');
const cors = require('cors');
require('dotenv').config();
const favicon = require('serve-favicon');
const path = require('path');
const rfs = require('rotating-file-stream');
const connectDB = require('./config/db');
connectDB();

const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./util/error');
const logger = require('./util/logger');
const { stream } = logger;
colors.enable();

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs'),
});

app.use(cors());
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
// Dev logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, _) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
