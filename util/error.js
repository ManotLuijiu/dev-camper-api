const ErrorResponse = require('./errorResponse');
const logger = require('./logger');
const _ = require('lodash');
const colors = require('colors');
colors.enable();

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //   logger.error(err.stack.red);
  // console.group('Primitive Error');
  console.log(err, '\n');
  console.log('Error Name: %s', err.name);
  console.log('Error Value: %s', err.value);
  console.log('Type: ', typeof err, '\n');
  // console.groupEnd();

  console.group('Error Stack Group');
  console.log(err.stack.red);
  console.log('Type: ', typeof err.stack, '\n');
  console.groupEnd();

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

  // No user found response TypeError
  if (err.name === 'TypeError' && err.value === undefined) {
    const errValue = err.stack.split('\n')[0];
    console.log('errValue %s', errValue);
    const message = `${errValue}`;
    // const idUndefined = errValue.match(/id/g)[0];
    // console.log(idUndefined);
    const reason1 = `Please check if you have protect or authorize at particular route \n or you did'n logged in`;
    const reason2 = `Please register`;

    if (errValue.match(/id/g)[0] === 'id') {
      error = new ErrorResponse(message, 403, reason1);
    } else {
      error = new ErrorResponse(message, 403, reason2);
    }
  }

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

  // Coding Error
  if (err.name === 'ReferenceError') {
    const data = err.stack.split('\n');
    console.log(data);
    const message = data[0];
    const reason = data[1].trim();
    console.log(reason);
    console.log(reason.slice(reason.lastIndexOf('/') + 1, reason.indexOf(')')));
    // console.log(reason.split(':')[1]);
    // console.log(reason.split(':')[1].trim());
    const alignReason = `Please check code at: ${reason.slice(
      reason.lastIndexOf('/') + 1,
      reason.indexOf(')')
    )}`;
    // console.log(alignReason);

    error = new ErrorResponse(message, 404, alignReason);
  }

  // Mongoose duplicate key { name: "TEST DATA" }
  // console.log(err.keyPattern.bootcamp, err.keyPattern.user);
  if (err.keyPattern) {
    const reviewLimit =
      err.keyPattern.bootcamp === 1 && err.keyPattern.user === 1;
    console.log(reviewLimit);
    if (err.code === 11000 && reviewLimit === true) {
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
      console.table(err.keyPattern);

      error = new ErrorResponse(
        message,
        400,
        'You already add review for this bootcamp'
      );
    } else {
      error = new ErrorResponse(message, 400, alignKey);
    }
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

  // Mongoose syntax error
  if (err.name === 'SyntaxError') {
    const body = err.body;
    const lastBody = body.substring(body.length - 3);
    const regex = /,/g;
    const found = lastBody.match(regex);
    if (found[0] === ',') {
      const message = `${err.message} => ${found[0]}`;
      const reason = `Please delete comma at last line.`;
      error = new ErrorResponse(message, 400, reason);
    }
  }

  res.status(error.statusCode || 500).json({
    name: error.name || err.name,
    success: false,
    error: error.message || 'Server Error',
    reason: error.reason,
  });
};

module.exports = errorHandler;
