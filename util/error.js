const ErrorResponse = require('./errorResponse');
const logger = require('./logger');
const colors = require('colors');
colors.enable();

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //   logger.error(err.stack.red);
  console.group('Primitive Error');
  console.log(err, '\n');
  console.log('Type: ', typeof err, '\n');
  console.groupEnd();

  // console.group('Error Stack Group');
  // console.log(err.stack.red);
  // console.log('Type: ', typeof err.stack, '\n');
  // console.groupEnd();

  // console.group('Error Errors');
  // console.log(err.errors);
  // console.log(typeof err.errors);
  // console.groupEnd();

  // console.group('Error _message');
  // console.log(err._message);
  // console.log(typeof err._message);
  // console.groupEnd();

  // console.group('Error Key Group');
  // console.log(err.keyValue);
  // console.log('Type: ', typeof err.keyValue, '\n');
  // console.table(err.keyValue);
  // console.groupEnd();

  // console.group('Errors Group');
  // console.log(err.errors);
  // console.log(typeof err.errors);
  // console.groupEnd();

  // console.group('Errors Value');
  // const errorsValue = Object.values(err.errors)[0].message;
  // console.log(errorsValue);
  // console.groupEnd();

  // console.group('Test Props');
  // const testProps = Object.values(err.errors)[0].properties.message;
  // console.log(testProps);
  // console.groupEnd();

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Source not found with id of ${err.value}`;
    const reason = `${err.reason}`;
    // console.log(reason.split(':')[1]);
    // console.log(reason.split(':')[1].trim());
    const alignReason = reason.split(':')[1].trim();
    // console.log(alignReason);

    error = new ErrorResponse(message, 404, alignReason);
  }

  // Mongoose duplicate key { name: "TEST DATA" }
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    // console.log(err.stack);
    // console.log('error stack type:', typeof err.stack);
    const errStack = err.stack.split('\n')[0];
    // console.log(errStack);
    const errIndex = errStack.split('index: ')[1];
    // console.log(errIndex);
    const reason = errIndex.split('key: ')[1];
    // console.log(reason);
    const alignReason =
      'Duplicating at field ' +
      reason
        .substring(reason.lastIndexOf('{') + 1, reason.lastIndexOf('}'))
        .trim();
    // console.log(alignReason);
    const jsonKey = JSON.stringify(err.keyValue);
    const alignKey = `Duplicating at field ${jsonKey}`;
    console.log('   Key: Value');
    console.log(err.keyValue);
    console.log('Data Type:', typeof err.keyValue, '\n');
    console.table(err.keyValue);
    error = new ErrorResponse(message, 400, alignKey);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    console.log('Validation Error', err._message);
    const message = err._message;
    console.log(message);
    // const reason = Object.values(err.errors)[0].message;
    const reason = Object.values(err.errors).map((val) => val.message);
    console.log(reason);
    console.log(typeof reason);
    error = new ErrorResponse(message, 400, reason);
  }

  res.status(error.statusCode || 500).json({
    name: error.name || err.name,
    success: false,
    error: error.message || 'Server Error',
    reason: error.reason,
  });
};

module.exports = errorHandler;
