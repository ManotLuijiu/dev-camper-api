class ErrorResponse extends Error {
  constructor(message, statusCode, reason) {
    super(message);
    this.statusCode = statusCode;
    this.reason = reason;
    this.name = 'ErrorResponse';
  }
}

module.exports = ErrorResponse;
